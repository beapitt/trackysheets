import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin');
    } catch (error: any) {
      alert('Login error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] font-sans">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
           <div className="inline-block bg-[#14532d] text-white px-3 py-1 rounded font-bold text-2xl mb-2 shadow-sm">TS</div>
           <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Admin Access</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded outline-none focus:border-[#1a8856]" required />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded outline-none focus:border-[#1a8856]" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#14532d] text-white font-bold py-3 rounded hover:bg-[#1a8856] transition uppercase text-xs tracking-widest border-none cursor-pointer mt-4">
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
