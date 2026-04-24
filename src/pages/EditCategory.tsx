import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from "../lib/supabase";

export default function EditTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '', slug: '', category_id: '', short_description: '', description: '',
    download_url: '', thumbnail_url: '', youtube_url: '', 
    img_1: '', img_2: '', img_3: '',
    seo_title: '', meta_description: '', is_featured: false
  });

  useEffect(() => {
    fetchCategories();
    if (id) fetchTemplate();
  }, [id]);

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
  }

  async function fetchTemplate() {
    const { data } = await supabase.from("templates").select("*").eq("id", id).single();
    if (data) setFormData(data);
  }

  // FUNZIONE PER UPLOAD IMMAGINI
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `templates/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('template-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('template-images').getPublicUrl(filePath);
      setFormData({ ...formData, [field]: data.publicUrl });
      
    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = id 
      ? await supabase.from("templates").update(formData).eq("id", id)
      : await supabase.from("templates").insert([formData]);

    if (error) alert("Error: " + error.message);
    else navigate('/admin/templates');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-left font-sans">
      <aside className="w-48 bg-[#1a3a1a] text-white p-6 shrink-0">
        <div className="mb-8 font-bold text-2xl">TS</div>
        <nav className="space-y-2 text-sm">
          <Link to="/admin/templates" className="block px-4 py-2 rounded bg-white/10 border-l-4 border-green-400 no-underline text-white font-bold">Templates</Link>
          <Link to="/admin/categories" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Categories</Link>
          <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-white/10 no-underline text-white">Settings</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl bg-white rounded-lg shadow-md mb-10 p-8">
          <h1 className="text-2xl font-bold text-[#2D5A27] mb-6 border-b pb-4">
            {id ? 'Edit Template' : 'Add New Template'}
          </h1>
          
          <form onSubmit={handleSave} className="space-y-8">
            {/* THUMBNAIL UPLOAD */}
            <section className="bg-gray-50 p-4 rounded-lg border">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Main Thumbnail (16:10)</label>
              <div className="flex items-center gap-4">
                {formData.thumbnail_url && <img src={formData.thumbnail_url} className="w-32 h-20 object-cover rounded border" alt="Preview" />}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail_url')} className="text-xs" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{uploading ? 'Uploading...' : 'Upload a high-quality JPG or PNG'}</p>
            </section>

            {/* BASIC INFO */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-2 border rounded" />
              </div>
            </div>

            {/* CAROUSEL IMAGES UPLOAD */}
            <section className="space-y-4">
              <h3 className="font-bold text-gray-400 uppercase text-xs border-b pb-1">Carousel Images (Max 3)</h3>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="border p-2 rounded bg-white">
                    <label className="block text-[10px] font-bold mb-1">Image {num}</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, `img_${num}`)} className="text-[10px] w-full" />
                    {formData[`img_${num}` as keyof typeof formData] && (
                      <img src={formData[`img_${num}` as keyof typeof formData] as string} className="mt-2 h-16 w-full object-cover rounded" />
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div className="pt-6 border-t flex gap-4">
              <button disabled={loading || uploading} type="submit" className="bg-[#2D5A27] text-white px-10 py-3 rounded font-bold uppercase text-sm shadow-md">
                {loading ? 'Saving...' : 'Save Template'}
              </button>
              <Link to="/admin/templates" className="bg-gray-200 text-gray-700 px-10 py-3 rounded font-bold no-underline uppercase text-sm">Cancel</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
