"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Image from 'next/image';

interface Office {
  office_id: string;
  name: string;
  representative_name: string;
  logo_url: string;
}

export default function SelectOffice() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user || !user.offices || user.offices.length === 0) {
      setError('No tienes oficinas asociadas.');
      return;
    }

    setOffices(user.offices);
  }, []);

  const handleSelectOffice = async (officeId: string) => {
    localStorage.setItem('selectedOffice', officeId);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const clientId = user.id;

    // Mostrar loader con SweetAlert2
    Swal.fire({
      title: 'Cargando...',
      text: 'Verificando afiliación',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch('https://gestion-construvidaayj.onrender.com/api/monthly_affiliations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ office_id: officeId, client_id: clientId }),
      });

      const data = await response.json();

      Swal.close(); // Cerrar loader

      if (response.ok) {
        router.push(`/customer_management`);
      } else {
        Swal.fire('Error', data.message || 'Ocurrió un error al verificar la afiliación.', 'error');
      }
    } catch (error) {
      Swal.close();
      Swal.fire('Error', 'Error en la solicitud de afiliación.', 'error');
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold text-center mb-6">Selecciona una Oficina</h1>
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {offices.map((office) => (
          <div
            key={office.office_id}
            className="flex flex-col items-center p-6 border rounded-lg shadow-md hover:shadow-lg cursor-pointer"
            onClick={() => handleSelectOffice(office.office_id)}
          >
            <Image
              src={office.logo_url}
              alt={office.name}
              className="w-24 h-24 object-contain mb-4"
            />
            <h3 className="text-lg font-medium">{office.name}</h3>
            <p className="text-sm text-gray-500">Representante: {office.representative_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
