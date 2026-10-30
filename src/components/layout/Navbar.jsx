import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  Store,
  Languages,
  AlertTriangle,
  PlusCircle,
  Sparkles,
  Search,
} from 'lucide-react';

export const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { shop, getMetrics } = useApp();
  const navigate = useNavigate();
  const metrics = getMetrics();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Store Info */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-800 to-green-700 flex items-center justify-center text-white shadow-md shadow-green-900/20 group-hover:scale-105 transition-transform">
                <Store className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl text-green-900 tracking-tight">
                    SmartStock
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    <Sparkles className="w-2.5 h-2.5 mr-0.5 text-amber-600 inline" /> AI
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium hidden sm:block truncate max-w-[200px]">
                  {language === 'hi' ? shop.name : shop.nameEn}
                </p>
              </div>
            </Link>
          </div>

          {/* Center search bar on larger screens */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div
              onClick={() => navigate('/inventory')}
              className="w-full flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-slate-500 cursor-pointer border border-slate-200/60 transition-colors"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium">
                {t('actions.searchPlaceholder')}
              </span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Urgent Expiry Alert Pill */}
            {metrics.immediateAttentionCount > 0 && (
              <Link
                to="/expiry"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs sm:text-sm font-bold animate-pulse transition-colors"
                title={t('nav.expiryAlerts')}
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>
                  {metrics.immediateAttentionCount}{' '}
                  <span className="hidden sm:inline">
                    {language === 'hi' ? 'तुरंत ध्यान दें' : 'urgent'}
                  </span>
                </span>
              </Link>
            )}

            {/* Language Switcher - Very prominent */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 shadow-sm active:scale-95 transition-all"
              aria-label="Toggle language"
            >
              <Languages className="w-4 h-4 text-green-700" />
              <span className="text-xs sm:text-sm font-semibold">
                {language === 'hi' ? (
                  <>
                    <span className="text-green-800">हिन्दी</span>
                    <span className="text-slate-400 text-xs font-normal"> / EN</span>
                  </>
                ) : (
                  <>
                    <span className="text-green-800">English</span>
                    <span className="text-slate-400 text-xs font-normal"> / हि</span>
                  </>
                )}
              </span>
            </button>

            {/* Quick Add Product Button (Desktop/Tablet) */}
            <Link
              to="/inventory?add=true"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 hover:bg-green-700 text-white font-bold text-sm shadow-md shadow-green-900/10 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-green-200" />
              <span>{t('actions.addProduct')}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
