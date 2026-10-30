import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Languages,
  Store,
  User,
  Volume2,
  Bell,
  LogOut,
  CheckCircle2,
  RotateCcw,
  Shield,
  ExternalLink,
} from 'lucide-react';

export const SettingsPage = () => {
  const { t, language, setLanguage } = useLanguage();
  const {
    shop,
    setShop,
    voiceSettings,
    setVoiceSettings,
    resetToMockData,
  } = useApp();

  const [shopForm, setShopForm] = useState({
    name: shop.name || '',
    owner: shop.owner || '',
    phone: shop.phone || '',
    address: shop.address || '',
  });

  const [autoSpeak, setAutoSpeak] = useState(voiceSettings.autoSpeak ?? true);
  const [morningAlerts, setMorningAlerts] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveShop = (e) => {
    e.preventDefault();
    setShop((prev) => ({
      ...prev,
      name: shopForm.name,
      owner: shopForm.owner,
      phone: shopForm.phone,
      address: shopForm.address,
    }));
    showToast(t('settings.savedMessage'));
  };

  const handleToggleAutoSpeak = () => {
    const newVal = !autoSpeak;
    setAutoSpeak(newVal);
    setVoiceSettings((prev) => ({ ...prev, autoSpeak: newVal }));
    showToast('आवाज़ सेटिंग्स अपडेट हो गईं!');
  };

  const handleResetData = () => {
    if (
      window.confirm(
        language === 'hi'
          ? 'क्या आप डेमो डेटा को वापस शुरुआती स्थिति में लाना चाहते हैं?'
          : 'Reset all data back to original demo values?'
      )
    ) {
      resetToMockData();
      showToast('डेमो डेटा रीसेट हो गया!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>{t('settings.title')}</span>
          <Settings className="w-7 h-7 text-green-800" />
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* 1. Language Selection */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Languages className="w-5 h-5 text-green-800" />
          <h2 className="text-base font-extrabold text-slate-900">
            {t('settings.languageSection')}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`p-4 rounded-2xl border-2 text-left font-black transition-all ${
              language === 'hi'
                ? 'border-green-800 bg-green-50 text-green-950 shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="text-lg">हिन्दी</div>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              सरल बोलचाल की हिन्दी
            </p>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`p-4 rounded-2xl border-2 text-left font-black transition-all ${
              language === 'en'
                ? 'border-green-800 bg-green-50 text-green-950 shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="text-lg">English</div>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Indian English
            </p>
          </button>
        </div>
      </div>

      {/* 2. Shop & Profile Info */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Store className="w-5 h-5 text-green-800" />
          <h2 className="text-base font-extrabold text-slate-900">
            {t('settings.shopInfo')}
          </h2>
        </div>

        <form onSubmit={handleSaveShop} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('settings.shopName')}
              </label>
              <input
                type="text"
                value={shopForm.name}
                onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-green-600 font-semibold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('settings.ownerName')}
              </label>
              <input
                type="text"
                value={shopForm.owner}
                onChange={(e) => setShopForm({ ...shopForm, owner: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-green-600 font-semibold text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('settings.phone')}
              </label>
              <input
                type="text"
                value={shopForm.phone}
                onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-green-600 font-semibold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('settings.address')}
              </label>
              <input
                type="text"
                value={shopForm.address}
                onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-green-600 font-semibold text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-green-800 hover:bg-green-700 text-white font-extrabold text-sm shadow-md"
            >
              {t('settings.saveSettingsBtn')}
            </button>
          </div>
        </form>
      </div>

      {/* 4. Voice & Notification Toggles */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Volume2 className="w-5 h-5 text-green-800" />
          <h2 className="text-base font-extrabold text-slate-900">
            {t('settings.voiceSettings')}
          </h2>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">
              {t('settings.autoSpeakAi')}
            </h4>
            <p className="text-xs text-slate-500">
              AI सहायक का उत्तर स्पीकर से अपने-आप बोलकर सुनाया जाएगा
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleAutoSpeak}
            className={`w-14 h-8 rounded-full p-1 transition-colors ${
              autoSpeak ? 'bg-green-800' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${
                autoSpeak ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-slate-100">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">
              {t('settings.dailyMorningAlerts')}
            </h4>
            <p className="text-xs text-slate-500">
              दुकान खोलने पर तुरंत एक्सपायर होने वाले सामान की सूची दिखेगी
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMorningAlerts(!morningAlerts)}
            className={`w-14 h-8 rounded-full p-1 transition-colors ${
              morningAlerts ? 'bg-green-800' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${
                morningAlerts ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 5. Demo Data Management & Reset */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-sm text-slate-900">
            डेमो डेटा रीसेट (Restore Original Data)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            सभी उत्पादों, बैचों व बिक्री को मूल डिफ़ॉल्ट स्थिति में लाएं
          </p>
        </div>
        <button
          onClick={handleResetData}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>डेटा रीसेट करें</span>
        </button>
      </div>
    </div>
  );
};
