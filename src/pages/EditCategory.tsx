import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from "../lib/supabase";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '', slug: '', seo_title: '', meta_description: '',
    placement: 'sidebar', sort_order: 1,
  });

  useEffect(() => {
    if (id && id !== 'new') fetchCategory();
    else setLoading(false);
  }, [id]);

  async function fetchCategory() {
    try {
      const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();
      if (error) throw error;
      if (data) setFormData(data);
    } catch (err) {
      setMessage('Error');
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = (id && id !== 'new')
        ? await supabase.from('categories').update(formData).eq('id', id)
        : await supabase.from('categories').insert([formData]);
      if (error) throw error;
      navigate('/admin/categories');
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6', textAlign: 'left', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '200px', backgroundColor: '#1a3a1a', color: 'white', padding: '20px' }}>
        <nav>
          <Link to="/admin/templates" style={{ color: 'white', display: 'block', marginBottom: '10px' }}>Templates</Link>
          <Link to="/admin/categories" style={{ color: 'white', display: 'block', fontWeight: 'bold' }}>Categories</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '40px' }}>
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '600px' }}>
          <h1 style={{ color: '#2D5A27', marginBottom: '20px' }}>Category Detail</h1>
          {message && <div style={{ color: 'red', marginBottom: '10px' }}>{message}</div>}
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>NAME</label>
              <input required style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>SLUG</label>
              <input required style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }} value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
            </div>
            <button type="submit" disabled={saving} style={{ backgroundColor: '#2D5A27', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

