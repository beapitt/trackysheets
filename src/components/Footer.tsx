import React from "react";

const GREEN = "#2D5A27";

export default function Footer() {
  return (
    <footer
      style={{ background: GREEN }}
      className="w-full mt-auto py-6 px-4"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-white text-sm font-semibold tracking-wide">
          Tracky Sheets
        </span>
        <nav className="flex items-center gap-5">
          <a
            href="/privacy"
            className="text-white/80 text-xs hover:text-white transition"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-white/80 text-xs hover:text-white transition"
          >
            Terms of Use
          </a>
          <a
            href="/disclaimer"
            className="text-white/80 text-xs hover:text-white transition"
          >
            Disclaimer
          </a>
        </nav>
        <span className="text-white/50 text-xs">
          &copy; {new Date().getFullYear()} Tracky Sheets. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
