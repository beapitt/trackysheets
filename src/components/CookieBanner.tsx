import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (choice: 'accepted' | 'declined') => {
    localStorage.setItem('cookie-consent', choice);
    
    // Funzione per gestire i tracciamenti in base alla scelta
    if (choice === 'accepted') {
      window.gtag?.('consent', 'update', {
        'analytics_storage': 'granted'
      });
    } else {
      window.gtag?.('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
    
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[380px] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl p-6 z-[9999] transition-all animate-in fade-in slide-in-from-bottom-5 duration-700 text-left">
      <div className="relative">
        <button onClick={() => setIsVisible(false)} className="absolute -top-1 -right-1 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>

        <div className="flex items-start gap-4 mb-5">
          <div className="bg-green-50 p-3 rounded-xl">
            <Cookie className="text-[#1F5C3E]" size={24} />
          </div>
          <div>
            <h4 className="text-[#1f2937] font-bold text-base leading-tight mb-1 text-left">Cookie Settings</h4>
            <p className="text-gray-500 text-[13px] leading-relaxed text-left">
              We use cookies to improve your experience. If you decline, we won't track your visit. 
              Read our <Link to="/privacy" className="text-[#1F5C3E] underline font-medium">Privacy Policy</Link>.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => handleConsent('accepted')}
            className="w-full bg-[#1F5C3E] hover:bg-[#16422d] text-white text-sm font-bold py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            Accept All
          </button>
          <button 
            onClick={() => handleConsent('declined')}
            className="w-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 text-[13px] font-semibold py-2.5 rounded-xl transition-all"
          >
            Decline All
          </button>
        </div>
      </div>
    </div>
  );
}
