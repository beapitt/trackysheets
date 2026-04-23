import React from "react";

export default function Navbar() {
  return (
    <nav
      style={{ backgroundColor: "#2D5A27" }}
      className="w-full h-14 flex items-center px-6 shadow-md"
    >
      <span className="text-white text-xl font-bold tracking-wide">
        Tracky Sheets
      </span>
      <div className="ml-auto flex gap-6 text-white text-sm font-medium">
        <a href="/" className="hover:opacity-80 transition-opacity">Home</a>
        <a href="/admin" className="hover:opacity-80 transition-opacity">Admin</a>
      </div>
    </nav>
  );
}
