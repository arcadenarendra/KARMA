import type { NavigateFn } from '../types'
import { useAuth } from '../context/AuthContext'

export default function Footer({ navigate }: { navigate: NavigateFn }) {
  const { user } = useAuth()
  return (
    <footer style={{ background: '#fff', borderTop: '1px solid #E2E8F0', padding: '32px 24px', marginTop: 'auto', color: '#64748B', fontSize: '0.85rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A', letterSpacing: '0.08em' }}>KARM</div>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 2 }}>Civic reporting and public accountability</div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.82rem' }}>Home</button>
          <button onClick={() => navigate('explore')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.82rem' }}>Explore</button>
          <button onClick={() => navigate('report')} style={{ background: 'none', border: 'none', color: '#0891B2', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>Report Issue</button>
          <button onClick={() => navigate('faq')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.82rem' }}>FAQ</button>
          {user?.role === 'admin' && (
            <button onClick={() => navigate('admin')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.82rem' }}>Admin</button>
          )}
        </div>
      </div>
    </footer>
  )
}
