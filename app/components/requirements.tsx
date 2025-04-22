'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RequireOffice({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('user')
    const selectedOffice = localStorage.getItem('selectedOffice')

    if (!user) {
      router.push('/login') // redirige al login si no hay sesión
      return
    }

    if (!selectedOffice) {
      router.push('/select_office') // redirige si no hay oficina seleccionada
      return
    }

    setChecking(false)
  }, [router])

  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="text-gray-600">Verificando acceso...</span>
      </div>
    )
  }

  return <>{children}</>
}
