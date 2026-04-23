import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "";
const GREEN = "#2D5A27";

interface Category { id: string; name: string; slug: string; image_url?: string; }
interface Template { id: string; title: string; slug: string; category_id: string | null; description: string; thumbnail_url: string; download_url: string; }

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [cats, tpls] = await Promise.all([
        fetch(`${API}/api/categories`).then(r => r.json()),
        fetch(`${API}/api/templates`).then(r => r.json()),
      ]);
      setCategories(Array.isArray(cats) ? cats : []);
      setTemplates(Array.isArray(tpls) ? tpls : []);
      setLoading(false);
    };
    load();
  }, []);

  const catName = (id: string | null) =>
    categories.find(c => c.id === id)?.name ?? "Uncategorized";

  const filtered = activeCat
    ? templates.filter(t => t.category_id === activeCat)
    : templates;

  return (
    <div className="flex min-h-[calc(100vh-56px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div style={{ backgroundColor: GREEN }} className="px-5 py-4">
          <p className="text-white font-bold text-sm uppercase tracking-wide">Categories</p>
        </div>
        <nav className="flex flex-col py-2 overflow-y-auto flex-1">
          <button
            onClick={() => setActiveCat(null)}
            className={"text-left px-5 py-2.5 text-sm font-medium border-l-4 transition-colors " + (
              activeCat === null
                ? "bg-green-50 border-green-700 text-green-800"
                : "border-transparent text-gray-600 hover:bg-gray-50"
            )}
          >
            All Templates
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={"text-left px-5 py-2.5 text-sm font-medium border-l-4 transition-colors flex items-center gap-2.5 " + (
                activeCat === c.id
                  ? "bg-green-50 border-green-700 text-green-800"
                  : "border-transparent text-gray-600 hover:bg-gray-50"
              )}
            >
              {c.image_url && (
                <span className="shrink-0 w-6 h-6 aspect-square overflow-hidden rounded">
                  <img src={c.image_url} alt="" loading="lazy"
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </span>
              )}
              {c.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeCat ? catName(activeCat) : "Free Spreadsheet Templates"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} template{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📄</p>
            <p className="text-base font-medium">No templates yet.</p>
            <p className="text-sm mt-1">Add some from the Admin panel.</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(t => (
              <div
                key={t.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Clickable thumbnail — 4:3 */}
                <button
                  onClick={() => navigate(`/template/${t.slug}`)}
                  className="aspect-[4/3] bg-gray-100 overflow-hidden w-full block focus:outline-none"
                  aria-label={`View ${t.title}`}
                >
                  {t.thumbnail_url ? (
                    <img
                      src={t.thumbnail_url}
                      alt={t.title}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">📄</div>
                  )}
                </button>

                <div className="p-3 flex flex-col flex-1 gap-2">
                  <span
                    className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full self-start"
                    style={{ backgroundColor: "#e8f0e7", color: GREEN }}
                  >
                    {catName(t.category_id)}
                  </span>

                  {/* Clickable title */}
                  <button
                    onClick={() => navigate(`/template/${t.slug}`)}
                    className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 flex-1 text-left hover:text-green-700 transition-colors focus:outline-none"
                  >
                    {t.title}
                  </button>

                  {t.download_url ? (
                    <a
                      href={t.download_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ backgroundColor: GREEN }}
                      className="mt-1 w-full text-center text-xs font-semibold text-white py-2 rounded hover:opacity-90 transition-opacity"
                    >
                      Download Free
                    </a>
                  ) : (
                    <button
                      onClick={() => navigate(`/template/${t.slug}`)}
                      style={{ borderColor: GREEN, color: GREEN }}
                      className="mt-1 w-full text-center text-xs font-semibold py-2 rounded border hover:bg-green-50 transition"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
