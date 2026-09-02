import { useState } from 'react'
import type { NavigateFn } from '../types'
import { useAuth } from '../context/AuthContext'

export default function Register({ navigate }: { navigate: NavigateFn }) {
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', location: '' })
  const [error, setError] = useState('')

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div className="card" style={{ padding: '26px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>Create Account</h2>
          <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '0 0 20px' }}>Join KARM to track the reports you submit.</p>
          <form onSubmit={async e => {
            e.preventDefault()
            if (form.password !== form.confirmPassword) {
              setError('Passwords do not match')
              return
            }
            try {
              await register(form.name, form.email, form.password, form.location)
              navigate('home')
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Registration failed')
            }
          }} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <input className="input" type="email" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            <input className="input" placeholder="City (optional)" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            <input className="input" type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            <input className="input" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
            {error && <div style={{ color: '#DC2626', fontSize: '0.8rem' }}>{error}</div>}
            <button type="submit" className="btn-primary" style={{ padding: '11px', justifyContent: 'center' }}>Create Account</button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={() => navigate('login')} style={{ background: 'none', border: 'none', color: '#0891B2', cursor: 'pointer', fontWeight: 600 }}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  )
}
