'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FaBars, FaTimes } from 'react-icons/fa'
import Image from 'next/image'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const handleLogout = () => {
    // Borrar solo los datos relacionados con la sesión del usuario
    localStorage.removeItem('user')
    localStorage.removeItem('selectedOffice')
    
  
    // Imprimir lo que queda en localStorage
    console.log('Contenido restante en localStorage:')
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      const value = localStorage.getItem(key!)
      console.log(`${key}: ${value}`)
    }
  
    closeMenu()
    router.push('/login')
  }
  

  const isActive = (path: string) =>
    pathname === path
      ? 'text-emerald-600 font-semibold'
      : 'hover:text-emerald-600 transition-colors'

  return (
    <nav className="bg-white text-gray-800 font-sans p-4 flex items-center justify-between relative shadow-md">
      <div className="flex w-full items-center justify-between mx-6 md:mx-20">
        {/* Logo clicable */}
        <div className="text-2xl font-bold tracking-wide">
          <Link href="/" className="hover:text-emerald-600 transition-colors">CONTRUVIDA AYJ</Link>
        </div>

        {/* Menú horizontal en pantallas grandes */}
        <ul className="hidden md:flex space-x-6 text-lg items-center">
          <li><Link href="/" className={isActive('/')}>Inicio</Link></li>
          <li><Link href="/seccion1" className={isActive('/seccion1')}>Sección 1</Link></li>
          <li><Link href="/seccion2" className={isActive('/seccion2')}>Sección 2</Link></li>
          <li>
            <button
              onClick={handleLogout}
              className="bg-emerald-600 text-white px-4 py-1.5 rounded hover:bg-emerald-700 transition"
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>

      {/* Botón hamburguesa en móvil */}
      <button
        onClick={toggleMenu}
        className="md:hidden text-2xl focus:outline-none z-50"
        aria-label="Abrir menú"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Fondo oscuro con transición */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-30 ${isOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={closeMenu}
      />

      {/* Menú móvil deslizante */}
      <div
        id="mobile-menu"
        className={`fixed top-0 left-0 h-full w-64 bg-white text-gray-800 p-6 transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo dentro del menú */}
        <div className="text-center mb-8">
          <Image src="/logo10.png" alt="Logo" width={140} className="mx-auto" />
        </div>

        {/* Lista de enlaces */}
        <ul className="flex flex-col space-y-5 text-lg font-medium">
          <li><Link href="/" onClick={closeMenu} className={isActive('/')}>Inicio</Link></li>
          <li><Link href="/seccion1" onClick={closeMenu} className={isActive('/seccion1')}>Sección 1</Link></li>
          <li><Link href="/seccion2" onClick={closeMenu} className={isActive('/seccion2')}>Sección 2</Link></li>
          <li>
            <button
              onClick={handleLogout}
              className="bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition"
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
