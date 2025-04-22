import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { pool } from '@/app/lib/db';
import { generateToken } from '@/app/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Faltan campos' }, { status: 400 });
    }

    const result = await pool.query(
      'SELECT id, username, password_hash, role, office_id FROM users WHERE username = $1',
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Contraseña incorrecta' }, { status: 401 });
    }

    // === Crear afiliaciones automáticamente si no existen para este mes ===
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    console.log("========== INICIO LOGIN ==========");
    console.log(`Mes actual: ${currentMonth}, Año actual: ${currentYear}`);
    console.log("Usuario autenticado:", {
      id: user.id,
      username: user.username,
      office_id: user.office_id,
      role: user.role,
    });

    // Buscar si ya hay afiliaciones para el mes actual
    const existingForCurrentMonth = await pool.query(
      `SELECT COUNT(*) FROM monthly_affiliations 
       WHERE month = $1 AND year = $2 
       AND client_id IN (
         SELECT id FROM clients WHERE office_id = $3
       )`,
      [currentMonth, currentYear, user.office_id]
    );

    const countCurrentMonth = parseInt(existingForCurrentMonth.rows[0].count);
    console.log(`Afiliaciones encontradas para el mes actual ${currentMonth}/${currentYear}: ${countCurrentMonth}`);

    if (countCurrentMonth === 0) {
      // Buscar datos desde el mes anterior hacia atrás
      let previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      let previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      let foundPreviousData = false;

      console.log("Buscando meses anteriores con afiliaciones para copiar...");

      while (!foundPreviousData && previousYear >= currentYear - 1) {
        const previousData = await pool.query(
          `SELECT COUNT(*) FROM monthly_affiliations 
           WHERE month = $1 AND year = $2 
           AND client_id IN (
             SELECT id FROM clients WHERE office_id = $3
           )`,
          [previousMonth, previousYear, user.office_id]
        );

        const previousCount = parseInt(previousData.rows[0].count);
        console.log(`Afiliaciones en ${previousMonth}/${previousYear}: ${previousCount}`);

        if (previousCount > 0) {
          foundPreviousData = true;

          const insertResult = await pool.query(`
            INSERT INTO monthly_affiliations (client_id, month, year, value, eps_id, arl_id, ccf_id, pension_fund_id, risk, observation, paid)
            SELECT client_id, $1, $2, value, eps_id, arl_id, ccf_id, pension_fund_id, risk, observation, 'Pendiente'
            FROM monthly_affiliations
            WHERE month = $3 AND year = $4
            AND client_id IN (SELECT id FROM clients WHERE office_id = $5)
            ON CONFLICT (client_id, month, year) DO NOTHING;
          `, [currentMonth, currentYear, previousMonth, previousYear, user.office_id]);

          console.log(`Se copiaron ${insertResult.rowCount} afiliaciones de ${previousMonth}/${previousYear} a ${currentMonth}/${currentYear} para oficina ${user.office_id}`);
        } else {
          previousMonth -= 1;
          if (previousMonth === 0) {
            previousMonth = 12;
            previousYear -= 1;
          }
        }
      }

      if (!foundPreviousData) {
        console.log('No se encontraron datos anteriores para copiar afiliaciones.');
      }
    } else {
      console.log(`Ya existen afiliaciones para ${currentMonth}/${currentYear}. No se realiza copia.`);
    }

    // === Generar token JWT ===
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    const userData = {
      id: user.id,
      username: user.username,
      role: user.role,
      office_id: user.office_id,
      token,
    };

    console.log("Usuario logueado con éxito:", userData);
    console.log("========== FIN LOGIN ==========");

    return NextResponse.json(userData, { status: 200 });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
