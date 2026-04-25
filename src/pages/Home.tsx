import '../index.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Settings {
  id: string;
  site_name: string;
  site_description: string;
  admin_email: string;
  pinterest_url: string;
  youtube_url: string;
  ga_id: string;
  hero_title: string;
  hero_subtitle: string;
  featured_video_id: string;
  ad_slot_1: string;
  ad_slot_2: string;
  ad_slot_3: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
}

interface Template {
  id: string;
  title: string;
  slug: string;
  category: string;
  thumbnail: string;
  status: string;
}

export default function Home() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: settingsData } = await supabase.from('settings').select('*').limit(1).single();
      if (settingsData) setSettings(settingsData);

      const { data: categoriesData } = await supabase.from('categories').select('*').order('name');
      if (categoriesData) setCategories(categoriesData);

      const { data: templatesData } = await supabase.from('templates').select('*').eq('status', 'published').order('created_at', { ascending: false });
      if (templatesData) setTemplates(templatesData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const convertYouTubeUrl = (videoId: string) => {
    if (!videoId) return '';
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50 font-sans">
      <div className="text-2xl font-bold text-green-900">Loading TrackySheets...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-left">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="text-2xl font-bold text-green-900">TS</div>
            <span className="text-lg font-bold text-gray-900">{settings?.site_name || 'TrackySheets'}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-green-900 font-medium no-underline">Home</Link>
            <Link to="/templates" className="text-gray-700 hover:text-green-900 font-medium no-underline">Templates</Link>
            <Link to="/about" className="text-gray-700 hover:text-green-900 font-medium no-underline">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-900 font-medium no-underline">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-green-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">{settings?.hero_title || 'Free Spreadsheet Templates'}</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">{settings?.hero_subtitle}</p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Ad Slot 1 */}
        {settings?.ad_slot_1 && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-8 text-center text-xs text-gray-400">
            {settings.ad_slot_1}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-green-900 mb-6 uppercase tracking-widest">Categories</h2>
              <nav className="space-y-2">
                {categories.map(cat => (
                  <Link key={cat.id} to={`/category/${cat.slug}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 no-underline group transition">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt="" className="w-6 h-6 object-cover rounded" />
                    ) : (
                      <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center text-[10px] font-bold text-green-700">TS</div>
                    )}
                    <span className="text-sm font-medium text-gray-700 group-hover:text-green-900">{cat.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Featured Video */}
            {settings?.featured_video_id && (
              <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-video bg-black">
                  <iframe width="100%" height="100%" src={convertYouTubeUrl(settings.featured_video_id)} frameBorder="0" allowFullScreen />
                </div>
                <div className="p-3 bg-gray-50 text-center border-t">
                  <p className="text-[10px] font-bold uppercase text-gray-400">Featured Tutorial</p>
                </div>
              </div>
            )}
          </aside>

          {/* Templates Grid */}
          <main className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-green-900 mb-8 uppercase tracking-tight">Latest Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <Link key={template.id} to={`/template/${template.slug}`} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden no-underline hover:shadow-md transition">
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    {template.thumbnail ? (
                      <img src={template.thumbnail} alt={template.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] uppercase font-bold">No Preview</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-sm mb-3 line-clamp-2 group-hover:text-green-700 transition">{template.title}</h3>
                    <span className="inline-block text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded uppercase tracking-wider">{template.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-16 px-6 mt-20 border-t-8 border-green-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter">{settings?.site_name}</h3>
            <p className="text-green-100 text-sm leading-relaxed">{settings?.site_description}</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-green-400">Social</h4>
            <div className="flex flex-col gap-3">
              {settings?.pinterest_url && <a href={settings.pinterest_url} target="_blank" className="text-green-100 no-underline hover:text-white text-sm">Pinterest</a>}
              {settings?.youtube_url && <a href={settings.youtube_url} target="_blank" className="text-green-100 no-underline hover:text-white text-sm">YouTube</a>}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-green-400">Legal</h4>
            <div className="flex flex-col gap-3">
              <Link to="/privacy" className="text-green-100 no-underline hover:text-white text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-green-100 no-underline hover:text-white text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
