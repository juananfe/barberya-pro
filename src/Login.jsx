import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-barberDark flex items-center justify-center font-sans">
      <div className="bg-barberSurface p-8 rounded-2xl border border-barberBorder shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-barberGold flex items-center justify-center text-barberDark font-bold text-xl">B</div>
          <span className="font-serif font-bold text-2xl tracking-wider text-white">BARBER<span className="text-barberGold">YA</span> PRO</span>
        </div>
        
        <h2 className="text-white text-xl font-semibold mb-6 text-center">Acceso Administrador</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-barberGrayText text-sm mb-1">Correo electrónico</label>
            <input 
              type="email" 
              required
              className="w-full bg-[#1a1a1a] text-white border border-gray-600 rounded-xl p-3 focus:border-barberGold outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-barberGrayText text-sm mb-1">Contraseña</label>
            <input 
              type="password" 
              required
              className="w-full bg-[#1a1a1a] text-white border border-gray-600 rounded-xl p-3 focus:border-barberGold outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-barberGold text-barberDark font-bold py-3 rounded-xl hover:bg-yellow-500 transition-colors mt-4 disabled:opacity-50"
          >
            {loading ? 'Comprobando credenciales...' : 'Entrar al Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}