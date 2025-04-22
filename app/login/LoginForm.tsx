'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaUser, FaLock } from 'react-icons/fa'

export default function LoginForm() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('') // Limpiar errores anteriores

    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        throw new Error('Usuario y/o contraseña invalidos.')
      }

      const data = await res.json()
      console.log("DATA ININCAL NO JOOODA::", data);
      // Guardar todo el objeto `data` en localStorage como un JSON
      localStorage.setItem('user', JSON.stringify(data))  // Guardar todo el objeto

      // Redirigir al dashboard de clientes
      router.push('/select_office')

    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    }
  }

  return (
    <div className="p-10 flex flex-col justify-center text-center">
      <h2 className="text-2xl font-semibold text-emerald-600 mb-2">Bienvenido a</h2>

      <div className='flex justify-center mb-4'>
        <Image
          src="/logo10.png"
          alt="Logo"
          width={300}
          height={50}
        />
      </div>

      <p className="text-gray-500 mb-6">
        Inicie sesión para recibir actualizaciones sobre las cosas que le interesan.
      </p>

      <div className="space-y-4">
        <div className="relative">
          <FaUser className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-gray-400" />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full py-2 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 text-white font-semibold shadow-md hover:from-emerald-500 hover:to-sky-500 transition"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  )
}
