// app/login/page.tsx

import LoginForm from "./LoginForm";
import LoginImage from "./LoginImage";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 fade-in">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 mx-2">
      <LoginImage />
      <LoginForm />
      </div>
    </div>
  )
}
