import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const backendDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const projectDirectory = path.resolve(backendDirectory, '..')

dotenv.config({ path: path.join(projectDirectory, '.env') })
dotenv.config({ path: path.join(backendDirectory, '.env'), override: true })

export const env = {
  port: Number(process.env.BACKEND_PORT ?? 8787),
  databaseUrl: (process.env.DATABASE_URL ?? '').trim(),
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret',
  frontendOrigin: (process.env.FRONTEND_ORIGIN ?? '').trim(),
}

export function hasDatabaseUrl() {
  return env.databaseUrl.length > 0
}
