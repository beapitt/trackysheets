import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Settings {
  id: string;
  site_name: string;
  site_description: string;
  admin_email: string;
  pinterest_url: string;
  youtube_url: string;
  homepage_description: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    admin_email: '',
    pinterest_url: '',
    youtube_url: '',
    homepage_description: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings(data);
        setFormData(data);
      }
    } catch (err) {
      setMessage('Error loading settings');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (settings) {
        const { error } = await supabase
          .from('settings')
          .update(formData)
          .eq('id', settings.id);

        if (error) throw error;
        setMessage('Settings updated successfully');
      } else {
        const { error } = await supabase
          .from('settings')
          .insert([formData]);

        if (error) throw error;
        setMessage('Settings created successfully');
      }

      setMessageType('success');
    } catch (err) {
      setMessage('Error saving settings');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-48 bg-green-900 text-white p-6">
        <div className="mb-8">
          <div className="text-2xl font-bold mb-2">TS</div>
          <div className="text-sm">TrackySheets Admin</div>
        </div>
        <nav className="space-y-2">
          <a href="/admin/templates" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Templates</a>
          <a href="/admin/categories" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Categories</a>
          <a href="/admin/settings" className="block px-4 py-2 rounded bg-white bg-opacity-10 border-l-4 border-green-100">Settings</a>
          <a href="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Dashboard</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-green-900 mb-6">Site Settings</h1>

          {message && (
            <div className={`p-4 rounded mb-6 ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {messageType === 'success' ? '✅' : '❌'} {message}
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-8">
            <form className="space-y-6">
              {/* Site Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Site Name</label>
                <input
                  type="text"
                  name="site_name"
                  value={formData.site_name}
                  onChange={handleInputChange}
                  placeholder="TrackySheets"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* Site Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Site Description</label>
                <textarea
                  name="site_description"
                  value={formData.site_description}
                  onChange={handleInputChange}
                  placeholder="Brief description of your site"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* Homepage Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Homepage Description</label>
                <textarea
                  name="homepage_description"
                  value={formData.homepage_description}
                  onChange={handleInputChange}
                  placeholder="Description for homepage hero section"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* Admin Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Admin Email</label>
                <input
                  type="email"
                  name="admin_email"
                  value={formData.admin_email}
                  onChange={handleInputChange}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* Pinterest URL */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pinterest URL</label>
                <input
                  type="url"
                  name="pinterest_url"
                  value={formData.pinterest_url}
                  onChange={handleInputChange}
                  placeholder="https://pinterest.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* YouTube URL */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">YouTube URL</label>
                <input
                  type="url"
                  name="youtube_url"
                  value={formData.youtube_url}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  {saving ? '💾 Saving...' : '💾 Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
   );
}
