import { pool } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { affiliationId: string } }) {
  const { affiliationId } = params;  // Asegúrate de usar await para params

  if (!affiliationId) {
    return new Response(JSON.stringify({ message: 'ID de afiliación no proporcionado' }), {
      status: 400,
    });
  }

  const body = await req.json();
  const { paid } = body;

  if (
    typeof paid !== 'string' ||
    !['Pendiente', 'Pagado'].includes(paid)
  ) {
    return new Response(JSON.stringify({ message: 'Estado de pago inválido' }), {
      status: 400,
    });
  }

  try {
    const datePaidReceived = paid === 'Pagado' ? new Date().toISOString().split('T')[0] : null;

    // Aquí cambiamos el nombre de la columna de "affiliation_id" a "id"
    const query = `
      UPDATE monthly_affiliations
      SET 
        paid = $1,
        date_paid_received = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        id = $3  -- Usamos "id" en lugar de "affiliation_id"
    `;

    const values = [paid, datePaidReceived, affiliationId];

    await pool.query(query, values);

    return new NextResponse(JSON.stringify({ message: 'Estado de pago actualizado correctamente' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error al actualizar estado de pago:', error);
    return new NextResponse(JSON.stringify({ message: 'Error del servidor' }), {
      status: 500,
    });
  }
}



