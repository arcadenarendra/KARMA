import { useState } from 'react'
import type { NavigateFn } from '../types'
import { useAuth } from '../context/AuthContext'

export default function Login({ navigate }: { navigate: NavigateFn }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0F172A', letterSpacing: '0.07em' }}>KARM</div>
        </div>
        <div className="card" style={{ padding: '26px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>Sign In</h2>
          <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '0 0 20px' }}>Use your account to report, upvote, and comment.</p>
          <form onSubmit={async e => {
            e.preventDefault()
            try {
              await login(email, password)
              navigate('home')
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Sign in failed')
            }
          }} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <input className="input" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <div style={{ color: '#DC2626', fontSize: '0.8rem' }}>{error}</div>}
            <button type="submit" className="btn-primary" style={{ padding: '11px', justifyContent: 'center' }}>Sign In</button>
          </form>
          <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 12 }}>Admin demo: admin@karm.local / admin123</p>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={() => navigate('signup')} style={{ background: 'none', border: 'none', color: '#0891B2', cursor: 'pointer', fontWeight: 600 }}>Create an account</button>
          </div>
        </div>
      </div>
    </div>
  )
}
