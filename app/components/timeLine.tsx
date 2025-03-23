"use client";
import React from "react";

interface TimelineItem {
  year: string;
  description: string;
  emoji: string;
  category: "political" | "labor" | "international" | "health";
}

const timelineData: TimelineItem[] = [
  {
    year: "Comunidad primitiva",
    description: "Producción para el autoconsumo. Trabajo colectivo. Sin propiedad privada ni clases sociales.",
    emoji: "🔥",
    category: "labor",
  },
  {
    year: "Antigüedad (Esclavismo)",
    description: "Producción agrícola, minería y construcción. Trabajo forzado de esclavos. Sociedad dividida entre dueños y esclavos.",
    emoji: "🏺",
    category: "labor",
  },
  {
    year: "Edad Media (Feudalismo)",
    description: "Producción agrícola en feudos. Siervos trabajaban la tierra para señores feudales. No eran esclavos, pero estaban sometidos.",
    emoji: "🛡️",
    category: "labor",
  },
  {
    year: "Edad Moderna (Capitalismo comercial)",
    description: "Surgimiento de la burguesía. Comercio a gran escala. Talleres artesanales y primeros salarios.",
    emoji: "🏦",
    category: "labor",
  },
  {
    year: "Siglo XVIII-XIX (Capitalismo industrial)",
    description: "Producción en fábricas. Explotación laboral (niños, jornadas extensas). Nace la clase obrera.",
    emoji: "🏭",
    category: "labor",
  },
  {
    year: "Siglo XX (Capitalismo financiero)",
    description: "Grandes empresas, bancos e inversiones. Derechos laborales y sindicalismo. Protección social en algunos países.",
    emoji: "💰",
    category: "international",
  },
  {
    year: "Siglo XXI (Economía digital)",
    description: "Automatización, plataformas, trabajo remoto. Empleo flexible, pero también precario. Nuevos retos para la dignidad laboral.",
    emoji: "💻",
    category: "health",
  },
];

const categoryColor = {
  political: "bg-yellow-500",
  labor: "bg-blue-500",
  international: "bg-green-500",
  health: "bg-purple-500",
};

export default function Timeline() {
  return (
    <div className="overflow-x-auto py-48 ml-12 pl-14">
      <div className="relative flex min-w-[1000px] gap-12 justify-start">
        {/* Línea central */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300 -z-10" />

        {timelineData.map((item, index) => {
          const isTop = index % 2 === 0;

          return (
            <div key={index} className="relative flex flex-col items-center w-18">
              {/* Línea vertical */}
              <div className={`w-0.5 h-12 bg-gray-300 ${isTop ? "mb-2" : "mt-2"}`} />

              {/* Punto central */}
              <div
                className={`w-5 h-5 rounded-full ${categoryColor[item.category]} shadow-md transition-transform hover:scale-125`}
              ></div>

              {/* Evento (icono, año, texto) */}
              <div
                className={`absolute ${isTop ? "top-[-130px]" : "bottom-[-130px]"} text-center w-52 px-2`}
              >
                <div className="text-3xl">{item.emoji}</div>
                <div className="text-sm font-bold text-gray-800">{item.year}</div>
                <div className="text-xs text-gray-600 mt-1">{item.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
