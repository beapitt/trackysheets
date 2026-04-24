import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Template {
  id: string;
  title: string;
  category: string;
  created_at: string;
  status: string;
}

export default function AdminTemplates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('id, title, category, created_at, status')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      setMessage('Error loading templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTemplates(templates.filter(t => t.id !== id));
      setMessage('Template deleted successfully');
    } catch (err) {
      setMessage('Error deleting template');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-48 bg-green-900 text-white p-6">
        <div className="mb-8">
          <div className="text-2xl font-bold mb-2">TS</div>
          <div className="text-sm">TrackySheets Admin</div>
        </div>
        <nav className="space-y-2">
          <a href="/admin/templates" className="block px-4 py-2 rounded bg-white bg-opacity-10 border-l-4 border-green-100">Templates</a>
          <a href="/admin/categories" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Categories</a>
          <a href="/admin/settings" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Settings</a>
          <a href="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-white hover:bg-opacity-5">Dashboard</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-900">Manage Templates</h1>
          <button
            onClick={() => navigate('/admin/templates/new')}
            className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            ➕ Add New Template
          </button>
        </div>

        {message && (
          <div className="p-4 rounded mb-6 bg-green-100 text-green-700">
            ✅ {message}
          </div>
        )}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-green-900 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template, idx) => (
                  <tr key={template.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-3 text-sm">{template.title}</td>
                    <td className="px-6 py-3 text-sm">{template.category}</td>
                    <td className="px-6 py-3 text-sm">{new Date(template.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${template.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {template.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/templates/${template.id}/edit`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
