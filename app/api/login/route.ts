
import { pool } from '@/app/lib/db';
import { generateToken } from '@/app/lib/auth/jwt';

import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validación básica
    if (!username || !password) {
      return NextResponse.json({ message: 'Faltan campos' }, { status: 400 });
    }

    // Buscar al usuario por username
    const result = await pool.query(
      'SELECT id, username, password_hash, role, office_id FROM users WHERE username = $1',
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 401 });
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Contraseña incorrecta' }, { status: 401 });
    }

    // Crear el token JWT
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    // Puedes incluir más info si lo necesitas (evitando el hash)
    const userData = {
      id: user.id,
      username: user.username,
      role: user.role,
      office_id: user.office_id,
      token,
    };

    return NextResponse.json(userData, { status: 200 });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
