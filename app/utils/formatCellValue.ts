export default function formatCellValue(value: unknown, locale: string = 'es-CO') {
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (value === null || value === undefined) return "-";
  if (typeof value === "number") return value.toLocaleString(locale, { style: 'currency', currency: 'COP' });
  return String(value);
}