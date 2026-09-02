import { createHmac, timingSafeEqual } from 'node:crypto'
import { env } from '../config/env.js'
import type { UserRecord, UserRole } from '../models/types.js'

export type AuthToken = {
  userId: string
  role: UserRole
  exp: number
}

function sign(payload: string) {
  return createHmac('sha256', env.jwtSecret).update(payload).digest('base64url')
}

export function signAuthToken(user: UserRecord) {
  const payload: AuthToken = {
    userId: user.id,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${encoded}.${sign(encoded)}`
}

export function verifyAuthToken(token: string): AuthToken | null {
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null
  const expected = sign(encoded)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as AuthToken
    if (!payload.userId || (payload.role !== 'citizen' && payload.role !== 'admin')) return null
    if (payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}
