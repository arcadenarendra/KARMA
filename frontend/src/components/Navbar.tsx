import { useState } from 'react'
import type { Page, NavigateFn } from '../types'
import { useIsMobile } from '../hooks/useIsMobile'
import { useAuth } from '../context/AuthContext'

interface Props {
  page: Page
  navigate: NavigateFn
}

export default function Navbar({ page, navigate }: Props) {
  const isMobile = useIsMobile()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const go = (p: Page) => { navigate(p); setMenuOpen(false) }

  const links: { label: string; p: Page }[] = [
    { label: 'Home', p: 'home' },
    { label: 'Explore', p: 'explore' },
    { label: 'Report Issue', p: 'report' },
    { label: 'FAQ', p: 'faq' },
    ...(user?.role === 'admin' ? [{ label: 'Admin', p: 'admin' as Page }] : []),
  ]

  return (
    <>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', height: 56, gap: 6 }}>
          <button onClick={() => go('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginRight: isMobile ? 'auto' : 20 }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A', letterSpacing: '0.08em' }}>KARM</div>
            <div style={{ fontSize: '0.45rem', color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Every action counts</div>
          </button>

          {!isMobile && (
            <>
              {links.map(({ label, p }) => (
                <button key={p} onClick={() => go(p)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px',
                  fontSize: '0.855rem', fontWeight: page === p ? 600 : 500,
                  color: page === p ? '#0891B2' : '#64748B', fontFamily: 'Inter, sans-serif',
                  borderBottom: page === p ? '2px solid #0891B2' : '2px solid transparent',
                }}>{label}</button>
              ))}
              <div style={{ flex: 1 }} />
              {user ? (
                <>
                  <button onClick={() => go('profile')} className="btn-secondary" style={{ fontSize: '0.82rem', padding: '5px 12px' }}>
                    {user.name}
                  </button>
                  <button onClick={() => { logout(); go('home') }} className="btn-ghost" style={{ fontSize: '0.82rem' }}>Sign out</button>
                </>
              ) : (
                <button onClick={() => go('login')} className="btn-secondary" style={{ fontSize: '0.82rem', padding: '5px 12px' }}>Sign In</button>
              )}
            </>
          )}

          {isMobile && (
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => go('report')} className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Report</button>
              <button onClick={() => setMenuOpen(v => !v)} style={{ background: 'none', border: '1px solid #E2E8F0', borderRadius: 7, padding: '7px 8px', cursor: 'pointer' }}>☰</button>
            </div>
          )}
        </div>
      </nav>

      {isMobile && menuOpen && (
        <div style={{ position: 'fixed', top: 56, left: 0, right: 0, bottom: 0, zIndex: 99, background: 'rgba(15,23,42,0.3)' }} onClick={() => setMenuOpen(false)}>
          <div style={{ background: '#fff', padding: '8px 0 16px' }} onClick={e => e.stopPropagation()}>
            {links.map(({ label, p }) => (
              <button key={p} onClick={() => go(p)} style={{ display: 'block', width: '100%', background: page === p ? '#EFF6FF' : 'none', border: 'none', padding: '12px 20px', textAlign: 'left', color: page === p ? '#0891B2' : '#475569', fontWeight: page === p ? 600 : 500, cursor: 'pointer' }}>{label}</button>
            ))}
            <div style={{ margin: '8px 16px 0', display: 'flex', gap: 8 }}>
              {user ? (
                <>
                  <button onClick={() => go('profile')} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Profile</button>
                  <button onClick={() => { logout(); go('home') }} className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Sign out</button>
                </>
              ) : (
                <button onClick={() => go('login')} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Sign In</button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
