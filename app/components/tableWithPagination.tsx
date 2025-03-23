'use client';

import React, { useState, useMemo } from 'react';
import Table from '@/app/components/table';
import Pagination from '@/app/components/pagination';
import ColumnSelector from './columnSelector';
import GlobalFilter from './globalFilter';
import Navbar from './navbar';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import MonthYearSelector from './monthYearSelector';

export default function ClientsTableWithPagination({ data }: { data: DataClient[] }) {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [localData, setLocalData] = useState<DataClient[]>(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('all');
  const [visibleHeaders, setVisibleHeaders] = useState<(keyof DataClient)[]>(headers);

  const itemsPerPage = 10;

  const columnOptions = useMemo(() => {
    return [{ key: 'all', label: 'Todas las columnas' }].concat(
      headers.map((key) => ({
        key,
        label: headerLabels[key],
      }))
    );
  }, []);

  const filteredData = useMemo(() => {
    return localData.filter((item) => {
      const lowerFilter = filterText.toLowerCase();

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

      const monthMatch =
        (selectedMonth === null || (item.datePaidReceived && new Date(item.datePaidReceived).getMonth() === selectedMonth)) &&
        (selectedYear === null || (item.datePaidReceived && new Date(item.datePaidReceived).getFullYear() === selectedYear));

      return globalMatch && columnMatch && monthMatch;
    });
  }, [localData, filterText, selectedColumn, visibleHeaders, columnFilters, selectedMonth, selectedYear]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [currentPage, filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleEdit = (item: DataClient) => {
    console.log('Editar cliente:', item);
    alert('Editar cliente: ' + item.fullName);
  };

  const handleDelete = (item: DataClient) => {
    console.log('Eliminar cliente:', item);
    alert('Eliminar cliente: ' + item.fullName);
  };

  const handleMonthYearChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />
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

        <Table<DataClient>
          headers={visibleHeaders}
          data={paginatedData}
          headerLabels={headerLabels}
          cellRenderers={{
            paid: (value, item) => (
              <select
                value={value === 'Pagado' ? 'Pagado' : 'Pendiente'}
                onChange={(e) => {
                  const newPaid = e.target.value as 'Pagado' | 'Pendiente';
                  setLocalData((prev) =>
                    prev.map((p) =>
                      p.identification === item.identification ? { ...p, paid: newPaid } : p
                    )
                  );
                  console.log(`Nuevo estado para ${item.fullName}: ${newPaid}`);
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
              <button onClick={() => handleEdit(item)} title="Editar">
                <FiEdit className="text-green-600 hover:text-blue-800" size={22} />
              </button>
              <button onClick={() => handleDelete(item)} title="Eliminar">
                <FiTrash2 className="text-red-600 hover:text-red-800" size={22} />
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
      </div>
    </>
  );
}

// === Helpers ===

const headers: (keyof DataClient)[] = [
  'fullName',
  'identification',
  'datePaidReceived',
  'value',
  'eps',
  'arl',
  'risk',
  'ccf',
  'pensionFund',
  'observation',
  'paid',
];

const headerLabels: Record<keyof DataClient, string> = {
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

// === Type ===

export type DataClient = {
  fullName: string;
  identification: string;
  value: string | null;
  eps: string | null;
  arl: string | null;
  risk: string | null;
  ccf: string | null;
  pensionFund: string | null;
  observation: string | null;
  paid: 'Pendiente' | 'Pagado';
  datePaidReceived: string | null;
};
