import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    /* Sostituito crema con bianco e ridotto il margine superiore */
    <footer className="bg-white border-t border-gray-100 mt-8">
      <div className="max-w-[1550px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Sinistra: Logo compatto e Copyright */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-[#1F5C3E] rounded flex items-center justify-center text-white text-[9px] font-bold">
            TS
          </div>
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
            © {new Date().getFullYear()} TrackySheets
          </span>
        </div>

        {/* Destra: Link puliti senza distrazioni */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            { label: 'All Templates', href: '/templates' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Disclaimer', href: '/disclaimer' },
          ].map((link) => (
            <Link 
              key={link.label} 
              to={link.href} 
              className="text-[11px] text-gray-400 hover:text-[#1F5C3E] no-underline transition-colors font-bold uppercase tracking-wider"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
