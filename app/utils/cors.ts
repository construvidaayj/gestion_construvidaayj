// app/utils/cors.ts
import { NextResponse } from 'next/server';

export function withCORS(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Permitir cualquier origen
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

export default function handleOPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', // Corregido aquí (sin el carácter extra ':')
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
