import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const derived = (await scryptAsync(password, salt, 64)) as Buffer
  return `${salt}:${derived.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const derived = (await scryptAsync(password, salt, 64)) as Buffer
  const storedBuf = Buffer.from(hash, 'hex')
  if (storedBuf.length !== derived.length) return false
  return timingSafeEqual(storedBuf, derived)
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export function daysUnresolved(createdAt: string, resolvedAt: string | null, now = Date.now()) {
  const end = resolvedAt ? Date.parse(resolvedAt) : now
  return Math.max(0, Math.floor((end - Date.parse(createdAt)) / 86_400_000))
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}
