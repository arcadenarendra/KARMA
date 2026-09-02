import type { Issue, NavigateFn } from '../types'
import { useIsMobile } from '../hooks/useIsMobile'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'
import Timer from '../components/Timer'
import { api } from '../services/api'

interface Props {
  navigate: NavigateFn
  issues: Issue[]
  onChange: () => Promise<void>
}

export default function Profile({ navigate, issues, onChange }: Props) {
  const isMobile = useIsMobile()
  const { user } = useAuth()
  const mine = user ? issues.filter(i => i.reporterId === user.id) : []

  if (!user) {
    return (
      <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Sign in to view your reports</h1>
        <button className="btn-primary" onClick={() => navigate('login')}>Sign In</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: isMobile ? '16px 14px 80px' : '28px 24px 80px' }}>
      <div className="card" style={{ padding: '24px', marginBottom: 18 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px' }}>{user.name}</h1>
        <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{user.email} · {user.role} · Member since {user.joinedDate}</div>
      </div>

      {mine.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <h3 style={{ margin: '0 0 8px' }}>Your reports will appear here</h3>
          <button className="btn-primary" onClick={() => navigate('report')}>Report an Issue</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mine.map(issue => (
            <div key={issue.id} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px', cursor: 'pointer' }} onClick={() => navigate('issue-detail', issue.id)}>{issue.title}</h3>
                  <StatusBadge status={issue.status} />
                </div>
                <Timer days={issue.daysUnresolved} size="sm" />
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B' }}>{issue.description}</p>
              {issue.status !== 'Resolved' && (
                <button className="btn-secondary" onClick={async () => { await api.resolveIssue(issue.id); await onChange() }}>Mark as Resolved</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
