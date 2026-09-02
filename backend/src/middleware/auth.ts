import type { NextFunction, Request, Response } from 'express'
import { verifyAuthToken } from '../models/authToken.js'
import type { Store, UserRecord } from '../models/types.js'

export type AuthedRequest = Request & {
  store: Store
  user: UserRecord | null
}

export function attachStore(store: Store) {
  return (request: Request, _response: Response, next: NextFunction) => {
    (request as AuthedRequest).store = store
    next()
  }
}

export function authOptional(store: Store) {
  return async (request: Request, _response: Response, next: NextFunction) => {
    const authed = request as AuthedRequest
    authed.user = null
    const header = request.headers.authorization
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null
    if (token) {
      const payload = verifyAuthToken(token)
      if (payload) authed.user = await store.findUserById(payload.userId)
    }
    next()
  }
}

export function requireUser(request: Request, response: Response, next: NextFunction) {
  const user = (request as AuthedRequest).user
  if (!user) {
    response.status(401).json({ message: 'Sign in required' })
    return
  }
  next()
}

export function requireAdmin(request: Request, response: Response, next: NextFunction) {
  const user = (request as AuthedRequest).user
  if (!user) {
    response.status(401).json({ message: 'Sign in required' })
    return
  }
  if (user.role !== 'admin') {
    response.status(403).json({ message: 'Admin access required' })
    return
  }
  next()
}
