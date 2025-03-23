// app/login/LoginImage.tsx
import Image from 'next/image'

export default function LoginImage() {
  return (
    <div className="relative hidden md:block">
      <Image
        src="/fondo3.jpg" // asegúrate de colocar esta imagen en `public/`
        alt="Login Background"
        layout="fill"
        objectFit="cover"
        className="brightness-75"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-10 backdrop-brightness-50 text-white">
        <h1 className="text-4xl font-bold ">Construvida AYJ</h1>
        <p className="text-center mt-4">
          En Construvida AYJ nos especializamos en brindarte asesoría y acompañamiento en el proceso de afiliación al sistema de seguridad social en Colombia, incluyendo salud, pensión, ARL y caja de compensación.
        </p>
      </div>
    </div>
  )
}
