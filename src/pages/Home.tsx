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
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .single();
      
      if (settingsData) setSettings(settingsData);

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name, slug, image_url')
        .order('name', { ascending: true });
      
      if (categoriesData) setCategories(categoriesData);

      // Fetch published templates
      const { data: templatesData } = await supabase
        .from('templates')
        .select('id, title, slug, category, thumbnail, status')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 font-sans">
        <div className="text-2xl font-bold text-green-900">Loading TrackySheets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-left">
      {/* Ad Slot 1 - Top Banner */}
      {settings?.ad_slot_1 && (
        <div className="bg-gray-100 border-b border-gray-300 p-4 text-center text-xs text-gray-500">
          {settings.ad_slot_1}
        </div>
      )}

      {/* Hero Banner */}
      <section className="bg-green-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">{settings?.hero_title || 'Free Spreadsheet Templates'}</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">{settings?.hero_subtitle || 'Professional Google Sheets solutions'}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
              <h2 className="text-lg font-bold text-green-900 mb-4 uppercase tracking-wider">Categories</h2>
              <nav className="space-y-2">
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="flex items-center gap-3 p-2 rounded hover:bg-green-50 text-gray-700 no-underline transition"
                  >
                    {cat.image_url ? (
                      <img src={cat.image_url} alt="" className="w-5 h-5 object-cover rounded" />
                    ) : (
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                    <span className="text-sm font-medium">{cat.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Featured Video */}
            {settings?.featured_video_id && (
              <div className="rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={convertYouTubeUrl(settings.featured_video_id)}
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="p-2 bg-gray-50 text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Featured Tutorial</p>
                </div>
              </div>
            )}

            {/* Ad Slot 2 - Sidebar */}
            {settings?.ad_slot_2 && (
              <div className="mt-6 bg-gray-50 rounded p-4 border border-dashed border-gray-300 text-center text-[10px] text-gray-400">
                {settings.ad_slot_2}
              </div>
            )}
          </aside>

          {/* Main Grid */}
          <main className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-green-900 mb-6 uppercase tracking-tight">Latest Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.length > 0 ? (
                templates.map(template => (
                  <Link
                    key={template.id}
                    to={`/template/${template.slug}`}
                    className="group bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 no-underline hover:shadow-md transition"
                  >
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      {template.thumbnail ? (
                        <img src={template.thumbnail} alt={template.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase">No Preview</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2 group-hover:text-green-700 transition line-clamp-2 text-sm">
                        {template.title}
                      </h3>
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded uppercase">
                        {template.category}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-400 italic">No templates found.</div>
              )}
            </div>

            {/* Ad Slot 3 - In-content */}
            {settings?.ad_slot_3 && (
              <div className="bg-gray-50 rounded-lg p-8 border border-dashed border-gray-300 text-center my-12 text-xs text-gray-400">
                {settings.ad_slot_3}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-12 px-4 border-t-4 border-green-700">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4 uppercase">{settings?.site_name || 'TrackySheets'}</h3>
            <p className="text-green-100 text-sm leading-relaxed">{settings?.site_description}</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-green-400">Follow Us</h4>
            <div className="flex flex-col gap-2">
              {settings?.pinterest_url && <a href={settings.pinterest_url} target="_blank" className="text-green-100 no-underline hover:text-white text-sm">Pinterest</a>}
              {settings?.youtube_url && <a href={settings.youtube_url} target="_blank" className="text-green-100 no-underline hover:text-white text-sm">YouTube</a>}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-green-400">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/privacy" className="text-green-100 no-underline hover:text-white text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-green-100 no-underline hover:text-white text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
