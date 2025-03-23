import { pool } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Falta el ID de usuario' }, { status: 400 });
    }

    // 1. Obtener el office_id correspondiente al usuario
    const officeRes = await pool.query(
      'SELECT office_id FROM users WHERE id = $1',
      [userId]
    );

    if (officeRes.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const officeId = officeRes.rows[0].office_id;

    // 2. Hacer la consulta principal con el office_id
    const query = `
      SELECT c.id, c.full_name, c.identification, 
             ma.value, ma.risk, ma.observation, ma.paid, ma.date_paid_received,
             eps.name as eps, arl.name as arl, ccf.name as ccf, pf.name as pension_fund
      FROM clients c
      LEFT JOIN monthly_affiliations ma ON c.id = ma.client_id
      LEFT JOIN eps_list eps ON ma.eps_id = eps.id
      LEFT JOIN arl_list arl ON ma.arl_id = arl.id
      LEFT JOIN ccf_list ccf ON ma.ccf_id = ccf.id
      LEFT JOIN pension_fund_list pf ON ma.pension_fund_id = pf.id
      WHERE c.office_id = $1;
    `;

    const res = await pool.query(query, [officeId]);

    if (res.rows.length === 0) {
      return NextResponse.json({ message: 'No hay datos disponibles' }, { status: 404 });
    }

    return NextResponse.json(res.rows, { status: 200 });

  } catch (error) {
    console.error('Error en la consulta:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
