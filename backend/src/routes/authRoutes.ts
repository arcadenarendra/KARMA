import { Router } from 'express'
import { login, me, register } from '../controllers/authController.js'
import { requireUser } from '../middleware/auth.js'

export const authRouter = Router()
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/me', requireUser, me)
