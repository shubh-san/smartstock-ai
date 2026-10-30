import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { calculateDaysRemaining, formatDisplayDate } from '../utils/dateUtils';
import {
  QrCode,
  Camera,
  CameraOff,
  Search,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Package,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { AddBatchModal } from '../components/inventory/AddBatchModal';
import { AddProductModal } from '../components/inventory/AddProductModal';
import { Html5Qrcode } from 'html5-qrcode';

export const ScanPage = () => {
  const { t, language } = useLanguage();
  const { products } = useApp();

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scannedCode, setScannedCode] = useState('');
  const [manualCodeInput, setManualCodeInput] = useState('');
  const [matchedProduct, setMatchedProduct] = useState(null);
  const [qrParsedData, setQrParsedData] = useState(null);
  const [scanSuccessAnim, setScanSuccessAnim] = useState(false);

  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const scannerRef = useRef(null);

  // Initialize camera scanner
  const startCamera = async () => {
    setCameraError(null);
    try {
      const html5QrCode = new Html5Qrcode('qr-reader-container');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // ignore stream scanning frame failures
        }
      );
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera error:', err);
      setCameraError(
        language === 'hi'
          ? 'कैमरा शुरू नहीं हो सका या अनुमति नहीं मिली। कृपया नीचे दिए गए इनपुट से बारकोड दर्ज करें।'
          : 'Could not access camera or permission denied. Please use the manual code entry below.'
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current && isCameraActive) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.warn('Stop scanner error:', err);
      }
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && isCameraActive) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [isCameraActive]);

  const handleScanSuccess = (code) => {
    setScannedCode(code);
    setScanSuccessAnim(true);
    setTimeout(() => setScanSuccessAnim(false), 2000);

    // Stop camera after successful scan so user can review details
    stopCamera();

    // Check if code is structured QR JSON
    let parsedJson = null;
    try {
      parsedJson = JSON.parse(code);
    } catch (e) {
      parsedJson = null;
    }

    if (parsedJson && (parsedJson.expiry || parsedJson.exp)) {
      setQrParsedData(parsedJson);
    } else {
      setQrParsedData(null);
    }

    // Match with products
    const cleanCode = code.trim();
    const found = products.find(
      (p) =>
        p.barcode === cleanCode ||
        (parsedJson && parsedJson.barcode && p.barcode === parsedJson.barcode)
    );

    setMatchedProduct(found || null);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCodeInput.trim()) return;
    handleScanSuccess(manualCodeInput.trim());
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t('scanner.title')}
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">
          {t('scanner.subtitle')}
        </p>
      </div>

      {/* Main Scanner Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-soft space-y-6">
        {/* Camera Viewport Container */}
        <div className="relative bg-slate-950 rounded-3xl overflow-hidden min-h-[300px] flex flex-col items-center justify-center p-4">
          <div id="qr-reader-container" className="w-full max-w-sm rounded-2xl overflow-hidden" />

          {!isCameraActive && (
            <div className="text-center p-6 text-white space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mx-auto text-green-400">
                <QrCode className="w-9 h-9" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">
                  {language === 'hi' ? 'कैमरा स्कैनर तैयार है' : 'Camera Scanner Ready'}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                  {t('scanner.cameraPrompt')}
                </p>
              </div>
              <button
                onClick={startCamera}
                className="px-6 py-3.5 rounded-2xl bg-green-700 hover:bg-green-600 text-white font-extrabold text-sm shadow-lg active:scale-95 transition-all inline-flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                <span>{t('actions.startCamera')}</span>
              </button>
            </div>
          )}

          {isCameraActive && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
              <button
                onClick={stopCamera}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2"
              >
                <CameraOff className="w-4 h-4" />
                <span>{t('actions.stopCamera')}</span>
              </button>
            </div>
          )}

          {/* Success scan overlay badge */}
          {scanSuccessAnim && (
            <div className="absolute inset-0 bg-green-900/80 backdrop-blur-xs flex items-center justify-center text-white p-6 z-20 animate-in fade-in duration-150">
              <div className="text-center space-y-2">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-lg font-black">{t('scanner.scanSuccess')}</h3>
                <p className="text-xs text-emerald-200 font-mono">{scannedCode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Camera Error / Unavailable Message */}
        {cameraError && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs font-semibold leading-relaxed">
              {cameraError}
            </div>
          </div>
        )}

        {/* Manual Code Entry Form */}
        <div className="pt-2">
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={manualCodeInput}
                onChange={(e) => setManualCodeInput(e.target.value)}
                placeholder={t('scanner.enterBarcodeManually')}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-green-600 font-mono text-sm font-bold placeholder:font-sans placeholder:font-normal"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-green-800 hover:bg-green-700 text-white font-extrabold text-sm shadow-md shrink-0 active:scale-95 transition-all"
            >
              {t('scanner.submitCode')}
            </button>
          </form>

          {/* Quick Demo Scan shortcuts for instant testing without camera */}
          <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-slate-400">
              {language === 'hi' ? 'टेस्ट के लिए क्लिक करें:' : 'Try Demo Codes:'}
            </span>
            <button
              onClick={() => handleScanSuccess('8901262010014')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              🥛 अमूल दूध
            </button>
            <button
              onClick={() => handleScanSuccess('8901063012015')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              🍞 ब्रिटानिया ब्रेड
            </button>
            <button
              onClick={() => handleScanSuccess('8901719101036')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              🍪 पारले-जी
            </button>
            <button
              onClick={() => handleScanSuccess('{"name":"स्मार्ट नया सामान","exp":"2026-11-20","batch":"QR-777"}')}
              className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold"
            >
              ⚡ स्ट्रक्चर्ड QR
            </button>
          </div>
        </div>
      </div>

      {/* Scanned Result Card */}
      {scannedCode && (
        <div className="bg-white rounded-3xl border-2 border-green-700 p-6 shadow-card space-y-4 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-extrabold text-sm text-slate-900">
                {matchedProduct ? t('scanner.matchedProduct') : t('scanner.unknownBarcode')}
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
              {scannedCode.length > 25 ? `${scannedCode.slice(0, 25)}...` : scannedCode}
            </span>
          </div>

          {/* Expiry Warning: Explicitly do not pretend standard barcode has expiry */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {qrParsedData
                ? t('scanner.qrHasExpiry')
                : t('scanner.expiryWarning')}
            </p>
          </div>

          {matchedProduct ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-900 flex items-center justify-center text-3xl">
                  {matchedProduct.image || '📦'}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {language === 'hi' ? matchedProduct.name : matchedProduct.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {matchedProduct.batches.reduce((s, b) => s + b.quantity, 0)} {matchedProduct.unit} उपलब्ध • बिक्री रेट: ₹{matchedProduct.sellingPrice}
                  </p>
                </div>
              </div>

              {/* Batches in store */}
              <div className="p-3 bg-slate-50 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-slate-600 block">
                  दुकान में मौजूद मौजूदा बैच:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {matchedProduct.batches.map((b) => (
                    <div key={b.id} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                      <div className="flex justify-between font-bold">
                        <span>बैच: {b.batchNumber}</span>
                        <span>{b.quantity} {matchedProduct.unit}</span>
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        एक्सपायरी: {formatDisplayDate(b.expiryDate, language)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowAddBatchModal(true)}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-green-800 hover:bg-green-700 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-green-200" />
                  <span>{t('scanner.addBatchForProduct')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <p className="text-sm font-semibold text-slate-700">
                {language === 'hi'
                  ? 'यह बारकोड आपकी दुकान की सूची में नहीं है। क्या आप इसे नए सामान के रूप में जोड़ना चाहते हैं?'
                  : 'This barcode is not yet registered. Would you like to add it as a new product?'}
              </p>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-6 py-3 rounded-2xl bg-green-800 hover:bg-green-700 text-white font-extrabold text-sm shadow-md flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('actions.addProduct')}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showAddBatchModal && matchedProduct && (
        <AddBatchModal
          product={matchedProduct}
          onClose={() => setShowAddBatchModal(false)}
        />
      )}

      {showAddProductModal && (
        <AddProductModal
          prefillBarcode={scannedCode}
          onClose={() => setShowAddProductModal(false)}
        />
      )}
    </div>
  );
};
