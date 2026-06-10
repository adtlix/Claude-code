import { z } from 'zod'

export const waitlistSchema = z.object({
  email: z.string().email('Bitte eine gültige E-Mail-Adresse eingeben'),
  name: z.string().min(1).max(100).optional(),
})

export type WaitlistInput = z.infer<typeof waitlistSchema>
