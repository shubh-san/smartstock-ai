import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechSynthesis = ({ language = 'hi' }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const speak = useCallback(
    (text) => {
      if (!isSupported || !text) return;

      // Stop any current speech
      window.speechSynthesis.cancel();

      // Clean markdown or bullet points from spoken text
      const cleanText = text
        .replace(/[*#_~`]/g, '')
        .replace(/\n+/g, '. ')
        .replace(/⚠️/g, 'चेतावनी: ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utteranceRef.current = utterance;

      // Find matching voice
      const targetLang = language === 'hi' ? 'hi-IN' : 'en-IN';
      const matchedVoice =
        voices.find((v) => v.lang.toLowerCase() === targetLang.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(language === 'hi' ? 'hi' : 'en'));

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      utterance.lang = targetLang;
      utterance.rate = 0.95; // slightly slower for maximum clarity for elders
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, language, voices]
  );

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
  };
};
