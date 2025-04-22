// app/login/layout.tsx
import type { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex items-center justify-center bg-gray-100">
        {children}
      </body>
    </html>
  );
}
