import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { calculateDaysRemaining, getExpiryStatus, formatDisplayDate } from '../utils/dateUtils';
import {
  PlusCircle,
  QrCode,
  ClockAlert,
  BotMessageSquare,
  Package,
  AlertTriangle,
  BadgePercent,
  ReceiptIndianRupee,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { AddProductModal } from '../components/inventory/AddProductModal';

export const DashboardPage = () => {
  const { t, language } = useLanguage();
  const { products, discounts, sales, getMetrics, acceptDiscount } = useApp();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const metrics = getMetrics();

  // Find products expiring soon (<= 3 days)
  const urgentBatches = [];
  products.forEach((prod) => {
    prod.batches.forEach((batch) => {
      const days = calculateDaysRemaining(batch.expiryDate);
      if (days >= 0 && days <= 3) {
        urgentBatches.push({
          productId: prod.id,
          productName: language === 'hi' ? prod.name : prod.nameEn,
          category: prod.category,
          batchNumber: batch.batchNumber,
          quantity: batch.quantity,
          unit: prod.unit,
          expiryDate: batch.expiryDate,
          days,
          sellingPrice: batch.discountedPrice || batch.sellingPrice,
        });
      }
    });
  });

  // Top pending discount
  const topDiscount = discounts.find((d) => d.status === 'pending');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Large Easy-to-Understand Urgent Notification Banner */}
      {metrics.immediateAttentionCount > 0 ? (
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 text-white p-5 sm:p-6 rounded-3xl shadow-lg shadow-rose-900/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <AlertTriangle className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-rose-200 font-bold mb-0.5">
                {t('dashboard.criticalAlertsTitle')}
              </p>
              <h2 className="text-lg sm:text-xl font-extrabold leading-snug">
                {t('dashboard.urgentBanner', { count: metrics.immediateAttentionCount })}
              </h2>
            </div>
          </div>
          <Link
            to="/expiry"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-rose-700 hover:bg-rose-50 font-black text-sm text-center shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>{t('dashboard.urgentBannerAction')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-700 to-green-800 text-white p-4 sm:p-5 rounded-3xl shadow-md flex items-center gap-3.5">
          <CheckCircle2 className="w-6 h-6 text-emerald-200 shrink-0" />
          <p className="font-bold text-sm sm:text-base">
            {t('dashboard.allSafeBanner')}
          </p>
        </div>
      )}

      {/* 2. Four Prominent Action Cards */}
      <div>
        <h2 className="text-sm font-extrabold text-slate-500 uppercase tracking-wider mb-3">
          {t('dashboard.quickActionsTitle')}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Add Product */}
          <button
            onClick={() => setShowAddModal(true)}
            className="group p-5 rounded-3xl bg-white border-2 border-slate-200/80 hover:border-green-600 shadow-sm hover:shadow-card text-left transition-all duration-200 active:scale-98 flex flex-col justify-between min-h-[145px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-100 group-hover:bg-green-700 text-green-800 group-hover:text-white flex items-center justify-center transition-colors">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-green-800">
                {t('actions.addProduct')}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {language === 'hi' ? 'दुकान में नया माल जोड़ें' : 'Add new inventory'}
              </p>
            </div>
          </button>

          {/* Card 2: Scan Product */}
          <Link
            to="/scan"
            className="group p-5 rounded-3xl bg-white border-2 border-slate-200/80 hover:border-emerald-600 shadow-sm hover:shadow-card text-left transition-all duration-200 active:scale-98 flex flex-col justify-between min-h-[145px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 group-hover:bg-emerald-700 text-emerald-800 group-hover:text-white flex items-center justify-center transition-colors">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-emerald-800">
                {t('actions.scanProduct')}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {language === 'hi' ? 'कैमरे से बारकोड स्कैन करें' : 'Camera QR & barcode'}
              </p>
            </div>
          </Link>

          {/* Card 3: Expiring Products */}
          <Link
            to="/expiry"
            className="group p-5 rounded-3xl bg-white border-2 border-slate-200/80 hover:border-amber-500 shadow-sm hover:shadow-card text-left transition-all duration-200 active:scale-98 flex flex-col justify-between min-h-[145px] relative"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 group-hover:bg-amber-600 text-amber-800 group-hover:text-white flex items-center justify-center transition-colors">
              <ClockAlert className="w-6 h-6" />
            </div>
            {metrics.immediateAttentionCount > 0 && (
              <span className="absolute top-4 right-4 px-2 py-0.5 bg-rose-500 text-white text-xs font-black rounded-full">
                {metrics.immediateAttentionCount}
              </span>
            )}
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-amber-700">
                {t('actions.expiringProducts')}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {language === 'hi' ? 'खराब होने से पहले देखें' : 'View expiring stock'}
              </p>
            </div>
          </Link>

          {/* Card 4: Talk to AI */}
          <Link
            to="/assistant"
            className="group p-5 rounded-3xl bg-gradient-to-br from-green-900 to-emerald-950 text-white shadow-md hover:shadow-card text-left transition-all duration-200 active:scale-98 flex flex-col justify-between min-h-[145px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 group-hover:bg-white/20 text-amber-300 flex items-center justify-center transition-colors">
              <BotMessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-base sm:text-lg text-white">
                  {t('actions.talkToAI')}
                </h3>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <p className="text-xs text-green-200 font-medium mt-0.5">
                {language === 'hi' ? 'आवाज़ में सवाल पूछें' : 'Hindi voice conversation'}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* 3. Stats Overview - Large Readable Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Products */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Package className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold">{t('dashboard.stats.totalProducts')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatNumber(metrics.totalProducts)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {metrics.totalItemsStock} {language === 'hi' ? 'कुल पैकेट' : 'units in stock'}
          </p>
        </div>

        {/* Expiring Soon */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-soft">
          <div className="flex items-center gap-2 text-amber-900 mb-1">
            <ClockAlert className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold">{t('dashboard.stats.expiringSoon')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-900">
            {formatNumber(metrics.expiringSoonCount)}
          </div>
          <p className="text-[11px] text-amber-800 mt-0.5">
            {language === 'hi' ? 'अगले 7 दिनों में' : 'Next 7 days'}
          </p>
        </div>

        {/* Immediate Attention */}
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-soft">
          <div className="flex items-center gap-2 text-rose-900 mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold">{t('dashboard.stats.immediateAttention')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700">
            {formatNumber(metrics.immediateAttentionCount)}
          </div>
          <p className="text-[11px] text-rose-700 mt-0.5 font-bold">
            {language === 'hi' ? 'अगले 3 दिनों में' : 'Next 3 days'}
          </p>
        </div>

        {/* Today's Sales */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <ReceiptIndianRupee className="w-4 h-4 text-green-700" />
            <span className="text-xs font-bold">{t('dashboard.stats.todaySales')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-green-900">
            {formatCurrency(metrics.todaySalesTotal)}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {sales.length} {language === 'hi' ? 'बिल कटे' : 'orders today'}
          </p>
        </div>

        {/* Suggested Discounts */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-soft col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-emerald-900 mb-1">
            <BadgePercent className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold">{t('dashboard.stats.suggestedDiscounts')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900">
            {formatNumber(metrics.pendingDiscountsCount)}
          </div>
          <p className="text-[11px] text-emerald-800 mt-0.5">
            {language === 'hi' ? 'नुकसान से बचाव' : 'Loss prevention'}
          </p>
        </div>
      </div>

      {/* 4. AI Discount Recommendation Feature Card */}
      {topDiscount && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-5 sm:p-6 shadow-card relative overflow-hidden">
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-600 text-white text-xs font-black rounded-bl-2xl flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI रिकमेंडेशन</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                {t('dashboard.discountNoticeTitle')}
              </span>
              <h3 className="text-lg font-black text-slate-900">
                {language === 'hi' ? topDiscount.productNameHi : topDiscount.productNameEn}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'hi' ? topDiscount.reasonHi : topDiscount.reasonEn}
              </p>
              <div className="flex items-center gap-3 pt-1 text-sm">
                <span className="text-slate-400 line-through">
                  ₹{topDiscount.currentPrice}
                </span>
                <span className="text-xl font-extrabold text-emerald-700">
                  ₹{topDiscount.suggestedPrice}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md">
                  {topDiscount.suggestedDiscountPct}% छूट
                </span>
                <span className="text-xs text-slate-500">
                  ({topDiscount.remainingQty} {topDiscount.unit} बचे)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => acceptDiscount(topDiscount.id)}
                className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md active:scale-95 transition-all"
              >
                {t('actions.acceptDiscount')}
              </button>
              <Link
                to="/discounts"
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors"
              >
                {t('actions.viewAll')}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 5. Urgent Expiry List Preview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClockAlert className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              {t('dashboard.criticalAlertsTitle')}
            </h3>
          </div>
          <Link
            to="/expiry"
            className="text-xs sm:text-sm font-bold text-green-800 hover:text-green-700 flex items-center gap-1"
          >
            <span>{t('actions.viewAll')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {urgentBatches.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {urgentBatches.slice(0, 4).map((item, idx) => {
              const status = getExpiryStatus(item.days);
              return (
                <div
                  key={`${item.productId}_${idx}`}
                  className="py-3.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">
                      {item.category === 'cat_dairy' ? '🥛' : '🍞'}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.quantity} {item.unit} • {language === 'hi' ? 'बैच:' : 'Batch:'} {item.batchNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black ${status.badgeColor}`}
                      >
                        {item.days === 0
                          ? (language === 'hi' ? 'आज एक्सपायर' : 'Expires Today')
                          : item.days === 1
                          ? (language === 'hi' ? 'कल एक्सपायर' : 'Expires Tomorrow')
                          : (language === 'hi' ? `${item.days} दिन में` : `In ${item.days} days`)}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {formatDisplayDate(item.expiryDate, language)}
                      </p>
                    </div>

                    <Link
                      to={`/sales?product=${item.productId}`}
                      className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                    >
                      {t('actions.recordSale')}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-bold text-sm text-slate-700">
              {language === 'hi' ? 'कोई भी सामान तुरंत एक्सपायर होने वाला नहीं है!' : 'No urgent expiring products right now!'}
            </p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};
