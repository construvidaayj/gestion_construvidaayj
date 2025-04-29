// /app/(dashboard)/layout.tsx
"use cliente";
import { ReactNode } from 'react';
import Navbar from '../components/navbar';
  // Asegúrate de que la ruta sea correcta
 // Asegúrate de que la ruta sea correcta

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Barra de navegación */}
      <Navbar />

      {/* Contenido específico de la página */}
      <main className="flex-1">
        {children}
      </main>

      {/* Pie de página */}
      
    </div>
  );
}
