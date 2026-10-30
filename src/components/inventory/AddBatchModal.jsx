import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { X, Calendar, PlusCircle, CheckCircle2 } from 'lucide-react';

export const AddBatchModal = ({ product, onClose }) => {
  const { t, language } = useLanguage();
  const { addBatchToProduct } = useApp();

  const [formData, setFormData] = useState({
    batchNumber: '',
    quantity: '12',
    purchasePrice: product.basePrice || '',
    sellingPrice: product.sellingPrice || '',
    expiryDate: '',
  });

  const [success, setSuccess] = useState(false);

  const setQuickExpiry = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setFormData((prev) => ({
      ...prev,
      expiryDate: d.toISOString().split('T')[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.expiryDate || !formData.quantity) {
      alert(language === 'hi' ? 'कृपया एक्सपायरी तारीख और मात्रा भरें' : 'Please fill expiry date and quantity');
      return;
    }

    addBatchToProduct(product.id, formData);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              {language === 'hi' ? 'नया बैच जोड़ें' : 'Add New Batch'}
            </h2>
            <p className="text-xs text-slate-500 font-medium truncate max-w-[260px]">
              {language === 'hi' ? product.name : product.nameEn}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-2 bg-emerald-50">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-base font-extrabold text-emerald-900">
              {language === 'hi' ? 'नया बैच जोड़ दिया गया!' : 'Batch Added Successfully!'}
            </h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t('productForm.batchNumberLabel')}
                </label>
                <input
                  type="text"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                  placeholder="B-205"
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-green-600 font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t('productForm.quantityLabel')} *
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

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
              <label className="block text-xs font-bold text-amber-950 uppercase flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>{t('productForm.expiryDateLabel')} *</span>
              </label>

              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border-2 border-amber-300 font-bold bg-white text-sm"
              />

              <div className="flex gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setQuickExpiry(2)}
                  className="px-2 py-0.5 rounded bg-amber-200 hover:bg-amber-300 text-[11px] font-bold"
                >
                  +2 दिन
                </button>
                <button
                  type="button"
                  onClick={() => setQuickExpiry(7)}
                  className="px-2 py-0.5 rounded bg-amber-200 hover:bg-amber-300 text-[11px] font-bold"
                >
                  +7 दिन
                </button>
                <button
                  type="button"
                  onClick={() => setQuickExpiry(30)}
                  className="px-2 py-0.5 rounded bg-amber-200 hover:bg-amber-300 text-[11px] font-bold"
                >
                  +30 दिन
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm"
              >
                {t('actions.cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-green-800 hover:bg-green-700 text-white font-bold text-sm shadow-md"
              >
                {t('actions.save')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
