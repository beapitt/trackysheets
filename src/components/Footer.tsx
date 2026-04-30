import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    /* Eliminato il verde scuro, ora fondo crema e bordo sottile grigio */
    <footer className="bg-[#f5f4ed] border-t border-gray-200 mt-12">
      <div className="max-w-[1550px] mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Sinistra: Logo compatto e Copyright */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#1F5C3E] rounded flex items-center justify-center text-white text-[10px] font-bold">
            TS
          </div>
          <span className="text-[12px] text-gray-500 font-medium">
            © {new Date().getFullYear()} TrackySheets · Free Sheets & Planners
          </span>
        </div>

        {/* Destra: Link di navigazione orizzontali */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {[
            { label: 'All Templates', href: '/templates' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Disclaimer', href: '/disclaimer' },
          ].map((link) => (
            <Link 
              key={link.label} 
              to={link.href} 
              className="text-[12px] text-gray-500 hover:text-[#1F5C3E] no-underline transition-colors font-semibold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
