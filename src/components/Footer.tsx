import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-left">
          <div>
            <div className="flex items-center gap-3 mb-6">
              {/* Logo corretto: TS bianco su fondo verde */}
              <div className="bg-[#14532d] text-white px-2 py-1 rounded font-bold text-lg">
                TS
              </div>
              <span className="text-[#14532d] font-bold text-lg tracking-tight">TrackySheets</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              High-quality Google Sheets templates to help you track, analyze, and optimize your business and personal life.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-3 p-0 list-none text-sm">
              <li><Link to="/" className="text-gray-500 hover:text-[#1a8856] no-underline">Home</Link></li>
              <li><Link to="/admin" className="text-gray-500 hover:text-[#1a8856] no-underline">Admin Area</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-3 p-0 list-none text-sm text-gray-500">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-50 pt-8 text-center">
          <p className="text-gray-400 text-[11px] font-medium uppercase tracking-widest">
            © {new Date().getFullYear()} TrackySheets. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
