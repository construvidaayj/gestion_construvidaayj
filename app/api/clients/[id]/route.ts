import { pool } from '@/app/lib/db';
import { NextResponse } from 'next/server';


// Actualización completa (PUT)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { full_name, identification, office_id } = body;

    if (!full_name || !identification || !office_id) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE clients
       SET full_name = $1,
           identification = $2,
           office_id = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, full_name, identification, office_id, updated_at`,
      [full_name, identification, office_id, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ client: result.rows[0] });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// Actualización parcial (PATCH)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(body)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No se enviaron campos para actualizar' }, { status: 400 });
    }

    values.push(id); // último valor es el ID
    const result = await pool.query(
      `UPDATE clients
       SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${index}
       RETURNING id, full_name, identification, office_id, updated_at`,
      values
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ client: result.rows[0] });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
