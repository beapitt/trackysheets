import React, { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#14532d] text-white p-4 z-[100] shadow-2xl border-t border-green-700 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-left">
        <p className="text-sm opacity-95 leading-relaxed m-0">
          This website uses cookies to ensure you get the best experience on TrackySheets. 
          By continuing, you agree to our <a href="/privacy" className="text-white underline hover:text-green-200">Privacy Policy</a>.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button 
            onClick={handleDecline}
            className="bg-transparent hover:bg-green-800 text-white border border-green-400 py-2 px-4 rounded text-[11px] font-bold uppercase tracking-widest transition cursor-pointer"
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="bg-[#1a8856] hover:bg-green-600 text-white py-2 px-6 rounded text-[11px] font-bold uppercase tracking-widest transition cursor-pointer border-none shadow-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
