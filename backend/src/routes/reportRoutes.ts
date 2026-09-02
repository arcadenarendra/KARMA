import { Router } from 'express'
import {
  addComment,
  createReport,
  getReport,
  listReports,
  resolveReport,
  stats,
  updateStatus,
  upvoteReport,
} from '../controllers/reportController.js'
import { requireAdmin, requireUser } from '../middleware/auth.js'

export const reportRouter = Router()
reportRouter.get('/', listReports)
reportRouter.get('/stats', stats)
reportRouter.get('/:id', getReport)
reportRouter.post('/', createReport)
reportRouter.post('/:id/upvote', requireUser, upvoteReport)
reportRouter.post('/:id/resolve', requireUser, resolveReport)
reportRouter.patch('/:id/status', requireAdmin, updateStatus)
reportRouter.post('/:id/comments', requireUser, addComment)
