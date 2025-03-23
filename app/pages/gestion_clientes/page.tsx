"use client";

import { useEffect, useState } from 'react';
import ClientsTableWithPagination from '@/app/components/tableWithPagination';
import { DataClient } from '@/app/types/dataClient';

export default function ClientManagement() {
  const [data, setData] = useState<DataClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        setError('No se encontró el ID del usuario.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/affiliations', {
          headers: {
            'x-user-id': userId,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const rawData = await res.json();

        const formatted: DataClient[] = rawData.map((item: any) => ({
          fullName: item.full_name || '',
          identification: item.identification || '',
          value: item.value || 0,
          eps: item.eps || '',
          arl: item.arl || '',
          risk: item.risk || '',
          ccf: item.ccf || '',
          pensionFund: item.pension_fund || '',
          paid: item.paid || false,
          observation: item.observation || '',
          datePaidReceived: item.date_paid_received || '',
        }));

        setData(formatted);
      } catch (err) {
        console.error('Error al obtener los datos:', err);
        setError('No se pudo cargar la información.');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (data.length === 0) return <p>No hay datos disponibles.</p>;

  return <ClientsTableWithPagination data={data} />;
}
