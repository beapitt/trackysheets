import React, { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#14532d', color: 'white', padding: '1rem', zIndex: 999 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '14px' }}>We use cookies to improve your experience.</p>
        <button 
          onClick={() => {
            localStorage.setItem('cookie-consent', 'true');
            setIsVisible(false);
          }}
          style={{ background: '#facc15', border: 'none', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
