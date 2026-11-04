import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({ version: 'v7', minRequired: 'v7', updated: '2025-11-04' }, {
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
  })
}
