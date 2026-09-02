import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { createStore } from './repositories/index.js'
import { attachStore, authOptional } from './middleware/auth.js'
import { apiRouter } from './routes/index.js'

const { store, storage } = await createStore()
const app = express()

app.use(
  cors({
    origin: env.frontendOrigin || true,
  }),
)
app.use(express.json({ limit: '1mb' }))
app.use(attachStore(store))
app.use(authOptional(store))
app.use('/api', apiRouter)

app.use((_request, response) => {
  response.status(404).json({ message: 'Route not found' })
})

app.listen(env.port, '0.0.0.0', () => {
  console.log(`KARM backend listening on http://localhost:${env.port} (${storage} storage)`)
})
