import { pool } from '@/app/lib/db';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const [epsResult, arlResult, ccfResult, pensionFundResult] = await Promise.all([
      pool.query('SELECT id, name FROM eps_list ORDER BY name ASC'),
      pool.query('SELECT id, name FROM arl_list ORDER BY name ASC'),
      pool.query('SELECT id, name FROM ccf_list ORDER BY name ASC'),
      pool.query('SELECT id, name FROM pension_fund_list ORDER BY name ASC'),
    ]);

    return NextResponse.json({
      eps: epsResult.rows,
      arl: arlResult.rows,
      ccf: ccfResult.rows,
      pensionFunds: pensionFundResult.rows,
    });
  } catch (error) {
    console.error('Error fetching lists:', error);
    return NextResponse.json({ message: 'Error fetching lists' }, { status: 500 });
  }
}
