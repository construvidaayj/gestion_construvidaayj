// Archivo: /app/api/password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const password = 'angelica2025';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return NextResponse.json({ hash: hashedPassword }, { status: 200 });
  } catch (error) {
    console.error('Error al generar hash:', error);
    return NextResponse.json({ message: 'Error al generar hash' }, { status: 500 });
  }
}
