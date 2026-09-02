import { useState } from 'react'
import type { Issue, NavigateFn } from '../types'
import StatusBadge from './StatusBadge'
import Timer from './Timer'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const catColors: Record<string, { text: string; bg: string }> = {
  Infrastructure: { text: '#D97706', bg: '#FEF3C7' },
  Municipal: { text: '#2563EB', bg: '#DBEAFE' },
  'Public Safety': { text: '#DC2626', bg: '#FEE2E2' },
  Healthcare: { text: '#DB2777', bg: '#FCE7F3' },
  Education: { text: '#7C3AED', bg: '#EDE9FE' },
  Other: { text: '#64748B', bg: '#F1F5F9' },
}

interface Props {
  issue: Issue
  navigate: NavigateFn
  compact?: boolean
  onUpvoted?: (upvotes: number) => void
}

export default function ReportCard({ issue, navigate, compact = false, onUpvoted }: Props) {
  const { user } = useAuth()
  const [count, setCount] = useState(issue.upvotes)
  const [error, setError] = useState('')
  const cat = catColors[issue.category] ?? catColors.Other

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      navigate('login')
      return
    }
    try {
      const result = await api.upvoteIssue(issue.id)
      setCount(result.upvotes)
      onUpvoted?.(result.upvotes)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upvote')
    }
  }

  return (
    <div className="card card-hover" style={{ cursor: 'pointer', overflow: 'hidden', opacity: issue.status === 'Resolved' ? 0.72 : 1 }} onClick={() => navigate('issue-detail', issue.id)}>
      <div style={{ position: 'relative', height: compact ? 130 : 188, background: '#F1F5F9', overflow: 'hidden' }}>
        <img src={issue.image} alt={issue.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ padding: '3px 8px', borderRadius: 5, fontSize: '0.7rem', fontWeight: 700, background: cat.bg, color: cat.text }}>{issue.category}</span>
          {issue.trending && <span style={{ padding: '3px 8px', borderRadius: 5, fontSize: '0.7rem', fontWeight: 700, background: '#E0F2FE', color: '#0891B2' }}>Trending</span>}
        </div>
        <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
          <Timer days={issue.daysUnresolved} size="sm" />
        </div>
      </div>
      <div style={{ padding: '14px 16px 15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}>
          <h3 style={{ margin: 0, fontSize: compact ? '0.92rem' : '1rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>{issue.title}</h3>
          <StatusBadge status={issue.status} />
        </div>
        {!compact && (
          <p style={{ margin: '0 0 10px', fontSize: '0.82rem', color: '#64748B', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{issue.description}</p>
        )}
        <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginBottom: 12 }}>
          {issue.location} · {issue.reporter === 'Anonymous' ? 'Anonymous' : issue.reporter}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button className="upvote-btn" onClick={handleUpvote}>▲ {count.toLocaleString()}</button>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{issue.comments} comments</span>
          {issue.verified && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#16A34A', fontWeight: 600 }}>Verified</span>}
        </div>
        {error && <div style={{ marginTop: 8, fontSize: '0.75rem', color: '#DC2626' }}>{error}</div>}
      </div>
    </div>
  )
}
