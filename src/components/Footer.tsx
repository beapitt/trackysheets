import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto w-full">
      <div className="max-w-[1550px] mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1F5C3E] rounded-md flex items-center justify-center text-white text-[12px] font-bold shadow-sm">
            TS
          </div>
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} TrackySheets
          </span>
        </div>

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
              className="text-[11px] text-gray-400 hover:text-[#1F5C3E] no-underline transition-colors font-bold uppercase tracking-[0.2em]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
