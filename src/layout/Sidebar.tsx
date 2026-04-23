import React from "react";

interface SidebarProps {
  categories: { id: string; name: string; slug: string }[];
  activeSlug?: string;
}

export default function Sidebar({ categories, activeSlug }: SidebarProps) {
  return (
    <aside
      style={{ backgroundColor: "#2D5A27" }}
      className="w-56 min-h-screen flex flex-col pt-6 px-4 shadow-lg"
    >
      <p className="text-white text-xs uppercase tracking-widest mb-4 font-semibold opacity-70">
        Categories
      </p>
      <nav className="flex flex-col gap-1">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/?category=${cat.slug}`}
            className={`text-white text-sm px-3 py-2 rounded transition-colors ${
              activeSlug === cat.slug
                ? "bg-white/20 font-semibold"
                : "hover:bg-white/10"
            }`}
          >
            {cat.name}
          </a>
        ))}
      </nav>
    </aside>
  );
}
