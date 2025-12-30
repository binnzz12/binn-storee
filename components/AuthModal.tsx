import React, { useState } from 'react';

interface AuthModalProps {
  onLogin: (username: string, password?: string) => void;
  onRegister: (username: string, password?: string) => void;
  isOpen: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLogin, onRegister, isOpen }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return alert('Isi username dan password');
    
    if (isRegistering) {
      onRegister(username, password);
    } else {
      onLogin(username, password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-dark-800 w-full max-w-sm p-8 rounded-2xl border border-gray-700 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isRegistering ? 'Buat Akun Baru' : 'Login Member'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username / Email</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Masukan username"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-black font-bold py-3 rounded-lg transition-colors">
            {isRegistering ? 'Daftar Sekarang' : 'Masuk'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {isRegistering ? 'Sudah punya akun?' : 'Belum punya akun?'}
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="ml-2 text-brand-500 hover:underline"
          >
            {isRegistering ? 'Login' : 'Daftar'}
          </button>
        </p>
      </div>
    </div>
  );
};