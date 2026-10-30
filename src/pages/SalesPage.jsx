import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  ReceiptIndianRupee,
  ShoppingBag,
  CreditCard,
  Wallet,
  BookOpen,
  Sparkles,
  Printer,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SalesPage = () => {
  const { t, language } = useLanguage();
  const { products, recordSale } = useApp();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [billItems, setBillItems] = useState([]);
  const [customerName, setCustomerName] = useState('नकद ग्राहक');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [completedSale, setCompletedSale] = useState(null);

  // Check if routed with ?product=prod_id
  useEffect(() => {
    const prefillId = searchParams.get('product');
    if (prefillId) {
      const target = products.find((p) => p.id === prefillId);
      if (target) {
        addItemToBill(target);
      }
    }
  }, [searchParams, products]);

  // Available stock calculation
  const getProductStock = (prod) => {
    return prod.batches.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0);
  };

  const getEffectivePrice = (prod) => {
    // Check if any batch has discountedPrice
    const discounted = prod.batches.find((b) => b.discountedPrice);
    if (discounted) return discounted.discountedPrice;
    return prod.sellingPrice;
  };

  const addItemToBill = (prod) => {
    const currentStock = getProductStock(prod);
    if (currentStock <= 0) {
      alert(language === 'hi' ? 'इस सामान का स्टॉक खत्म हो चुका है!' : 'Out of stock!');
      return;
    }

    const price = getEffectivePrice(prod);
    setBillItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === prod.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        const currentQty = updated[existingIndex].qty;
        if (currentQty >= currentStock) {
          alert('स्टॉक में केवल ' + currentStock + ' उपलब्ध हैं!');
          return prev;
        }
        updated[existingIndex].qty += 1;
        updated[existingIndex].total = updated[existingIndex].qty * price;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: prod.id,
            name: language === 'hi' ? prod.name : prod.nameEn,
            unit: prod.unit,
            rate: price,
            qty: 1,
            total: price,
            maxStock: currentStock,
          },
        ];
      }
    });
  };

  const updateItemQty = (productId, delta) => {
    setBillItems((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.qty + delta;
            if (newQty <= 0) return null;
            if (newQty > item.maxStock) {
              alert('अधिकतम उपलब्ध स्टॉक: ' + item.maxStock);
              return item;
            }
            return {
              ...item,
              qty: newQty,
              total: newQty * item.rate,
            };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeItem = (productId) => {
    setBillItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearBill = () => {
    setBillItems([]);
  };

  // Calculations
  const subtotal = billItems.reduce((acc, curr) => acc + curr.total, 0);
  const discountTotal = 0;
  const grandTotal = subtotal - discountTotal;

  const handleCompleteSale = () => {
    if (billItems.length === 0) return;

    const saleRecord = recordSale({
      customerName,
      paymentMethod,
      items: billItems,
      subtotal,
      discount: discountTotal,
      grandTotal,
    });

    setCompletedSale(saleRecord);
    setBillItems([]);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  // Filter products for left selection
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.barcode && p.barcode.includes(searchQuery));
      return matchesSearch;
    });
  }, [products, searchQuery]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>{t('sales.title')}</span>
          <ReceiptIndianRupee className="w-7 h-7 text-green-800" />
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">
          {t('sales.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Product Picker (7 cols on Desktop) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-soft">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('sales.searchOrScan')}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-green-600 font-semibold text-slate-900 text-sm"
              />
            </div>
          </div>

          {/* Product Quick-Click Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map((prod) => {
              const stock = getProductStock(prod);
              const price = getEffectivePrice(prod);
              const hasDiscount = prod.batches.some((b) => b.discountedPrice);

              return (
                <button
                  key={prod.id}
                  onClick={() => addItemToBill(prod)}
                  disabled={stock <= 0}
                  className={`p-4 rounded-3xl bg-white border-2 text-left flex flex-col justify-between transition-all active:scale-95 shadow-2xs hover:shadow-card ${
                    stock <= 0
                      ? 'opacity-40 border-slate-200 cursor-not-allowed'
                      : 'hover:border-green-600 border-slate-200/90'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{prod.image || '📦'}</span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          stock <= 5
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {stock} {prod.unit}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug">
                      {language === 'hi' ? prod.name : prod.nameEn}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-green-900">
                        ₹{price}
                      </span>
                      {hasDiscount && (
                        <span className="text-[10px] text-slate-400 line-through ml-1">
                          ₹{prod.sellingPrice}
                        </span>
                      )}
                    </div>
                    <span className="w-7 h-7 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold text-sm">
                      +
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Current Bill / Register (5 cols on Desktop) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-6 shadow-card space-y-5 sticky top-24">
            {/* Bill Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-green-800" />
                <h3 className="font-black text-lg text-slate-900">
                  {t('sales.currentBill')}
                </h3>
              </div>
              {billItems.length > 0 && (
                <button
                  onClick={clearBill}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline"
                >
                  {t('actions.clearBill')}
                </button>
              )}
            </div>

            {/* Customer Name input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                ग्राहक का नाम (Customer):
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="नकद ग्राहक / नाम"
                className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 focus:border-green-600 font-semibold text-xs text-slate-900"
              />
            </div>

            {/* Bill Items List */}
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {billItems.length > 0 ? (
                billItems.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between gap-2 border border-slate-200/60"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-xs text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        ₹{item.rate} × {item.qty} ={' '}
                        <span className="font-bold text-slate-800">
                          ₹{item.total}
                        </span>
                      </p>
                    </div>

                    {/* Big Touch Numeric Controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateItemQty(item.productId, -1)}
                        className="w-8 h-8 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700 shadow-2xs active:scale-95"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-7 text-center font-black text-sm text-slate-900">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => updateItemQty(item.productId, 1)}
                        className="w-8 h-8 rounded-xl bg-green-800 text-white hover:bg-green-700 flex items-center justify-center font-bold shadow-2xs active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors ml-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-50 text-slate-300" />
                  <p>{t('sales.emptyBillNotice')}</p>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {t('sales.paymentMethod')}:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash')}
                  className={`p-2.5 rounded-xl border-2 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'Cash'
                      ? 'border-green-800 bg-green-50 text-green-900'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-green-700" />
                  <span>{t('sales.cash')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-2.5 rounded-xl border-2 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-green-800 bg-green-50 text-green-900'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>{t('sales.upi')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Khata')}
                  className={`p-2.5 rounded-xl border-2 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'Khata'
                      ? 'border-green-800 bg-green-50 text-green-900'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>{t('sales.khata')}</span>
                </button>
              </div>
            </div>

            {/* Total Summary */}
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 font-semibold">
                <span>{t('sales.subtotal')}</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="font-extrabold text-sm text-slate-900">
                  {t('sales.grandTotal')}
                </span>
                <span className="text-2xl font-black text-green-900">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>

            {/* Large Complete Sale Button */}
            <button
              onClick={handleCompleteSale}
              disabled={billItems.length === 0}
              className="w-full py-4 rounded-2xl bg-green-800 hover:bg-green-700 disabled:opacity-40 text-white font-black text-base shadow-lg shadow-green-900/10 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-green-200" />
              <span>{t('sales.completeSaleBtn', { amount: grandTotal })}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sale Completion / Bill Receipt Modal */}
      {completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setCompletedSale(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {t('sales.saleSuccess')}
              </h3>
              <p className="text-xs text-slate-500">
                रसीद ID: {completedSale.id}
              </p>
            </div>

            {/* Receipt Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2 text-xs font-mono">
              <div className="flex justify-between font-bold text-slate-800">
                <span>ग्राहक: {completedSale.customerName}</span>
                <span>{completedSale.paymentMethod}</span>
              </div>
              <div className="divide-y divide-slate-200">
                {completedSale.items.map((i, idx) => (
                  <div key={idx} className="py-1 flex justify-between">
                    <span>
                      {i.name} × {i.qty}
                    </span>
                    <span>₹{i.total}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-300 flex justify-between font-black text-sm text-green-900">
                <span>कुल भुगतान:</span>
                <span>₹{completedSale.grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => {
                window.print();
                setCompletedSale(null);
              }}
              className="w-full py-3 rounded-xl bg-green-800 hover:bg-green-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-green-200" />
              <span>रसीद प्रिंट करें / साझा करें</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
