import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const { data, error } = await supabase.from('waitlist_count').select('*').single()
  if (error) return NextResponse.json({ count: 0 })
  const row = data as { total: number | null } | null
  return NextResponse.json(
    { count: Number(row?.total ?? 0) },
    { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate' } }
  )
}
