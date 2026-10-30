import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { WEEKLY_SALES_TREND } from '../services/mockData';
import {
  TrendingUp,
  PackageCheck,
  ShieldCheck,
  BadgePercent,
  ReceiptIndianRupee,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

export const ReportsPage = () => {
  const { t, language } = useLanguage();
  const { products, sales, getMetrics } = useApp();
  const metrics = getMetrics();

  // Category-wise product stock distribution
  const categoryStats = [
    { name: language === 'hi' ? 'दूध व डेयरी' : 'Dairy', count: 42, color: '#3b82f6' },
    { name: language === 'hi' ? 'ब्रेड व बेकरी' : 'Bakery', count: 15, color: '#f59e0b' },
    { name: language === 'hi' ? 'बिस्कुट व नमकीन' : 'Snacks', count: 105, color: '#10b981' },
    { name: language === 'hi' ? 'पेय पदार्थ' : 'Beverages', count: 30, color: '#06b6d4' },
    { name: language === 'hi' ? 'किराना व तेल' : 'Staples', count: 65, color: '#8b5cf6' },
  ];

  const chartData = WEEKLY_SALES_TREND.map((d) => ({
    name: language === 'hi' ? d.dayHi : d.dayEn,
    sales: d.sales,
    lossSaved: d.lossSaved,
    items: d.itemsSold,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>{t('reports.title')}</span>
          <TrendingUp className="w-7 h-7 text-green-800" />
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">
          {t('reports.subtitle')}
        </p>
      </div>

      {/* AI Business Summary Insight Card */}
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-950 text-white rounded-3xl p-5 sm:p-7 shadow-lg shadow-green-950/20 relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-1.5 rounded-xl bg-white/10 text-amber-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-amber-200">
            {t('reports.smartSummaryTitle')}
          </span>
        </div>
        <p className="text-base sm:text-lg text-green-50 font-medium leading-relaxed max-w-3xl">
          {t('reports.smartSummaryText')}
        </p>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Sales Today */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <ReceiptIndianRupee className="w-4 h-4 text-green-700" />
            <span className="text-xs font-bold">{t('reports.todayTotalSales')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatCurrency(metrics.todaySalesTotal)}
          </div>
          <p className="text-[11px] text-green-700 font-bold mt-1">
            {sales.length} {language === 'hi' ? 'बिक्री लेनदेन' : 'orders completed'}
          </p>
        </div>

        {/* Estimated Loss Avoided */}
        <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 shadow-soft">
          <div className="flex items-center gap-2 text-emerald-900 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold">{t('reports.lossAvoided')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900">
            {formatCurrency(metrics.lossAvoidedTotal)}
          </div>
          <p className="text-[11px] text-emerald-800 font-bold mt-1">
            {language === 'hi' ? 'समय पर छूट देकर बचाया' : 'Protected via timely discounts'}
          </p>
        </div>

        {/* Products Saved from Expiry */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <PackageCheck className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold">{t('reports.savedFromExpiry')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            35 {language === 'hi' ? 'पैकेट' : 'units'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {language === 'hi' ? 'ब्रेड व दूध के पैकेट' : 'Dairy & bread units sold'}
          </p>
        </div>

        {/* Discounts Given */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <BadgePercent className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold">{t('reports.discountsGiven')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹320
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {language === 'hi' ? 'ग्राहकों को दिया लाभ' : 'Given to customers'}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Trend Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-800" />
              <h3 className="font-extrabold text-base text-slate-900">
                {t('reports.weeklyTrend')}
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {language === 'hi' ? 'रुपये में बिक्री' : 'Daily Revenue (₹)'}
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#166534" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`₹${val}`, 'बिक्री']}
                  contentStyle={{
                    borderRadius: '16px',
                    borderColor: '#e2e8f0',
                    fontWeight: 'bold',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#166534"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Breakdown Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-soft space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="w-5 h-5 text-green-800" />
              <h3 className="font-extrabold text-base text-slate-900">
                {t('reports.categoryWiseStock')}
              </h3>
            </div>

            <div className="space-y-3">
              {categoryStats.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">{item.name}</span>
                    <span className="text-slate-900">{item.count} आइटम</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: item.color,
                        width: `${(item.count / 120) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-600 mt-4 border border-slate-200/80">
            💡 <span className="font-bold">सलाह:</span> डेयरी का सामान जल्दी बिकता है, इसलिए हर सुबह स्टॉक की जांच ज़रूर करें।
          </div>
        </div>
      </div>
    </div>
  );
};
