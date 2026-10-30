import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { generateAIResponse } from '../services/aiService';
import { apiService } from '../services/apiService';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  BotMessageSquare,
  User,
  Trash2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const AIAssistantPage = () => {
  const { t, language } = useLanguage();
  const { products, sales, discounts, voiceSettings } = useApp();

  const [messages, setMessages] = useState(() => {
    return [
      {
        id: 'msg_initial',
        sender: 'ai',
        text:
          language === 'hi'
            ? 'नमस्ते राजेश जी! मैं आपका SmartStock AI सहायक हूँ। मुझसे अपनी दुकान की एक्सपायरी, छूट या बिक्री के बारे में अपनी भाषा में पूछें। नीचे दिए माइक को दबाकर बोलें।'
            : 'Hello Rajesh ji! I am your SmartStock AI assistant. Ask about your inventory, expiring items, discounts, or sales in your own words. Tap the mic below to speak.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis({ language });

  // Handle Speech Recognition Result
  const handleSpeechResult = (spokenTranscript) => {
    if (spokenTranscript && spokenTranscript.trim()) {
      handleUserQuery(spokenTranscript.trim());
    }
  };

  const {
    isListening,
    transcript,
    isSupported: isSpeechSupported,
    errorMessage: speechError,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onResult: handleSpeechResult,
    language,
  });

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isListening, transcript]);

  // Main Query Handler
  const handleUserQuery = async (queryText) => {
    if (!queryText.trim()) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      let aiText = '';

      // Check if live FastAPI backend exists
      if (apiService.isLiveBackend()) {
        const res = await apiService.sendAIQuery({
          query: queryText,
          language,
          contextData: { productsCount: products.length, salesCount: sales.length },
        });
        aiText = res.answer;
      } else {
        // High quality local context-aware NLP engine
        aiText = generateAIResponse({
          query: queryText,
          language,
          products,
          sales,
          discounts,
        });
      }

      const aiMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Auto speak if enabled in settings
      if (voiceSettings.autoSpeak) {
        speak(aiText);
      }
    } catch (err) {
      console.warn('AI error:', err);
      const errMessage = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text:
          language === 'hi'
            ? 'माफ़ कीजिए, उत्तर तैयार करने में समस्या आई। कृपया दोबारा पूछें।'
            : 'Sorry, I encountered an issue preparing the response. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleUserQuery(inputText);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        text:
          language === 'hi'
            ? 'बातचीत खाली कर दी गई है। आप नया सवाल पूछ सकते हैं।'
            : 'Conversation cleared. You can ask a new question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    stopSpeaking();
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8.5rem)] lg:h-[calc(100vh-7rem)] bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-green-900 to-emerald-900 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
              <span>{t('ai.title')}</span>
              <span className="text-[10px] bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-bold">
                Hindi Voice
              </span>
            </h1>
            <p className="text-xs text-green-200">{t('ai.subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 text-xs font-bold shadow-xs animate-pulse"
              title="Stop Speaking"
            >
              <VolumeX className="w-4 h-4" />
              <span className="hidden sm:inline">{t('actions.stopAudio')}</span>
            </button>
          )}

          <button
            onClick={clearChat}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Questions Bar (Scrollable chips) */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          {language === 'hi' ? 'सुझावित सवाल:' : 'Quick ask:'}
        </span>
        {t('ai.suggestedQuestions').map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleUserQuery(q)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-green-50 border border-slate-200 hover:border-green-300 text-slate-700 hover:text-green-900 text-xs font-semibold shrink-0 shadow-2xs transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Area (WhatsApp-like) */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#f8f9fa]">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-[88%] sm:max-w-[78%] ${
                isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                  isAi
                    ? 'bg-green-800 text-amber-300'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {isAi ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 shadow-xs text-sm leading-relaxed ${
                  isAi
                    ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                    : 'bg-emerald-700 text-white rounded-tr-xs'
                }`}
              >
                {/* Speaker button on AI responses */}
                {isAi && (
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-green-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      SmartStock AI
                    </span>
                    <button
                      onClick={() => speak(msg.text)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-green-800 flex items-center gap-1 text-[11px] font-bold"
                      title={t('actions.playAudio')}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-green-700" />
                      <span>{t('actions.playAudio')}</span>
                    </button>
                  </div>
                )}

                <p className="whitespace-pre-line font-medium">{msg.text}</p>

                <div
                  className={`text-[10px] mt-1.5 text-right font-semibold ${
                    isAi ? 'text-slate-400' : 'text-emerald-200'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Listening Indicator Bubble */}
        {isListening && (
          <div className="flex items-start gap-2.5 mr-auto max-w-[80%] animate-in fade-in duration-150">
            <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center animate-spin">
              <Mic className="w-4 h-4" />
            </div>
            <div className="bg-green-50 border-2 border-green-400 rounded-2xl rounded-tl-xs p-4 shadow-xs">
              <div className="flex items-center gap-2 text-green-900 font-extrabold text-xs mb-1">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-ping" />
                <span>{t('ai.listening')}</span>
              </div>
              <p className="text-slate-800 text-sm font-semibold italic">
                "{transcript || (language === 'hi' ? 'बोलिए...' : 'Speak now...')}"
              </p>
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2 mr-auto text-xs text-slate-500 font-bold bg-white px-4 py-2 rounded-full border border-slate-200 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>
              {language === 'hi' ? 'AI उत्तर तैयार कर रहा है...' : 'AI is thinking...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Warning if Speech Recognition is unsupported */}
      {speechError && (
        <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{speechError}</span>
          </div>
          <button
            onClick={() => handleUserQuery(t('ai.suggestedQuestions')[0])}
            className="underline font-bold"
          >
            क्लिक करके पूछें
          </button>
        </div>
      )}

      {/* Voice Mic & Text Input Control Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-2">
        {/* Large Prominent Mic Button in Center */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => {
              if (isListening) {
                stopListening();
              } else {
                startListening();
              }
            }}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
              isListening
                ? 'bg-rose-600 text-white mic-recording-pulse ring-4 ring-rose-200'
                : 'bg-green-800 hover:bg-green-700 text-white ring-4 ring-green-100 hover:ring-green-200'
            }`}
            title={isListening ? t('actions.tapToStop') : t('actions.speakNow')}
          >
            {isListening ? (
              <MicOff className="w-7 h-7 animate-pulse" />
            ) : (
              <Mic className="w-7 h-7" />
            )}
          </button>
        </div>
        <p className="text-center text-[11px] font-bold text-slate-500">
          {isListening ? (
            <span className="text-rose-600 font-extrabold animate-pulse">
              ● {t('actions.tapToStop')}
            </span>
          ) : (
            t('actions.speakNow')
          )}
        </p>

        {/* Text Input Fallback */}
        <form onSubmit={handleTextSubmit} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('ai.textPlaceholder')}
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-green-600 text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-green-800 hover:bg-green-700 disabled:opacity-40 text-white font-bold shadow-xs transition-all active:scale-95"
            title="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
