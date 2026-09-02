import { Router } from 'express'
import { health } from '../controllers/healthController.js'
import { authRouter } from './authRoutes.js'
import { reportRouter } from './reportRoutes.js'

export const apiRouter = Router()
apiRouter.get('/health', health)
apiRouter.use('/auth', authRouter)
apiRouter.use('/reports', reportRouter)
