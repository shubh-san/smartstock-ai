import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_SHOP,
  INITIAL_PRODUCTS,
  INITIAL_DISCOUNT_RECOMMENDATIONS,
  INITIAL_SALES,
  CATEGORIES,
} from '../services/mockData';
import { calculateDaysRemaining } from '../utils/dateUtils';
import { apiService } from '../services/apiService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [shop, setShop] = useState(() => {
    const saved = localStorage.getItem('smartstock_shop');
    return saved ? JSON.parse(saved) : INITIAL_SHOP;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('smartstock_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [discounts, setDiscounts] = useState(() => {
    const saved = localStorage.getItem('smartstock_discounts');
    return saved ? JSON.parse(saved) : INITIAL_DISCOUNT_RECOMMENDATIONS;
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('smartstock_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [voiceSettings, setVoiceSettings] = useState(() => {
    const saved = localStorage.getItem('smartstock_voice_settings');
    return saved ? JSON.parse(saved) : { autoSpeak: true, rate: 0.95 };
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('smartstock_shop', JSON.stringify(shop));
  }, [shop]);

  useEffect(() => {
    localStorage.setItem('smartstock_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('smartstock_discounts', JSON.stringify(discounts));
  }, [discounts]);

  useEffect(() => {
    localStorage.setItem('smartstock_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('smartstock_voice_settings', JSON.stringify(voiceSettings));
  }, [voiceSettings]);

  // Synchronize with live backend when URL is configured
  useEffect(() => {
    if (apiService.isLiveBackend()) {
      apiService
        .getProducts()
        .then((liveProds) => {
          if (liveProds && Array.isArray(liveProds)) setProducts(liveProds);
        })
        .catch((err) => console.warn('Could not load live products from API:', err));

      apiService
        .getDiscounts()
        .then((liveDiscounts) => {
          if (liveDiscounts && Array.isArray(liveDiscounts)) setDiscounts(liveDiscounts);
        })
        .catch((err) => console.warn('Could not load live discounts from API:', err));

      apiService
        .getSales()
        .then((liveSales) => {
          if (liveSales && Array.isArray(liveSales)) setSales(liveSales);
        })
        .catch((err) => console.warn('Could not load live sales from API:', err));
    }
  }, []);

  // Derived metrics
  const getMetrics = () => {
    let expiringSoonCount = 0;
    let immediateAttentionCount = 0;
    let expiredCount = 0;
    let totalItemsStock = 0;

    products.forEach((prod) => {
      let prodExpiringSoon = false;
      let prodImmediate = false;
      let prodExpired = false;

      prod.batches.forEach((batch) => {
        totalItemsStock += Number(batch.quantity) || 0;
        const days = calculateDaysRemaining(batch.expiryDate);
        if (days < 0) {
          prodExpired = true;
        } else if (days <= 3) {
          prodImmediate = true;
        } else if (days <= 7) {
          prodExpiringSoon = true;
        }
      });

      if (prodExpired) expiredCount++;
      if (prodImmediate) immediateAttentionCount++;
      if (prodExpiringSoon) expiringSoonCount++;
    });

    const todaySalesTotal = sales.reduce((acc, curr) => acc + (Number(curr.grandTotal) || 0), 0);
    const pendingDiscountsCount = discounts.filter((d) => d.status === 'pending').length;
    const lossAvoidedTotal = discounts
      .filter((d) => d.status === 'accepted')
      .reduce((acc, curr) => acc + (Number(curr.potentialLossAvoided) || 0), 1250);

    return {
      totalProducts: products.length,
      totalItemsStock,
      expiringSoonCount,
      immediateAttentionCount,
      expiredCount,
      todaySalesTotal,
      pendingDiscountsCount,
      lossAvoidedTotal,
    };
  };

  // Add Product
  const addProduct = (productData) => {
    const newProd = {
      id: `prod_${Date.now()}`,
      name: productData.name,
      nameEn: productData.nameEn || productData.name,
      category: productData.category || 'cat_dairy',
      barcode: productData.barcode || `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
      image: productData.image || '📦',
      basePrice: Number(productData.purchasePrice) || 0,
      sellingPrice: Number(productData.sellingPrice) || 0,
      unit: productData.unit || 'pkt',
      batches: [
        {
          id: `batch_${Date.now()}`,
          batchNumber: productData.batchNumber || `B-${Math.floor(100 + Math.random() * 900)}`,
          quantity: Number(productData.quantity) || 1,
          purchasePrice: Number(productData.purchasePrice) || 0,
          sellingPrice: Number(productData.sellingPrice) || 0,
          discountedPrice: null,
          mfgDate: productData.mfgDate || new Date().toISOString().split('T')[0],
          expiryDate: productData.expiryDate,
        },
      ],
    };

    setProducts((prev) => [newProd, ...prev]);
    if (apiService.isLiveBackend()) {
      apiService.createProduct(newProd).catch((e) => console.warn('API createProduct failed:', e));
    }
    return newProd;
  };

  // Add Batch to existing product
  const addBatchToProduct = (productId, batchData) => {
    let createdBatch = null;
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const newBatch = {
          id: `batch_${Date.now()}`,
          batchNumber: batchData.batchNumber || `B-${Math.floor(100 + Math.random() * 900)}`,
          quantity: Number(batchData.quantity) || 1,
          purchasePrice: Number(batchData.purchasePrice) || prod.basePrice,
          sellingPrice: Number(batchData.sellingPrice) || prod.sellingPrice,
          discountedPrice: null,
          mfgDate: batchData.mfgDate || new Date().toISOString().split('T')[0],
          expiryDate: batchData.expiryDate,
        };
        createdBatch = newBatch;
        return {
          ...prod,
          batches: [...prod.batches, newBatch],
        };
      })
    );

    if (apiService.isLiveBackend() && createdBatch) {
      apiService.addBatch(productId, createdBatch).catch((e) => console.warn('API addBatch failed:', e));
    }
  };

  // Update Product info
  const updateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    if (apiService.isLiveBackend()) {
      apiService.updateProduct(updatedProduct.id, updatedProduct).catch((e) => console.warn('API updateProduct failed:', e));
    }
  };

  // Delete Product
  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setDiscounts((prev) => prev.filter((d) => d.productId !== productId));
    if (apiService.isLiveBackend()) {
      apiService.deleteProduct(productId).catch((e) => console.warn('API deleteProduct failed:', e));
    }
  };

  // Record Sale & reduce inventory
  const recordSale = (saleData) => {
    const newSale = {
      id: `sale_${Date.now()}`,
      timestamp: new Date().toISOString(),
      customerName: saleData.customerName || 'नकद ग्राहक (Cash Customer)',
      paymentMethod: saleData.paymentMethod || 'Cash',
      items: saleData.items,
      subtotal: saleData.subtotal,
      discount: saleData.discount,
      grandTotal: saleData.grandTotal,
    };

    // Decrease quantities from corresponding batches
    setProducts((prevProducts) => {
      const updated = [...prevProducts];
      saleData.items.forEach((item) => {
        const prodIndex = updated.findIndex((p) => p.id === item.productId);
        if (prodIndex !== -1) {
          const prod = { ...updated[prodIndex] };
          let neededQty = item.qty;

          // Deduct from batches, prioritizing earliest expiry
          const sortedBatches = [...prod.batches].sort((a, b) => {
            return new Date(a.expiryDate) - new Date(b.expiryDate);
          });

          const newBatches = sortedBatches.map((batch) => {
            if (neededQty <= 0) return batch;
            const available = batch.quantity;
            if (available <= neededQty) {
              neededQty -= available;
              return { ...batch, quantity: 0 };
            } else {
              const remaining = available - neededQty;
              neededQty = 0;
              return { ...batch, quantity: remaining };
            }
          });

          prod.batches = newBatches.filter((b) => b.quantity > 0 || prod.batches.length === 1);
          updated[prodIndex] = prod;
        }
      });
      return updated;
    });

    setSales((prev) => [newSale, ...prev]);
    if (apiService.isLiveBackend()) {
      apiService.recordSale(newSale).catch((e) => console.warn('API recordSale failed:', e));
    }
    return newSale;
  };

  // Accept Discount
  const acceptDiscount = (recommendationId) => {
    const rec = discounts.find((d) => d.id === recommendationId);
    if (!rec) return;

    // Apply discountedPrice to the batch or product
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== rec.productId) return prod;
        return {
          ...prod,
          batches: prod.batches.map((b) => {
            if (b.id === rec.batchId || prod.batches.length === 1) {
              return { ...b, discountedPrice: rec.suggestedPrice };
            }
            return b;
          }),
        };
      })
    );

    setDiscounts((prev) =>
      prev.map((d) => (d.id === recommendationId ? { ...d, status: 'accepted' } : d))
    );

    if (apiService.isLiveBackend()) {
      apiService
        .applyDiscount(recommendationId, { status: 'accepted', newPrice: rec.suggestedPrice })
        .catch((e) => console.warn('API applyDiscount failed:', e));
    }
  };

  // Reject Discount
  const rejectDiscount = (recommendationId) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === recommendationId ? { ...d, status: 'rejected' } : d))
    );

    if (apiService.isLiveBackend()) {
      apiService.rejectDiscount(recommendationId).catch((e) => console.warn('API rejectDiscount failed:', e));
    }
  };

  // Modify Discount
  const modifyDiscount = (recommendationId, newPrice) => {
    const rec = discounts.find((d) => d.id === recommendationId);
    if (!rec) return;
    const numPrice = Number(newPrice);

    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== rec.productId) return prod;
        return {
          ...prod,
          batches: prod.batches.map((b) => {
            if (b.id === rec.batchId || prod.batches.length === 1) {
              return { ...b, discountedPrice: numPrice };
            }
            return b;
          }),
        };
      })
    );

    setDiscounts((prev) =>
      prev.map((d) =>
        d.id === recommendationId
          ? {
              ...d,
              suggestedPrice: numPrice,
              suggestedDiscountPct: Math.round(((d.currentPrice - numPrice) / d.currentPrice) * 100),
              status: 'accepted',
            }
          : d
      )
    );
  };

  // Reset to initial demo mock data
  const resetToMockData = () => {
    setShop(INITIAL_SHOP);
    setProducts(INITIAL_PRODUCTS);
    setDiscounts(INITIAL_DISCOUNT_RECOMMENDATIONS);
    setSales(INITIAL_SALES);
  };

  return (
    <AppContext.Provider
      value={{
        shop,
        setShop,
        products,
        discounts,
        sales,
        categories: CATEGORIES,
        voiceSettings,
        setVoiceSettings,
        getMetrics,
        addProduct,
        addBatchToProduct,
        updateProduct,
        deleteProduct,
        recordSale,
        acceptDiscount,
        rejectDiscount,
        modifyDiscount,
        resetToMockData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
