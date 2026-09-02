import type { Request, Response } from 'express'
import { hashPassword, initials, verifyPassword } from '../models/helpers.js'
import { signAuthToken } from '../models/authToken.js'
import { userView } from '../views/serializers.js'
import type { AuthedRequest } from '../middleware/auth.js'

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function register(request: Request, response: Response) {
  const { store } = request as AuthedRequest
  const name = asString(request.body?.name)
  const email = asString(request.body?.email).toLowerCase()
  const password = asString(request.body?.password)
  const location = asString(request.body?.location)

  if (!name || !email || password.length < 6) {
    response.status(400).json({ message: 'Name, email, and a password of at least 6 characters are required' })
    return
  }

  if (await store.findUserByEmail(email)) {
    response.status(409).json({ message: 'An account with that email already exists' })
    return
  }

  const user = await store.createUser({
    name,
    email,
    passwordHash: await hashPassword(password),
    role: 'citizen',
    location,
  })

  response.status(201).json({ token: signAuthToken(user), user: userView(user) })
}

export async function login(request: Request, response: Response) {
  const { store } = request as AuthedRequest
  const email = asString(request.body?.email).toLowerCase()
  const password = asString(request.body?.password)
  const user = await store.findUserByEmail(email)

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    response.status(401).json({ message: 'Invalid email or password' })
    return
  }

  response.json({ token: signAuthToken(user), user: userView(user) })
}

export async function me(request: Request, response: Response) {
  const { user } = request as AuthedRequest
  if (!user) {
    response.status(401).json({ message: 'Sign in required' })
    return
  }
  response.json(userView(user))
}

