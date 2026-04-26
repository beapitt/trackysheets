import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Tentativo di login diretto tramite Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Se il login ha successo, vai alla dashboard admin
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#14532d] font-sans px-4">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md border-t-8 border-[#1a8856]">
        <div className="text-center mb-8">
          <div className="bg-[#14532d] text-white w-12 h-12 flex items-center justify-center rounded font-bold text-xl mx-auto mb-4 border border-white/20">
            TS
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Access</h1>
          <p className="text-gray-500 text-sm mt-2">TrackySheets Management</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded focus:border-[#1a8856] outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded focus:border-[#1a8856] outline-none transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#1a8856] hover:bg-[#14532d] text-white font-bold py-3 rounded shadow-md transition-all uppercase tracking-widest text-xs"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
