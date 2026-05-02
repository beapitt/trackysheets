import React from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export default function LegalModal({ isOpen, onClose, title, content }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 antialiased">
      {/* Overlay scuro con sfocatura leggera */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Finestra Modal - Design ispirato a ServiceNow */}
      <div className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header: Logo TS centrato */}
        <div className="pt-10 pb-4 flex flex-col items-center">
          <div className="w-14 h-14 bg-[#1F5C3E] rounded-2xl flex items-center justify-center font-black text-white text-xl mb-4 shadow-lg shadow-[#1F5C3E]/20">
            TS
          </div>
          <h2 className="text-2xl font-bold text-[#1f2937] tracking-tight">
            {title}
          </h2>
          {/* Tasto X in alto a destra */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo del testo: interpreta i tag HTML (Bold, Br, ecc.) */}
        <div className="px-10 py-4 max-h-[55vh] overflow-y-auto text-left">
          <div 
            className="text-[#4b5563] leading-relaxed text-[15px] font-medium legal-content-body"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* Footer: Pulsante Verde Smussato */}
        <div className="px-10 pt-6 pb-10 flex flex-col gap-4">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-[#1F5C3E] text-white text-[15px] font-bold rounded-[18px] hover:bg-black transition-all shadow-md active:scale-[0.98]"
          >
            Close
          </button>
          
          <p className="text-[10px] text-gray-300 text-center font-bold uppercase tracking-widest">
            TrackySheets • Free Resources
          </p>
        </div>
      </div>
    </div>
  );
}
