"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";

// Tipo de dato
type DataClients = {
  fullName: string;
  identification: string;
  datePaidReceived: string;
  value: string;
  eps: string;
  datePaidEps: string;
  arl: string;
  datePaidArl: string;
  risk: string;
  ccf: string;
  pensionFund: string;
  datePaidCcf: string;
  datePaidPensionFund: string;
  observation: string;
  paid: string;
};

// Ejemplo de datos
const data: DataClients[] = [
  {
    fullName: "Carlos Martínez",
    identification: "123456789",
    datePaidReceived: "2024-03-10",
    value: "1200000",
    eps: "Sura",
    datePaidEps: "2024-03-08",
    arl: "Colpatria",
    datePaidArl: "2024-03-07",
    risk: "II",
    ccf: "Comfama",
    pensionFund: "Porvenir",
    datePaidCcf: "2024-03-09",
    datePaidPensionFund: "2024-03-08",
    observation: "Pagado a tiempo",
    paid: "Sí",
  },
  {
    fullName: "María Gómez",
    identification: "987654321",
    datePaidReceived: "2024-03-11",
    value: "1350000",
    eps: "Nueva EPS",
    datePaidEps: "2024-03-09",
    arl: "Bolívar",
    datePaidArl: "2024-03-08",
    risk: "III",
    ccf: "Comfandi",
    pensionFund: "Protección",
    datePaidCcf: "2024-03-10",
    datePaidPensionFund: "2024-03-09",
    observation: "Pendiente validación",
    paid: "No",
  },
];

const columns: ColumnDef<DataClients>[] = [
  { accessorKey: "fullName", header: "Nombre Completo" },
  { accessorKey: "identification", header: "Cédula" },
  { accessorKey: "value", header: "Valor", cell: info => `$${info.getValue()}` },
  { accessorKey: "paid", header: "¿Pagado?" },
  { accessorKey: "eps", header: "EPS" },
  { accessorKey: "datePaidEps", header: "Fecha EPS" },
  { accessorKey: "arl", header: "ARL" },
  { accessorKey: "datePaidArl", header: "Fecha ARL" },
  { accessorKey: "risk", header: "Riesgo" },
  { accessorKey: "ccf", header: "Caja Comp." },
  { accessorKey: "pensionFund", header: "Fondo Pensión" },
  { accessorKey: "datePaidCcf", header: "Fecha CCF" },
  { accessorKey: "datePaidPensionFund", header: "Fecha Pensión" },
  { accessorKey: "datePaidReceived", header: "Fecha de Recepción" },
  { accessorKey: "observation", header: "Observación" },
];

export default function ClientsTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [showDropdown, setShowDropdown] = useState(false);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 🔍 Filtro global y menú de columnas */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-xs focus:outline-none focus:ring focus:border-blue-300"
        />

        <div className="relative ml-4">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-3 py-2 border rounded bg-white shadow-sm hover:bg-gray-50"
          >
            Columnas
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 max-h-60 overflow-y-auto w-60 bg-white border rounded shadow z-10">
              {table.getAllLeafColumns().map((column) => (
                <label
                  key={column.id}
                  className="flex items-center px-3 py-2 text-sm hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    className="mr-2 accent-purple-500"
                  />
                  {column.columnDef.header as string}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🧾 Tabla */}
      <div className="overflow-x-auto rounded border shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left font-medium"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📄 Paginación */}
      <div className="flex items-center justify-between mt-4 text-sm">
        <span>
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
