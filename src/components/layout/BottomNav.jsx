import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Package,
  QrCode,
  Mic,
  Menu,
  X,
  BadgePercent,
  ReceiptIndianRupee,
  TrendingUp,
  Settings,
  ClockAlert,
} from 'lucide-react';

export const BottomNav = () => {
  const { t } = useLanguage();
  const { getMetrics } = useApp();
  const navigate = useNavigate();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const metrics = getMetrics();

  const moreItems = [
    { to: '/expiry', label: t('nav.expiryAlerts'), icon: ClockAlert, badge: metrics.immediateAttentionCount },
    { to: '/discounts', label: t('nav.discounts'), icon: BadgePercent, badge: metrics.pendingDiscountsCount },
    { to: '/sales', label: t('nav.sales'), icon: ReceiptIndianRupee },
    { to: '/reports', label: t('nav.reports'), icon: TrendingUp },
    { to: '/settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-50 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setShowMoreMenu(false)}
        />
      )}

      {/* Mobile "More" Drawer */}
      {showMoreMenu && (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden p-5 shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="font-extrabold text-slate-900 text-lg">
              {t('nav.more')}
            </h3>
            <button
              onClick={() => setShowMoreMenu(false)}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {moreItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.to}
                  onClick={() => {
                    navigate(item.to);
                    setShowMoreMenu(false);
                  }}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-green-50 border border-slate-200/80 text-left transition-colors active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green-100 text-green-800 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm">
                      {item.label}
                    </span>
                  </div>
                  {item.badge > 0 && (
                    <span className="text-xs bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 z-40 lg:hidden shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* 1. Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
                isActive ? 'text-green-800 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Home className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                <span className="text-[11px] mt-0.5">{t('nav.home')}</span>
              </>
            )}
          </NavLink>

          {/* 2. Stock */}
          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors relative ${
                isActive ? 'text-green-800 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Package className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                <span className="text-[11px] mt-0.5">{t('nav.stock')}</span>
                {metrics.immediateAttentionCount > 0 && (
                  <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-ping" />
                )}
              </>
            )}
          </NavLink>

          {/* 3. Scan - Prominent Center Floating Button */}
          <NavLink
            to="/scan"
            className="flex flex-col items-center justify-center -mt-5 group"
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
                    isActive
                      ? 'bg-green-700 text-white ring-4 ring-green-200'
                      : 'bg-green-800 text-white ring-4 ring-white group-hover:bg-green-700'
                  }`}
                >
                  <QrCode className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold text-green-900 mt-1">
                  {t('nav.scan')}
                </span>
              </>
            )}
          </NavLink>

          {/* 4. AI Voice */}
          <NavLink
            to="/assistant"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
                isActive ? 'text-green-800 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Mic className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-green-700' : ''}`} />
                <span className="text-[11px] mt-0.5">{t('nav.ai')}</span>
              </>
            )}
          </NavLink>

          {/* 5. More */}
          <button
            onClick={() => setShowMoreMenu(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 relative"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">{t('nav.more')}</span>
            {metrics.pendingDiscountsCount > 0 && (
              <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
