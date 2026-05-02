import React from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string; // Qui arriva il testo dal database
}

export default function LegalModal({ isOpen, onClose, title, content }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 antialiased">
      {/* Overlay con sfocatura */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Finestra Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header con Logo TS */}
        <div className="pt-10 pb-4 flex flex-col items-center">
          <div className="w-14 h-14 bg-[#1F5C3E] rounded-2xl flex items-center justify-center font-black text-white text-xl mb-4 shadow-lg shadow-[#1F5C3E]/20">
            TS
          </div>
          <h2 className="text-2xl font-bold text-[#1f2937] tracking-tight">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo del testo - Interpretazione HTML e Scrollbar moderna */}
        <div className="px-10 py-4 max-h-[55vh] overflow-y-auto text-left legal-modal-scroll">
          {content ? (
            <div 
              className="text-[#4b5563] leading-relaxed text-[15px] font-medium"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-gray-400 italic text-sm text-center py-10">
              Content not found. Please check Admin Settings.
            </p>
          )}
        </div>

        {/* Footer con pulsante Close */}
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
