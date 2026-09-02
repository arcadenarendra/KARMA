import { useState } from 'react'
import type { Issue, NavigateFn, IssueStatus } from '../types'
import StatusBadge from '../components/StatusBadge'
import Timer from '../components/Timer'
import { useIsMobile } from '../hooks/useIsMobile'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

const STATUS_OPTS: IssueStatus[] = ['New', 'Under Review', 'In Progress', 'Resolved', 'Awaiting Action', 'Community Verified']

export default function AdminDashboard({ navigate, issues, onChange }: { navigate: NavigateFn; issues: Issue[]; onChange: () => Promise<void> }) {
  const isMobile = useIsMobile()
  const { user } = useAuth()
  const [filterStatus, setFilter] = useState('All')
  const [error, setError] = useState('')

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Admin access required</h1>
        <p style={{ color: '#64748B' }}>Sign in with an admin account to update issue status.</p>
        <button className="btn-primary" onClick={() => navigate('login')}>Sign In</button>
      </div>
    )
  }

  const sorted = [...issues].filter(i => filterStatus === 'All' || i.status === filterStatus)

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '16px 14px 80px' : '24px 24px 80px' }}>
      <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 800, margin: '0 0 16px' }}>Issue overview</h1>
      {error && <p style={{ color: '#DC2626' }}>{error}</p>}
      <select value={filterStatus} onChange={e => setFilter(e.target.value)} className="input" style={{ maxWidth: 220, marginBottom: 16 }}>
        <option value="All">All statuses</option>
        {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.map(issue => (
          <div key={issue.id} className="card" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('issue-detail', issue.id)}>{issue.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{issue.category} · {issue.location}</div>
              </div>
              <Timer days={issue.daysUnresolved} size="sm" />
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10, flexWrap: 'wrap' }}>
              <StatusBadge status={issue.status} />
              <select
                className="input"
                style={{ maxWidth: 200 }}
                value={issue.status}
                onChange={async e => {
                  try {
                    await api.updateStatus(issue.id, e.target.value)
                    await onChange()
                    setError('')
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Update failed')
                  }
                }}
              >
                {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
