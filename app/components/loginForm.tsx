'use client';

import { useState } from 'react';
import { FiUser, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const headerColor = 'bg-[#ff3366]'; // puedes cambiar este color
  const logoUrl = '/logo2.png'; // cambia por tu logo real

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50">

      {/* Header con logo */}
      <div className={`w-full ${headerColor} py-8 flex flex-col items-center justify-center relative mb-2`}>
        <Image src={logoUrl} alt="Logo" className="w-60 object-contain" />
        
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm mt-[-40px] bg-white rounded-2xl shadow-lg p-10 z-10"
      >
        <h2 className="text-xl font-semibold text-center mb-6">Iniciar Sesión</h2>

        {/* Formulario */}
        <form className="space-y-8 py-4">
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* Remember me */}
         

          {/* Botón principal */}
          <button
            type="submit"
            className="w-full py-3 mt-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full flex items-center justify-center gap-2 transition"
          >
            Login <span className="text-xl">➡️</span>
          </button>
        </form>


        
      </motion.div>

      <p className="mt-4 text-xs text-gray-400">powered by <strong>ElBosque</strong></p>
    </div>
  );
}
