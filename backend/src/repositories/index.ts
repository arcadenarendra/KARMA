import { hasDatabaseUrl, env } from '../config/env.js'
import type { Store } from '../models/types.js'
import { MemoryStore } from './memoryStore.js'
import { MongoStore } from './mongoStore.js'

export async function createStore(): Promise<{ store: Store; storage: 'memory' | 'mongodb' }> {
  if (!hasDatabaseUrl()) {
    const store = new MemoryStore()
    await store.seed()
    return { store, storage: 'memory' }
  }

  const store = await MongoStore.connect(env.databaseUrl)
  return { store, storage: 'mongodb' }
}
