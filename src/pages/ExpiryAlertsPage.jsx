import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { calculateDaysRemaining, formatDisplayDate, getExpiryStatus } from '../utils/dateUtils';
import {
  ClockAlert,
  AlertTriangle,
  BadgePercent,
  ReceiptIndianRupee,
  CheckCircle2,
  Trash2,
  Sparkles,
  Ban,
  ArrowRight,
} from 'lucide-react';

export const ExpiryAlertsPage = () => {
  const { t, language } = useLanguage();
  const { products, deleteProduct } = useApp();
  const navigate = useNavigate();

  // Categorize batches across all products
  const grouped = {
    today: [],
    tomorrow: [],
    threeDays: [],
    sevenDays: [],
    thirtyDays: [],
    expired: [],
  };

  products.forEach((prod) => {
    prod.batches.forEach((batch) => {
      const days = calculateDaysRemaining(batch.expiryDate);
      const itemData = {
        productId: prod.id,
        productName: language === 'hi' ? prod.name : prod.nameEn,
        category: prod.category,
        image: prod.image,
        unit: prod.unit,
        sellingPrice: batch.discountedPrice || batch.sellingPrice,
        originalPrice: batch.sellingPrice,
        hasDiscount: Boolean(batch.discountedPrice),
        batchId: batch.id,
        batchNumber: batch.batchNumber,
        quantity: batch.quantity,
        expiryDate: batch.expiryDate,
        days,
      };

      if (days < 0) {
        grouped.expired.push(itemData);
      } else if (days === 0) {
        grouped.today.push(itemData);
      } else if (days === 1) {
        grouped.tomorrow.push(itemData);
      } else if (days <= 3) {
        grouped.threeDays.push(itemData);
      } else if (days <= 7) {
        grouped.sevenDays.push(itemData);
      } else if (days <= 30) {
        grouped.thirtyDays.push(itemData);
      }
    });
  });

  const getRecommendedAction = (days) => {
    if (days < 0) {
      return {
        text: language === 'hi' ? 'दुकान से तुरंत हटाएं (सख्त मना: कभी न बेचें)' : 'Remove from shelf immediately (Never sell)',
        color: 'text-red-700 bg-red-100 font-black',
      };
    }
    if (days === 0) {
      return {
        text: language === 'hi' ? 'आज ही 20% छूट पर बेचें या सप्लायर को वापस करें' : 'Clear today with 20% discount or return to distributor',
        color: 'text-rose-800 bg-rose-100 font-extrabold',
      };
    }
    if (days === 1) {
      return {
        text: language === 'hi' ? 'काउंटर पर आगे रखें और 15% छूट का सुझाव दें' : 'Display at counter front with 15% discount',
        color: 'text-amber-900 bg-amber-100 font-extrabold',
      };
    }
    if (days <= 3) {
      return {
        text: language === 'hi' ? '10% छूट लागू करके प्राथमिकता से बेचें' : 'Apply 10% discount to boost clearance',
        color: 'text-amber-800 bg-amber-50 font-bold',
      };
    }
    if (days <= 7) {
      return {
        text: language === 'hi' ? 'स्टॉक पर नज़र रखें, अगले 2 दिनों में छूट दें' : 'Monitor sales velocity; discount in 2 days',
        color: 'text-yellow-800 bg-yellow-50 font-bold',
      };
    }
    return {
      text: language === 'hi' ? 'सामान्य बिक्री चालू रखें' : 'Continue normal sales',
      color: 'text-emerald-800 bg-emerald-50 font-bold',
    };
  };

  const renderGroupSection = (title, items, badgeColor, iconEmoji) => {
    if (items.length === 0) return null;

    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{iconEmoji}</span>
            <h2 className="text-lg font-black text-slate-900">{title}</h2>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-black text-white ${badgeColor}`}
          >
            {items.length} {language === 'hi' ? 'सामान' : 'items'}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {items.map((item, idx) => {
            const action = getRecommendedAction(item.days);
            const status = getExpiryStatus(item.days);

            return (
              <div
                key={`${item.productId}_${item.batchId}_${idx}`}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                {/* Product details */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">
                    {item.image || '📦'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                      {item.productName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {language === 'hi' ? 'मात्रा:' : 'Qty:'}{' '}
                      <span className="font-bold text-slate-800">
                        {item.quantity} {item.unit}
                      </span>{' '}
                      • {language === 'hi' ? 'बैच:' : 'Batch:'} {item.batchNumber}
                    </p>

                    {/* Expiry Date & Urgency */}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-600">
                        {formatDisplayDate(item.expiryDate, language)}
                      </span>
                      <span
                        className={`text-[11px] font-black px-2 py-0.5 rounded-md ${status.badgeColor}`}
                      >
                        {item.days === 0
                          ? 'आज अंतिम दिन'
                          : item.days === 1
                          ? 'कल एक्सपायर'
                          : `${item.days} दिन बचे`}
                      </span>
                    </div>

                    {/* Recommended Action */}
                    <div className="mt-2">
                      <span className="text-[11px] font-bold text-slate-400 block uppercase mb-0.5">
                        {language === 'hi' ? 'सुझावित कार्य:' : 'Recommended Action:'}
                      </span>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-xl text-xs ${action.color}`}
                      >
                        {action.text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    to="/discounts"
                    className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <BadgePercent className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t('actions.modifyDiscount')}</span>
                  </Link>

                  <Link
                    to={`/sales?product=${item.productId}`}
                    className="px-4 py-2 rounded-xl bg-green-800 hover:bg-green-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <ReceiptIndianRupee className="w-3.5 h-3.5 text-green-200" />
                    <span>{t('actions.recordSale')}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>{t('nav.expiryAlerts')}</span>
          <ClockAlert className="w-6 h-6 text-rose-600" />
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">
          {language === 'hi'
            ? 'समय रहते पहचानें कि कौन सा सामान कब एक्सपायर होगा ताकि नुकसान से बचा जा सके'
            : 'Track which items are expiring and take preventive action before expiry'}
        </p>
      </div>

      {/* SEPARATE SECTION: Expired Products (Never recommend discounts on expired items) */}
      {grouped.expired.length > 0 && (
        <div className="bg-red-50 rounded-3xl border-2 border-red-500 p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-red-200">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold">
                <Ban className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-red-950">
                  {t('expiryGroups.expiredTitle')}
                </h2>
                <p className="text-xs text-red-800 font-bold">
                  {language === 'hi'
                    ? 'कानूनी व स्वास्थ्य कारणों से एक्सपायर सामान बेचना सख्त मना है। इनपर कोई छूट नहीं दी जा सकती।'
                    : 'Strictly prohibited to sell expired stock. No discounts apply to expired items.'}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-red-700 text-white">
              {grouped.expired.length} {language === 'hi' ? 'सामान' : 'items'}
            </span>
          </div>

          <div className="divide-y divide-red-200/80">
            {grouped.expired.map((item, idx) => (
              <div
                key={`exp_${item.productId}_${idx}`}
                className="py-3.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl opacity-75">{item.image || '📦'}</span>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-red-950 line-through">
                      {item.productName}
                    </h3>
                    <p className="text-xs text-red-800">
                      {item.quantity} {item.unit} • {formatDisplayDate(item.expiryDate, language)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-red-200 text-red-900 font-black text-xs">
                    {language === 'hi' ? 'दुकान से हटाएं' : 'Discard / Return'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Group 1: Today */}
      {renderGroupSection(
        t('expiryGroups.today'),
        grouped.today,
        'bg-rose-600',
        '🚨'
      )}

      {/* Group 2: Tomorrow */}
      {renderGroupSection(
        t('expiryGroups.tomorrow'),
        grouped.tomorrow,
        'bg-amber-600',
        '⚠️'
      )}

      {/* Group 3: Next 3 Days */}
      {renderGroupSection(
        t('expiryGroups.threeDays'),
        grouped.threeDays,
        'bg-amber-500',
        '⏳'
      )}

      {/* Group 4: Next 7 Days */}
      {renderGroupSection(
        t('expiryGroups.sevenDays'),
        grouped.sevenDays,
        'bg-yellow-600',
        '📅'
      )}

      {/* Group 5: Next 30 Days */}
      {renderGroupSection(
        t('expiryGroups.thirtyDays'),
        grouped.thirtyDays,
        'bg-emerald-700',
        '✅'
      )}

      {/* Empty State if everything is safe */}
      {grouped.today.length === 0 &&
        grouped.tomorrow.length === 0 &&
        grouped.threeDays.length === 0 &&
        grouped.sevenDays.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-soft">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-black text-slate-800">
              {language === 'hi'
                ? 'अगले 7 दिनों में कोई भी सामान एक्सपायर होने वाला नहीं है!'
                : 'No products are expiring in the next 7 days!'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'hi'
                ? 'दुकान का सारा स्टॉक सुरक्षित है।'
                : 'All stock in your shop is well within safe date limits.'}
            </p>
          </div>
        )}
    </div>
  );
};
