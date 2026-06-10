'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { waitlistSchema } from '@/lib/validators'
import { CheckCircle, Loader2 } from 'lucide-react'

interface WaitlistFormProps {
  compact?: boolean
}

export default function WaitlistForm({ compact = false }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [position, setPosition] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = waitlistSchema.safeParse({ email, name: name || undefined })
    if (!parsed.success) {
      setStatus('error')
      setMessage(parsed.error.issues[0].message)
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      } else {
        setStatus('success')
        setPosition(data.position)
        setMessage(`You're #${data.position} on the waitlist!`)
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <CheckCircle className="w-12 h-12 text-green-400" />
        <p className="text-xl font-semibold text-white">You&apos;re on the list!</p>
        {position && (
          <p className="text-white/60 text-center">
            You&apos;re <span className="text-purple-400 font-bold">#{position}</span> — we&apos;ll reach out when your access is ready.
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-3 w-full ${compact ? 'max-w-md' : 'max-w-lg'}`}>
      {!compact && (
        <Input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <div className={compact ? 'flex gap-2' : ''}>
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={compact ? 'flex-1' : ''}
        />
        {compact && (
          <Button type="submit" disabled={status === 'loading'} className="whitespace-nowrap">
            {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join'}
          </Button>
        )}
      </div>
      {!compact && (
        <Button type="submit" size="lg" disabled={status === 'loading'} className="w-full">
          {status === 'loading' ? (
            <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Joining...</>
          ) : (
            'Get Early Access →'
          )}
        </Button>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-sm text-center">{message}</p>
      )}
    </form>
  )
}
