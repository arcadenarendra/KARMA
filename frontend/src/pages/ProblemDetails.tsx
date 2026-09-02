import { useEffect, useState } from 'react'
import type { Issue, NavigateFn } from '../types'
import StatusBadge from '../components/StatusBadge'
import Timer from '../components/Timer'
import { useIsMobile } from '../hooks/useIsMobile'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function ProblemDetails({ navigate, issues, issueId, onChange }: { navigate: NavigateFn; issues: Issue[]; issueId: string | null; onChange: () => Promise<void> }) {
  const isMobile = useIsMobile()
  const { user } = useAuth()
  const issue = issues.find(i => i.id === issueId) ?? issues[0]
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [local, setLocal] = useState(issue)

  useEffect(() => { setLocal(issue) }, [issue])

  if (!issue) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Issue not found. <button className="btn-ghost" onClick={() => navigate('home')}>Back</button></div>
  }

  const isResolved = local.status === 'Resolved'

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: isMobile ? '16px 14px 80px' : '24px 24px 80px' }}>
      <button onClick={() => navigate('home')} className="btn-ghost" style={{ marginBottom: 16, color: '#64748B' }}>← Back to Feed</button>
      <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 18, background: '#E2E8F0' }}>
        <img src={local.image} alt={local.title} style={{ width: '100%', maxHeight: isMobile ? 220 : 400, objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <StatusBadge status={local.status} size="md" />
        <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 600, background: '#F1F5F9' }}>{local.category}</span>
      </div>
      <h1 style={{ fontSize: isMobile ? '1.2rem' : '1.7rem', fontWeight: 800, margin: '0 0 10px' }}>{local.title}</h1>
      <p style={{ color: '#64748B', fontSize: '0.85rem' }}>{local.location} · Reported {local.reportedDate} · {local.reporter}</p>
      <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.65 }}>{local.description}</p>
      {!isResolved && <Timer days={local.daysUnresolved} size={isMobile ? 'lg' : 'xl'} />}

      <div className="card" style={{ padding: '12px 16px', display: 'flex', gap: 8, margin: '20px 0', flexWrap: 'wrap' }}>
        <button className="upvote-btn" onClick={async () => {
          if (!user) return navigate('login')
          try {
            const result = await api.upvoteIssue(local.id)
            setLocal(prev => ({ ...prev, upvotes: result.upvotes }))
            await onChange()
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Upvote failed')
          }
        }}>▲ {local.upvotes.toLocaleString()}</button>
        <span style={{ alignSelf: 'center', fontSize: '0.8rem', color: '#94A3B8' }}>{local.comments} comments</span>
      </div>
      {error && <p style={{ color: '#DC2626' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 260px', gap: 20 }}>
        <div>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Community Comments</h2>
          {user ? (
            <div style={{ marginBottom: 14 }}>
              <textarea className="input" rows={3} value={comment} onChange={e => setComment(e.target.value)} placeholder="Add context..." />
              <button className="btn-primary" style={{ marginTop: 8 }} onClick={async () => {
                if (!comment.trim()) return
                const saved = await api.addComment(local.id, comment.trim())
                setLocal(prev => ({ ...prev, comments_data: [saved, ...prev.comments_data], comments: prev.comments + 1 }))
                setComment('')
                await onChange()
              }}>Post Comment</button>
            </div>
          ) : (
            <button className="btn-secondary" onClick={() => navigate('login')}>Sign in to comment</button>
          )}
          {(local.comments_data ?? []).map(c => (
            <div key={c.id} className="card" style={{ padding: '12px 14px', marginTop: 10 }}>
              <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{c.author} <span style={{ color: '#94A3B8', fontWeight: 400 }}>{c.timestamp}</span></div>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: '6px 0 0' }}>{c.text}</p>
            </div>
          ))}
        </div>
        <div>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Issue Timeline</h2>
          {(local.timeline ?? []).map(event => (
            <div key={event.id} style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{event.label}</div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{event.timestamp}</div>
              {event.detail && <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{event.detail}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
