// export default function formatCellValue(
//   value: unknown,
//   locale: string = "es-CO"
// ): string {

//   console.log("estamos formateando los valores no joooooda");
//   if (value === null || value === undefined) return "-";
//   if (typeof value === "boolean") return value ? "Sí" : "No";

//   const isNumeric =
//     typeof value === "number" ||
//     (typeof value === "string" && !isNaN(Number(value.trim())));

//   if (isNumeric) {
//     const numberValue = typeof value === "number" ? value : Number(value);
//     // Formatear con espacio después del símbolo $
//     const formatted = numberValue.toLocaleString(locale, {
//       style: "currency",
//       currency: "COP",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     });

//     // Asegurar que tenga espacio después del símbolo $
//     return formatted.replace("$", "$ ");
//   }

//   return String(value);
// }
