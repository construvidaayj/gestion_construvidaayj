import Swal from "sweetalert2";
import { useState, useMemo, useEffect } from 'react';
import MonthYearSelector from './monthYearSelector';
import Table from './table';
import Pagination from './pagination';
import ColumnSelector from './columnSelector';
import GlobalFilter from './globalFilter';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useClientsData } from '../customHooks/useClientDataTable';
import { DataClient, PaymentStatus } from '../types/dataClient';
import ModalForm from './modalForm';
import Loading from "./loading";

// === Helpers ===
const headers: (keyof DataClient)[] = [
  'clientId', 'affiliationId', 'fullName', 'identification', 'datePaidReceived', 'value',
  'eps', 'arl', 'risk', 'ccf', 'pensionFund', 'observation', 'paid'
];

const headerLabels: Record<keyof DataClient, string> = {
  clientId: 'ID Cliente',
  affiliationId: 'ID Afiliación',
  fullName: 'Nombre completo',
  identification: 'ID',
  datePaidReceived: 'Fecha recibido',
  value: 'Valor',
  eps: 'EPS',
  arl: 'ARL',
  risk: 'Riesgo',
  ccf: 'CCF',
  pensionFund: 'Fondo pensión',
  observation: 'Observación',
  paid: '¿Pagado?',
};

export default function ClientsTableWithPagination() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [selectedClient, setSelectedClient] = useState<DataClient | null>(null);

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const { data, isLoading, error, refetch } = useClientsData({
    month: selectedMonth + 1,
    year: selectedYear,
  });

  const [localData, setLocalData] = useState<DataClient[]>([]);
  const [filterText, setFilterText] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('all');
  const [visibleHeaders, setVisibleHeaders] = useState<(keyof DataClient)[]>(headers);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const columnOptions = useMemo(() => {
    return [{ key: 'all', label: 'Todas las columnas' }].concat(
      headers.map((key) => ({ key, label: headerLabels[key] }))
    );
  }, []);

  const filteredData = useMemo(() => {
    const lowerFilter = filterText.toLowerCase();
    return localData.filter((item) => {
      const globalMatch =
        filterText === '' ||
        (selectedColumn === 'all'
          ? visibleHeaders.some((key) =>
            String(item[key] ?? '').toLowerCase().includes(lowerFilter)
          )
          : String(item[selectedColumn as keyof DataClient] ?? '')
            .toLowerCase()
            .includes(lowerFilter));

      const columnMatch = Object.entries(columnFilters).every(([key, value]) => {
        if (!value) return true;
        return String(item[key as keyof DataClient] ?? '')
          .toLowerCase()
          .includes(value.toLowerCase());
      });

      return globalMatch && columnMatch;
    });
  }, [localData, filterText, selectedColumn, visibleHeaders, columnFilters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [currentPage, filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleEdit = (item: DataClient) => {
    setSelectedClient(item);
    openModal();
  };

  const handleDelete = async (item: DataClient) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar a ${item.fullName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Obtenemos el usuario desde localStorage y lo parseamos
          const userData = localStorage.getItem("user");
          let user = null;
          if (userData) {
            user = JSON.parse(userData);
          }

          if (!user || !user.id) {
            Swal.fire('Error!', 'No se encontró el ID de usuario en la sesión.', 'error');
            return;
          }

          // Llamada a la API para eliminar la afiliación (hace la petición DELETE al backend)
          const response = await fetch(`https://gestion-construvidaayj.onrender.com/api/affiliations`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              affiliationId: item.affiliationId,  // Asegúrate de tener estos valores en el item
              userId: user.id, // Usamos el id del usuario
            }),
          });

          const data = await response.json();

          if (response.ok) {
            // Confirmación de éxito
            Swal.fire(
              'Eliminado!',
              `${item.fullName} ha sido eliminado correctamente.`,
              'success'
            );
            // Eliminar el item de la lista localmente
            setLocalData((prevClients) =>
              prevClients.filter((client) => client.affiliationId !== item.affiliationId)
            );
          } else {
            Swal.fire(
              'Error!',
              data.message || 'Hubo un error al eliminar la afiliación.',
              'error'
            );
          }
        } catch (error) {
          console.error("Error en la eliminación:", error);
          Swal.fire(
            'Error!',
            'Hubo un problema con la conexión al servidor.',
            'error'
          );
        }
      }
    });
  };



  const handleMonthYearChange = (month: number, year: number) => {

    const isSameMonth = month === selectedMonth;
    const isSameYear = year === selectedYear;
  
    setSelectedMonth(month);
    setSelectedYear(year);
    setCurrentPage(1);
  
    // Si el mes y año son iguales, fuerza la recarga
    if (isSameMonth && isSameYear) {
      refetch();
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [columnFilters]);
  
  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <ColumnSelector
            visibleHeaders={visibleHeaders}
            setVisibleHeaders={setVisibleHeaders}
            headerLabels={headerLabels}
          />

          <GlobalFilter
            filterText={filterText}
            onFilterChange={(value) => {
              setFilterText(value);
              setCurrentPage(1);
            }}
            selectedColumn={selectedColumn}
            onColumnChange={(col) => {
              setSelectedColumn(col);
              setCurrentPage(1);
            }}
            columnOptions={columnOptions}
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <MonthYearSelector onChange={handleMonthYearChange} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>


        {isLoading && <Loading label="Cargando datos..."/>}

        {!isLoading && error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-xl mx-auto text-center mt-6">
            <strong className="font-bold">Error:</strong> No hay datos disponibles para esta fecha.
          </div>
        )}

        {!isLoading && !error && filteredData.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-xl mx-auto text-center mt-6">
            <strong className="font-bold">Sin resultados:</strong> No hay datos que coincidan con la búsqueda.
          </div>
        )}

        {!isLoading && !error && filteredData.length > 0 && (
          <>
            <Table<DataClient>
              headers={visibleHeaders}
              data={paginatedData}
              headerLabels={headerLabels}
              cellRenderers={{
                paid: (value, item) => (
                  <select
                    value={value}
                    onChange={async (e) => {
                      const newPaid: PaymentStatus = e.target.value as PaymentStatus;

                      setLocalData((prev) =>
                        prev.map((p) =>
                          p.affiliationId === item.affiliationId
                            ? { ...p, paid: newPaid }
                            : p
                        )
                      );

                      try {
                        const response = await fetch(`https://gestion-construvidaayj.onrender.com/api/affiliations/paid`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ affiliationId: item.affiliationId, paid: newPaid }),
                        });

                        if (!response.ok) {
                          throw new Error('Error al actualizar en el servidor');
                        }
                      } catch (error) {
                        console.error('Error actualizando estado de pago:', error);

                        setLocalData((prev) =>
                          prev.map((p) =>
                            p.affiliationId === item.affiliationId
                              ? { ...p, paid: item.paid }
                              : p
                          )
                        );

                        alert('Error al actualizar el estado de pago. Por favor, intenta nuevamente.');
                      }
                    }}
                    className={`rounded-full px-2 py-1 text-sm font-semibold
              ${value === 'Pagado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
              border-none focus:outline-none`}
                  >
                    <option value="Pagado">Pagado</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                ),
              }}
              rowActions={(item) => (
                <div className="flex gap-6">
                  <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700">
                    <FiEdit size={22} title="Editar"/>
                  </button>
                  <button onClick={() => handleDelete(item)} className="text-red-500 hover:text-red-700">
                    <FiTrash2 size={22} title="Eliminar"/>
                  </button>
                </div>
              )}
            />

            <div className="flex justify-end mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        )}

        <ModalForm isOpen={isModalOpen} onClose={closeModal} client={selectedClient} refetch={refetch} />
      </div>
    </>
  );
}
