import React, { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setIsVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-4 z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 text-left">
          We use cookies to ensure you get the best experience on TrackySheets. By continuing to use our site, you accept our use of cookies and privacy policy.
        </p>
        <button 
          onClick={accept}
          className="bg-[#14532d] text-white px-8 py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-[#1a8856] transition whitespace-nowrap"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
