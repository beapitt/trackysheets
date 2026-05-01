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
      {/* Overlay scuro che sfoca lo sfondo */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Finestra Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header con Titolo e tasto chiusura */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenuto Dinamico con Scroll */}
        <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
          <div className="text-gray-600 leading-relaxed text-[15px] whitespace-pre-wrap font-medium">
            {content}
          </div>
        </div>

        {/* Footer del Modal per chiudere */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white text-[13px] font-bold rounded-xl hover:bg-[#1F5C3E] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
