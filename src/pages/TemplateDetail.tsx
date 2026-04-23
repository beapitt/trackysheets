import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const GREEN = "#2D5A27";
const API = "";

interface Template {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  description: string;
  seo_meta_description: string;
  thumbnail_url: string;
  carousel_url_1: string;
  carousel_url_2: string;
  carousel_url_3: string;
  youtube_url: string;
  download_url: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

function youtubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function TemplateDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [activeImg, setActiveImg] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [tpls, cats]: [Template[], Category[]] = await Promise.all([
        fetch(`${API}/api/templates`).then((r) => r.json()),
        fetch(`${API}/api/categories`).then((r) => r.json()),
      ]);
      const found = Array.isArray(tpls)
        ? tpls.find((t) => t.slug === slug) ?? null
        : null;
      if (!found) { setNotFound(true); setLoading(false); return; }
      setTemplate(found);
      setActiveImg(found.thumbnail_url || "");
      if (found.category_id && Array.isArray(cats)) {
        setCategory(cats.find((c) => c.id === found.category_id) ?? null);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm animate-pulse">Loading template...</div>
      </div>
    );
  }

  if (notFound || !template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-gray-500 text-lg font-medium">Template not found.</p>
        <button
          onClick={() => navigate("/")}
          style={{ background: GREEN }}
          className="px-5 py-2 text-white text-sm font-semibold rounded hover:opacity-90 transition"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  const carouselImages = [
    template.thumbnail_url,
    template.carousel_url_1,
    template.carousel_url_2,
    template.carousel_url_3,
  ].filter(Boolean) as string[];

  const embedUrl = youtubeEmbedUrl(template.youtube_url);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <nav className="text-xs text-gray-400 flex items-center gap-1">
          <button onClick={() => navigate("/")} className="hover:text-green-700 transition">
            Home
          </button>
          <span>/</span>
          {category && (
            <>
              <span className="hover:text-green-700 cursor-pointer transition">
                {category.name}
              </span>
              <span>/</span>
            </>
          )}
          <span className="text-gray-600 font-medium">{template.title}</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — images */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Main image — 4:3 */}
          <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            {activeImg ? (
              <img
                src={activeImg}
                alt={template.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                &#128196;
              </div>
            )}
          </div>

          {/* Carousel thumbnails */}
          {carouselImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {carouselImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(img)}
                  className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition ${
                    activeImg === img
                      ? "border-green-700 shadow"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}

          {/* YouTube embed — 16:9 */}
          {embedUrl && (
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <iframe
                src={embedUrl}
                title={`${template.title} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}

          {/* Description */}
          {template.description && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 mb-3">About this template</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {template.description}
              </p>
            </div>
          )}
        </div>

        {/* Right — action card */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-6">
            {/* Category badge */}
            {category && (
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-3"
                style={{ background: "#e8f0e6", color: GREEN }}
              >
                {category.name}
              </span>
            )}

            <h1 className="text-xl font-bold text-gray-900 mb-4 leading-snug">
              {template.title}
            </h1>

            {template.download_url ? (
              <a
                href={template.download_url}
                target="_blank"
                rel="noreferrer"
                style={{ background: GREEN }}
                className="block w-full text-center text-white font-semibold py-3 rounded-lg hover:opacity-90 transition text-sm"
              >
                ↓ Download Free
              </a>
            ) : (
              <button
                disabled
                className="block w-full text-center text-gray-400 font-semibold py-3 rounded-lg bg-gray-100 text-sm cursor-not-allowed"
              >
                No Download Available
              </button>
            )}

            <button
              onClick={() => navigate("/")}
              className="mt-3 block w-full text-center text-sm font-medium text-gray-500 hover:text-green-700 transition"
            >
              ← Back to all templates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
