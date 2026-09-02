import type { Request, Response } from 'express'
import { hasDatabaseUrl } from '../config/env.js'

export function health(_request: Request, response: Response) {
  response.json({
    status: 'ok',
    storage: hasDatabaseUrl() ? 'mongodb' : 'memory',
  })
}
