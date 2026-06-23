import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ✅ Set this to 'true' to enable maintenance mode
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true' || false;

export async function GET() {
  return NextResponse.json({
    isMaintenance: MAINTENANCE_MODE,
    message: MAINTENANCE_MODE ? 'BAPTISTRY is currently under maintenance.' : 'All systems operational.',
    version: '1.3.0',
  });
}