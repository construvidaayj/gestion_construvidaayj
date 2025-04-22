// lib/db.ts
import { Pool } from 'pg';

// Evita múltiples instancias en desarrollo
declare global {
  var pgPool: Pool | undefined;
}

const pool = global.pgPool ?? new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db6',
  password: 'Wiliam021289',
  port: 5432,
});

if (process.env.NODE_ENV !== 'production') global.pgPool = pool;

export { pool };


