import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  X,
  PlusCircle,
  QrCode,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Package,
} from 'lucide-react';

export const AddProductModal = ({ onClose, prefillBarcode = '' }) => {
  const { t, language } = useLanguage();
  const { categories, addProduct } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    category: 'cat_dairy',
    barcode: prefillBarcode || '',
    purchasePrice: '',
    sellingPrice: '',
    quantity: '10',
    expiryDate: '',
    batchNumber: '',
  });

  const [successToast, setSuccessToast] = useState(false);

  // Quick shelf-life helper
  const setQuickExpiry = (daysToAdd) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    setFormData((prev) => ({
      ...prev,
      expiryDate: d.toISOString().split('T')[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.expiryDate || !formData.sellingPrice) {
      alert(language === 'hi' ? 'कृपया सभी ज़रूरी जानकारी भरें' : 'Please fill all required fields');
      return;
    }

    addProduct(formData);
    setSuccessToast(true);

    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-800 flex items-center justify-center font-bold">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {t('productForm.addTitle')}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'hi' ? 'दुकान में नया सामान व एक्सपायरी दर्ज करें' : 'Enter product & expiry details'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success message banner */}
        {successToast ? (
          <div className="p-8 text-center space-y-3 bg-emerald-50">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-xl font-extrabold text-emerald-900">
              {t('productForm.successMessage')}
            </h3>
            <p className="text-xs text-emerald-700">
              {language === 'hi' ? 'स्टॉक और एक्सपायरी सूची में अपडेट हो गया' : 'Updated in inventory and alerts'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                {t('productForm.nameLabel')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('productForm.namePlaceholder')}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-green-600 focus:ring-0 text-slate-900 font-semibold text-sm transition-colors"
              />
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                {t('productForm.categoryLabel')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-xs font-bold transition-all text-left ${
                      formData.category === cat.id
                        ? 'border-green-700 bg-green-50 text-green-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate">
                      {language === 'hi' ? cat.nameHi : cat.nameEn}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Barcode & Batch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  {t('productForm.barcodeLabel')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder={t('productForm.barcodePlaceholder')}
                    className="w-full pl-3 pr-9 py-2.5 rounded-xl border-2 border-slate-200 focus:border-green-600 text-slate-900 font-mono text-sm"
                  />
                  <QrCode className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  {t('productForm.batchNumberLabel')}
                </label>
                <input
                  type="text"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                  placeholder={t('productForm.batchNumberPlaceholder')}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-green-600 text-slate-900 font-semibold text-sm"
                />
              </div>
            </div>

            {/* Prices & Quantity */}
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  {t('productForm.purchasePriceLabel')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    placeholder="20"
                    className="w-full pl-7 pr-2 py-2.5 rounded-xl border-2 border-slate-200 focus:border-green-600 font-bold text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  {t('productForm.sellingPriceLabel')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-green-700 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="25"
                    className="w-full pl-7 pr-2 py-2.5 rounded-xl border-2 border-slate-200 focus:border-green-600 font-bold text-sm text-green-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  {t('productForm.quantityLabel')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-green-600 font-bold text-sm text-center"
                />
              </div>
            </div>

            {/* Expiry Date with quick buttons */}
            <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
              <label className="block text-xs font-bold text-amber-950 uppercase tracking-wide flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>{t('productForm.expiryDateLabel')}</span>
                  <span className="text-rose-500">*</span>
                </span>
                <span className="text-[11px] text-amber-800 font-semibold lowercase">
                  ({language === 'hi' ? 'पैकेट पर देखकर भरें' : 'verify on packet'})
                </span>
              </label>

              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:border-amber-600 font-bold text-slate-900 bg-white text-base"
              />

              {/* Quick shelf life buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-amber-900 font-bold self-center mr-1">
                  {language === 'hi' ? 'त्वरित चुनें:' : 'Quick pick:'}
                </span>
                <button
                  type="button"
                  onClick={() => setQuickExpiry(2)}
                  className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-bold"
                >
                  {language === 'hi' ? '2 दिन (दूध/ब्रेड)' : '2 days (Milk/Bread)'}
                </button>
                <button
                  type="button"
                  onClick={() => setQuickExpiry(7)}
                  className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-bold"
                >
                  {language === 'hi' ? '7 दिन' : '7 days'}
                </button>
                <button
                  type="button"
                  onClick={() => setQuickExpiry(30)}
                  className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-bold"
                >
                  {language === 'hi' ? '1 महीना' : '1 month'}
                </button>
                <button
                  type="button"
                  onClick={() => setQuickExpiry(180)}
                  className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-bold"
                >
                  {language === 'hi' ? '6 महीने (बिस्कुट/नूडल्स)' : '6 mos (Biscuits)'}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
              >
                {t('actions.cancel')}
              </button>
              <button
                type="submit"
                className="px-7 py-3 rounded-2xl bg-green-800 hover:bg-green-700 text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-green-200" />
                <span>{t('productForm.saveButton')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
