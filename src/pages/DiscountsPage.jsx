import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { formatDisplayDate, calculateDaysRemaining } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatters';
import {
  BadgePercent,
  Sparkles,
  CheckCircle2,
  XCircle,
  Edit3,
  Calendar,
  IndianRupee,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const DiscountsPage = () => {
  const { t, language } = useLanguage();
  const { discounts, acceptDiscount, rejectDiscount, modifyDiscount } = useApp();

  const [activeTab, setActiveTab] = useState('pending'); // pending or applied
  const [editingDiscountId, setEditingDiscountId] = useState(null);
  const [customPriceInput, setCustomPriceInput] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const pendingDiscounts = discounts.filter((d) => d.status === 'pending');
  const acceptedDiscounts = discounts.filter((d) => d.status === 'accepted');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAccept = (id) => {
    acceptDiscount(id);
    showToast(t('discounts.acceptedNotice'));
  };

  const handleReject = (id) => {
    rejectDiscount(id);
    showToast(t('discounts.rejectedNotice'));
  };

  const handleSaveModified = (id) => {
    const num = Number(customPriceInput);
    if (!num || num <= 0) {
      alert('कृपया वैध कीमत दर्ज करें');
      return;
    }
    modifyDiscount(id, num);
    setEditingDiscountId(null);
    setCustomPriceInput('');
    showToast('नया मूल्य लागू कर दिया गया है!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>{t('discounts.title')}</span>
          <BadgePercent className="w-7 h-7 text-emerald-600" />
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">
          {t('discounts.subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-colors flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>सुझाव ({pendingDiscounts.length})</span>
          {pendingDiscounts.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('applied')}
          className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-colors ${
            activeTab === 'applied'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          लागू की गई छूटें ({acceptedDiscounts.length})
        </button>
      </div>

      {/* Pending Recommendations List */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingDiscounts.length > 0 ? (
            pendingDiscounts.map((item) => {
              const isEditing = editingDiscountId === item.id;
              const daysLeft = calculateDaysRemaining(item.expiryDate);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border-2 border-emerald-500/50 p-5 sm:p-6 shadow-card space-y-4 transition-all hover:border-emerald-600"
                >
                  {/* Top Bar with AI Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
                        <Sparkles className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                        AI स्मार्ट सुझाव
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>एक्सपायरी: {formatDisplayDate(item.expiryDate, language)}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px]">
                        {daysLeft === 0 ? 'आज अंतिम दिन' : `${daysLeft} दिन शेष`}
                      </span>
                    </div>
                  </div>

                  {/* Product Info & Pricing Comparison */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        {language === 'hi' ? item.productNameHi : item.productNameEn}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {t('discounts.remainingQty')}:{' '}
                        <span className="font-extrabold text-slate-800 text-sm">
                          {item.remainingQty} {item.unit}
                        </span>{' '}
                        • खरीद रेट: ₹{item.purchasePrice}
                      </p>
                    </div>

                    {/* Price comparison box */}
                    <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-center gap-4 shrink-0">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          {t('discounts.currentPrice')}
                        </span>
                        <span className="text-base font-bold text-slate-400 line-through">
                          ₹{item.currentPrice}
                        </span>
                      </div>
                      <div className="text-emerald-700 font-bold text-lg">➔</div>
                      <div>
                        <span className="text-[10px] uppercase font-extrabold text-emerald-900 block">
                          {t('discounts.newPrice')}
                        </span>
                        <span className="text-2xl font-black text-emerald-800">
                          ₹{item.suggestedPrice}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-black text-xs">
                        {item.suggestedDiscountPct}% छूट
                      </span>
                    </div>
                  </div>

                  {/* Conversational Reason */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed space-y-1">
                    <span className="font-bold text-slate-900 block">
                      {t('discounts.reasonLabel')}:
                    </span>
                    <p>{language === 'hi' ? item.reasonHi : item.reasonEn}</p>
                    <p className="text-[11px] font-bold text-emerald-700 pt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>
                        संभावित नुकसान से बचत:{' '}
                        {formatCurrency(item.potentialLossAvoided)}
                      </span>
                    </p>
                  </div>

                  {/* Inline Price Modification if active */}
                  {isEditing && (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-2 animate-in zoom-in-95 duration-100">
                      <label className="block text-xs font-bold text-amber-950 uppercase">
                        अपनी पसंद का नया बिक्री मूल्य डालें (₹):
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={customPriceInput}
                          onChange={(e) => setCustomPriceInput(e.target.value)}
                          placeholder={item.suggestedPrice.toString()}
                          className="px-3 py-2 rounded-xl border-2 border-amber-400 font-bold text-sm w-36"
                        />
                        <button
                          onClick={() => handleSaveModified(item.id)}
                          className="px-4 py-2 rounded-xl bg-green-800 text-white font-bold text-xs"
                        >
                          लागू करें
                        </button>
                        <button
                          onClick={() => setEditingDiscountId(null)}
                          className="px-3 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                        >
                          रद्द
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons: Accept, Modify, Reject */}
                  <div className="flex items-center justify-end gap-2.5 pt-2 flex-wrap">
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{t('actions.rejectDiscount')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingDiscountId(item.id);
                        setCustomPriceInput(item.suggestedPrice.toString());
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>{t('actions.modifyDiscount')}</span>
                    </button>

                    <button
                      onClick={() => handleAccept(item.id)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>{t('actions.acceptDiscount')}</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-soft">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-black text-slate-800">
                {t('discounts.noDiscountsNow')}
              </h3>
            </div>
          )}
        </div>
      )}

      {/* Applied Discounts List */}
      {activeTab === 'applied' && (
        <div className="space-y-3">
          {acceptedDiscounts.length > 0 ? (
            acceptedDiscounts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    {language === 'hi' ? item.productNameHi : item.productNameEn}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    बिक्री मूल्य: <span className="line-through">₹{item.currentPrice}</span> ➔{' '}
                    <span className="font-bold text-emerald-700">₹{item.suggestedPrice}</span> ({item.suggestedDiscountPct}% छूट)
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                  सक्रिय छूट (Active)
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 text-slate-500">
              कोई छूट अभी लागू नहीं की गई है।
            </div>
          )}
        </div>
      )}
    </div>
  );
};
