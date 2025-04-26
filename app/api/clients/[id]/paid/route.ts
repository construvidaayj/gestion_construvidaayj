
// import { pool } from '@/app/lib/db';
// import type { NextApiRequest, NextApiResponse } from 'next';

// type Data = { message: string };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   if (req.method !== 'PATCH') {
//     return res.status(405).json({ message: 'Método no permitido' });
//   }

//   const affiliationId = Number(req.query.affiliationId);
//   const { paid } = req.body;

//   if (
//     !affiliationId ||
//     typeof paid !== 'string' ||
//     !['Pendiente', 'Pagado'].includes(paid)
//   ) {
//     return res.status(400).json({ message: 'Datos inválidos o incompletos' });
//   }

//   try {
//     const datePaidReceived =
//       paid === 'Pagado' ? new Date().toISOString().split('T')[0] : null;

//     const query = `
//       UPDATE monthly_affiliations
//       SET 
//         paid = $1,
//         date_paid_received = $2,
//         updated_at = CURRENT_TIMESTAMP
//       WHERE 
//         affiliation_id = $3
//     `;

//     const values = [paid, datePaidReceived, affiliationId];

//     await pool.query(query, values);

//     return res
//       .status(200)
//       .json({ message: 'Estado de pago actualizado correctamente' });
//   } catch (error) {
//     console.error('Error al actualizar estado de pago:', error);
//     return res.status(500).json({ message: 'Error del servidor' });
//   }
// }
