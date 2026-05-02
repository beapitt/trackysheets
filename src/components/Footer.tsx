import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LegalModal from './LegalModal';

export default function Footer() {
  const [modalData, setModalData] = useState({ isOpen: false, title: '', content: '' });
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) setSettings(data);
    }
    fetchSettings();
  }, []);

  const openLegal = (type: 'privacy' | 'terms' | 'disclaimer') => {
    if (!settings) return;

    const map = {
      privacy: { 
        title: 'Privacy Policy', 
        content: settings.privacy_policy 
      },
      terms: { 
        title: 'Terms of Service', 
        // Correzione: puntiamo alla colonna esatta del DB (terms_of_use)
        content: settings.terms_of_use || settings.terms_conditions 
      },
      disclaimer: { 
        title: 'Disclaimer', 
        content: settings.disclaimer 
      }
    };

    setModalData({
      isOpen: true,
      title: map[type].title,
      content: map[type].content || 'Content not available yet.'
    });
  };

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto w-full">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1F5C3E] rounded-md flex items-center justify-center text-white text-[12px] font-bold shadow-sm">
            TS
          </div>
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} TrackySheets
          </span>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          <Link 
            to="/templates"
            className="text-[11px] text-gray-400 hover:text-[#1F5C3E] no-underline transition-colors font-bold uppercase tracking-[0.2em]"
          >
            All Templates
          </Link>

          <button 
            onClick={() => openLegal('privacy')}
            className="text-[11px] text-gray-400 hover:text-[#1F5C3E] transition-colors font-bold uppercase tracking-[0.2em]"
          >
            Privacy Policy
          </button>

          <button 
            onClick={() => openLegal('terms')}
            className="text-[11px] text-gray-400 hover:text-[#1F5C3E] transition-colors font-bold uppercase tracking-[0.2em]"
          >
            Terms of Service
          </button>

          <button 
            onClick={() => openLegal('disclaimer')}
            className="text-[11px] text-gray-400 hover:text-[#1F5C3E] transition-colors font-bold uppercase tracking-[0.2em]"
          >
            Disclaimer
          </button>
        </nav>
      </div>

      <LegalModal 
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        title={modalData.title}
        content={modalData.content}
      />
    </footer>
  );
}
