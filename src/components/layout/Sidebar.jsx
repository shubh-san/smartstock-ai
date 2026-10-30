import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Package,
  QrCode,
  ClockAlert,
  BotMessageSquare,
  BadgePercent,
  ReceiptIndianRupee,
  TrendingUp,
  Settings,
  Sparkles,
} from 'lucide-react';

export const Sidebar = () => {
  const { t } = useLanguage();
  const { getMetrics } = useApp();
  const metrics = getMetrics();

  const navItems = [
    {
      to: '/',
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/inventory',
      label: t('nav.inventory'),
      icon: Package,
      badge: metrics.totalProducts > 0 ? metrics.totalProducts : null,
      badgeColor: 'bg-slate-200 text-slate-700',
    },
    {
      to: '/scan',
      label: t('nav.scan'),
      icon: QrCode,
      badge: null,
      highlight: true,
    },
    {
      to: '/expiry',
      label: t('nav.expiryAlerts'),
      icon: ClockAlert,
      badge: metrics.immediateAttentionCount > 0 ? metrics.immediateAttentionCount : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
    },
    {
      to: '/assistant',
      label: t('nav.aiAssistant'),
      icon: BotMessageSquare,
      badge: 'AI',
      badgeColor: 'bg-amber-100 text-amber-900 font-bold border border-amber-300',
      pulse: true,
    },
    {
      to: '/discounts',
      label: t('nav.discounts'),
      icon: BadgePercent,
      badge: metrics.pendingDiscountsCount > 0 ? metrics.pendingDiscountsCount : null,
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      to: '/sales',
      label: t('nav.sales'),
      icon: ReceiptIndianRupee,
      badge: null,
    },
    {
      to: '/reports',
      label: t('nav.reports'),
      icon: TrendingUp,
      badge: null,
    },
    {
      to: '/settings',
      label: t('nav.settings'),
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden lg:flex">
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          {t('brand.name')}
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-green-800 text-white shadow-md shadow-green-950/10'
                      : item.highlight
                      ? 'bg-green-50 text-green-900 hover:bg-green-100 border border-green-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 ${
                          isActive
                            ? 'text-white'
                            : item.highlight
                            ? 'text-green-700'
                            : 'text-slate-500'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeColor || 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Quick AI Tip Card */}
      <div className="p-3.5 bg-gradient-to-br from-green-900 to-green-950 text-white rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1 rounded-lg bg-white/10">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-xs font-bold tracking-wide text-amber-200">
            AI सहायता सक्रिय
          </span>
        </div>
        <p className="text-xs text-green-100 leading-relaxed">
          माइक दबाकर बोलें: "आज क्या एक्सपायर होगा?"
        </p>
      </div>
    </aside>
  );
};
