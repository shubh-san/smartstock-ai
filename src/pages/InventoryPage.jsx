import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { calculateDaysRemaining, getExpiryStatus, formatDisplayDate } from '../utils/dateUtils';
import { formatCurrency, formatNumber } from '../utils/formatters';
import {
  Search,
  PlusCircle,
  QrCode,
  Package,
  Layers,
  ReceiptIndianRupee,
  Trash2,
  Edit2,
  Calendar,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { AddProductModal } from '../components/inventory/AddProductModal';
import { AddBatchModal } from '../components/inventory/AddBatchModal';

export const InventoryPage = () => {
  const { t, language } = useLanguage();
  const { products, categories, deleteProduct } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // all, safe, warning, danger, expired
  const [showAddModal, setShowAddModal] = useState(() => searchParams.get('add') === 'true');
  const [selectedProductForBatch, setSelectedProductForBatch] = useState(null);
  const [expandedProductBatches, setExpandedProductBatches] = useState(null);

  // Compute product status from earliest expiring batch
  const enrichedProducts = useMemo(() => {
    return products.map((prod) => {
      let minDays = 999;
      let totalQty = 0;
      let earliestExpiry = '';

      prod.batches.forEach((b) => {
        totalQty += Number(b.quantity) || 0;
        const days = calculateDaysRemaining(b.expiryDate);
        if (days < minDays) {
          minDays = days;
          earliestExpiry = b.expiryDate;
        }
      });

      const status = getExpiryStatus(minDays);
      return {
        ...prod,
        totalQty,
        minDays,
        earliestExpiry,
        status,
      };
    });
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return enrichedProducts.filter((p) => {
      // Search term
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.barcode && p.barcode.includes(searchQuery));

      // Category
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      // Status
      const matchesStatus =
        statusFilter === 'all' || p.status.key === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [enrichedProducts, searchQuery, selectedCategory, statusFilter]);

  const handleDelete = (prod) => {
    const confirmText =
      language === 'hi'
        ? `क्या आप वाकई "${prod.name}" को हटाना चाहते हैं?`
        : `Are you sure you want to delete "${prod.nameEn}"?`;
    if (window.confirm(confirmText)) {
      deleteProduct(prod.id);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('inventory.title')}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            {t('inventory.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/scan')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs transition-colors"
          >
            <QrCode className="w-4 h-4 text-green-700" />
            <span>{t('actions.scanProduct')}</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-green-800 hover:bg-green-700 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-green-200" />
            <span>{t('actions.addProduct')}</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-soft space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('actions.searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-green-600 font-semibold text-slate-900 text-sm placeholder:text-slate-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-md"
            >
              साफ करें
            </button>
          )}
        </div>

        {/* Category horizontal scroll pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-green-800 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {t('actions.filterAll')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-green-800 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{language === 'hi' ? cat.nameHi : cat.nameEn}</span>
            </button>
          ))}
        </div>

        {/* Expiry Status Filter Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> स्थिति:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold ${
              statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            सभी ({products.length})
          </button>
          <button
            onClick={() => setStatusFilter('safe')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              statusFilter === 'safe'
                ? 'bg-emerald-700 text-white'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{t('status.safe')}</span>
          </button>
          <button
            onClick={() => setStatusFilter('warning')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              statusFilter === 'warning'
                ? 'bg-amber-600 text-white'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{t('status.warning')}</span>
          </button>
          <button
            onClick={() => setStatusFilter('danger')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              statusFilter === 'danger'
                ? 'bg-rose-600 text-white'
                : 'text-rose-800 bg-rose-50 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span>{t('status.danger')}</span>
          </button>
          <button
            onClick={() => setStatusFilter('expired')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              statusFilter === 'expired'
                ? 'bg-red-800 text-white'
                : 'text-red-800 bg-red-100 hover:bg-red-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-700" />
            <span>{t('status.expired')}</span>
          </button>
        </div>
      </div>

      {/* Product List / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((prod) => {
          const status = prod.status;
          const isExpanded = expandedProductBatches === prod.id;

          return (
            <div
              key={prod.id}
              className={`bg-white rounded-3xl border-2 transition-all p-5 shadow-sm hover:shadow-card flex flex-col justify-between ${
                status.key === 'danger'
                  ? 'border-rose-300'
                  : status.key === 'warning'
                  ? 'border-amber-300'
                  : status.key === 'expired'
                  ? 'border-red-400 bg-red-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* Top badges & Expiry Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                    {prod.image || '📦'}
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide ${status.badgeColor}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>{t(`status.${status.key}`)}</span>
                    </span>
                    <p className="text-[11px] font-bold text-slate-500 mt-1 flex items-center justify-end gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {prod.minDays < 0
                          ? (language === 'hi' ? `${Math.abs(prod.minDays)} दिन पहले एक्सपायर` : `Expired ${Math.abs(prod.minDays)}d ago`)
                          : prod.minDays === 0
                          ? (language === 'hi' ? 'आज एक्सपायरी' : 'Expires today')
                          : (language === 'hi' ? `${prod.minDays} दिन बचे` : `${prod.minDays} days left`)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Product Name & Category */}
                <h3 className="font-extrabold text-base text-slate-900 leading-snug line-clamp-2">
                  {language === 'hi' ? prod.name : prod.nameEn}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {prod.barcode ? `बारकोड: ${prod.barcode}` : 'बिना बारकोड'}
                </p>

                {/* Price & Quantity Summary */}
                <div className="mt-4 p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">
                      {t('inventory.sellingPrice')}
                    </span>
                    <span className="text-lg font-black text-green-900">
                      ₹{prod.sellingPrice}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">
                      /{prod.unit}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">
                      {t('inventory.quantity')}
                    </span>
                    <span className="text-lg font-black text-slate-800">
                      {prod.totalQty}{' '}
                      <span className="text-xs font-medium text-slate-500">
                        {prod.unit}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Batches toggle */}
                <div className="mt-3">
                  <button
                    onClick={() =>
                      setExpandedProductBatches(isExpanded ? null : prod.id)
                    }
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-green-800 py-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prod.batches.length} बैच मौजूद</span>
                    </span>
                    <span className="text-green-700 underline">
                      {isExpanded ? 'छुपाएं' : 'विवरण देखें'}
                    </span>
                  </button>

                  {/* Expanded Batches Drawer */}
                  {isExpanded && (
                    <div className="mt-2 p-3 bg-slate-100 rounded-2xl space-y-2 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-slate-600 uppercase">
                          बैच सूची
                        </span>
                        <button
                          onClick={() => setSelectedProductForBatch(prod)}
                          className="text-[11px] font-bold text-green-800 hover:underline flex items-center gap-1"
                        >
                          <PlusCircle className="w-3 h-3" /> + नया बैच
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {prod.batches.map((b) => (
                          <div
                            key={b.id}
                            className="bg-white p-2 rounded-xl text-xs flex items-center justify-between border border-slate-200/80 shadow-xs"
                          >
                            <div>
                              <span className="font-extrabold text-slate-800">
                                {b.batchNumber}
                              </span>
                              <span className="text-slate-500 ml-1.5">
                                ({b.quantity} {prod.unit})
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-slate-700 block">
                                {formatDisplayDate(b.expiryDate, language)}
                              </span>
                              {b.discountedPrice && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                                  छूट रेट: ₹{b.discountedPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedProductForBatch(prod)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-green-700" />
                  <span>+ बैच जोड़ें</span>
                </button>

                <button
                  onClick={() => navigate(`/sales?product=${prod.id}`)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-green-800 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <ReceiptIndianRupee className="w-3.5 h-3.5 text-green-200" />
                  <span>{t('actions.recordSale')}</span>
                </button>

                <button
                  onClick={() => handleDelete(prod)}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title={t('actions.delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-soft">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">
            {t('inventory.noProductsFound')}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {language === 'hi'
              ? 'खोज शब्द बदलकर देखें या नया सामान जोड़ने के लिए ऊपर दिए बटन का उपयोग करें।'
              : 'Try adjusting your search filters or add a new product using the button above.'}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-6 py-2.5 rounded-2xl bg-green-800 text-white font-bold text-sm shadow-md"
          >
            {t('actions.addProduct')}
          </button>
        </div>
      )}

      {/* Modals */}
      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} />}
      {selectedProductForBatch && (
        <AddBatchModal
          product={selectedProductForBatch}
          onClose={() => setSelectedProductForBatch(null)}
        />
      )}
    </div>
  );
};
