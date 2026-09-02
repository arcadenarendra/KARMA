import { useState } from 'react'
import type { Issue, NavigateFn } from '../types'
import ReportCard from '../components/ReportCard'
import { useIsMobile } from '../hooks/useIsMobile'

const categoryMeta = [
  { name: 'Infrastructure', color: '#D97706', bg: '#FEF3C7', icon: '🏗' },
  { name: 'Municipal', color: '#2563EB', bg: '#DBEAFE', icon: '🏙' },
  { name: 'Public Safety', color: '#DC2626', bg: '#FEE2E2', icon: '🚨' },
  { name: 'Healthcare', color: '#DB2777', bg: '#FCE7F3', icon: '🏥' },
  { name: 'Education', color: '#7C3AED', bg: '#EDE9FE', icon: '🏫' },
  { name: 'Other', color: '#64748B', bg: '#F1F5F9', icon: '📋' },
]

export default function Explore({ navigate, issues }: { navigate: NavigateFn; issues: Issue[] }) {
  const isMobile = useIsMobile()
  const [filter, setFilter] = useState<string | null>(null)
  const displayed = filter ? issues.filter(i => i.category === filter) : issues

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '20px 14px 80px' : '28px 24px 80px' }}>
      <div style={{ marginBottom: isMobile ? 16 : 24 }}>
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '1.9rem', fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>Explore Issues</h1>
        <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>Browse civic issues by category or urgency.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)', gap: isMobile ? 8 : 10, marginBottom: 24 }}>
        {categoryMeta.map(c => {
          const count = issues.filter(i => i.category === c.name).length
          return (
            <button key={c.name} onClick={() => setFilter(filter === c.name ? null : c.name)} style={{
              background: filter === c.name ? c.bg : '#fff',
              border: `1.5px solid ${filter === c.name ? c.color : '#E2E8F0'}`,
              borderRadius: 10, padding: isMobile ? '10px 6px' : '14px 10px',
              cursor: 'pointer', textAlign: 'center',
            }}>
              <div style={{ fontSize: isMobile ? '1.2rem' : '1.4rem', marginBottom: 4 }}>{c.icon}</div>
              <div style={{ fontSize: isMobile ? '0.68rem' : '0.78rem', fontWeight: 700, color: filter === c.name ? c.color : '#374151' }}>{c.name}</div>
              {!isMobile && <div className="label">{count} issues</div>}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 14 }}>
        {displayed.map(issue => <ReportCard key={issue.id} issue={issue} navigate={navigate} />)}
      </div>
    </div>
  )
}
