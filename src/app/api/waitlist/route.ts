import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { waitlistSchema } from '@/lib/validators'
import type { Database } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = waitlistSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { email, name } = parsed.data

    const { error } = await supabase.from('waitlist_signups').insert({
      email,
      name: name ?? null,
      source: 'landing_page',
    })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: "You're already on the waitlist!" }, { status: 409 })
      }
      throw error
    }

    const { data: countData } = await supabase.from('waitlist_count').select('total').single()
    const position = Number(countData?.total ?? 1)

    if (process.env.MAKE_WEBHOOK_URL) {
      fetch(process.env.MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, position }),
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, position })
  } catch (err) {
    console.error('Waitlist error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
