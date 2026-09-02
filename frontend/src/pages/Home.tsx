import { useState } from 'react'
import type { Issue, NavigateFn, IssueCategory } from '../types'
import ReportCard from '../components/ReportCard'
import Timer from '../components/Timer'
import StatusBadge from '../components/StatusBadge'
import { useIsMobile } from '../hooks/useIsMobile'

const CATS: (IssueCategory | 'All')[] = ['All', 'Infrastructure', 'Municipal', 'Public Safety', 'Healthcare', 'Education', 'Other']
const SORTS = ['Trending', 'Most Upvoted', 'Recently Reported', 'Longest Unresolved']
const CAT_COLORS: Record<string, string> = {
  Infrastructure: '#D97706',
  Municipal: '#2563EB',
  'Public Safety': '#DC2626',
  Healthcare: '#DB2777',
  Education: '#7C3AED',
  Other: '#64748B',
}

interface Props {
  navigate: NavigateFn
  issues: Issue[]
  loading?: boolean
}

export default function Home({ navigate, issues, loading = false }: Props) {
  const isMobile = useIsMobile()
  const [cat, setCat] = useState<string>('All')
  const [sort, setSort] = useState('Trending')
  const [search, setSearch] = useState('')

  const active = issues.filter(i => i.status !== 'Resolved')
  const resolved = issues.filter(i => i.status === 'Resolved')
  const trending = issues.filter(i => i.trending)
  const categoryCounts = CATS.slice(1).map(name => ({
    cat: name,
    count: issues.filter(i => i.category === name).length,
    color: CAT_COLORS[name],
  }))

  const filtered = issues
    .filter(i => cat === 'All' || i.category === cat)
    .filter(i => !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.location.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'Most Upvoted') return b.upvotes - a.upvotes
      if (sort === 'Longest Unresolved') return b.daysUnresolved - a.daysUnresolved
      if (sort === 'Recently Reported') return a.daysUnresolved - b.daysUnresolved
      return b.upvotes - a.upvotes
    })

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '20px 14px 80px' : '28px 24px 80px' }}>
      <div style={{ marginBottom: isMobile ? 16 : 24 }}>
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '1.9rem', fontWeight: 800, color: '#0F172A', margin: '0 0 4px', lineHeight: 1.2 }}>
          Civic Issues, <span style={{ color: '#0891B2' }}>Publicly Tracked</span>
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>
          Report problems, add evidence, and keep them visible until they are resolved.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 10, marginBottom: isMobile ? 20 : 28 }}>
        {[
          { label: 'Active Issues', value: String(active.length), color: '#0891B2' },
          { label: 'Resolved', value: String(resolved.length), color: '#16A34A' },
          { label: 'Community Upvotes', value: issues.reduce((sum, i) => sum + i.upvotes, 0).toLocaleString(), color: '#7C3AED' },
          { label: 'Critical (30+ days)', value: String(issues.filter(i => i.daysUnresolved >= 30 && i.status !== 'Resolved').length), color: '#D97706' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: isMobile ? '1.4rem' : '1.65rem', fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 3, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div className="label">{s.label}</div>
          </div>
        ))}
      </div>

      {trending.length > 0 && (
        <div style={{ marginBottom: isMobile ? 20 : 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Issues Gaining Attention</h2>
            <button onClick={() => navigate('explore')} style={{ background: 'none', border: 'none', color: '#0891B2', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>View all →</button>
          </div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }} className="scrollbar-hide">
            {trending.map(issue => (
              <div key={issue.id} onClick={() => navigate('issue-detail', issue.id)} className="card card-hover" style={{ minWidth: isMobile ? 180 : 210, maxWidth: isMobile ? 180 : 210, cursor: 'pointer', overflow: 'hidden', flexShrink: 0 }}>
                <div style={{ height: 95, overflow: 'hidden', background: '#F1F5F9' }}>
                  <img src={issue.image} alt={issue.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.3, marginBottom: 7 }}>{issue.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>▲ {issue.upvotes.toLocaleString()}</span>
                    <StatusBadge status={issue.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <input className="input" placeholder="Search civic issues..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 10 }} />
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 10, paddingBottom: 2 }} className="scrollbar-hide">
          {CATS.map(c => (
            <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }} className="scrollbar-hide">
          <span className="label" style={{ whiteSpace: 'nowrap', lineHeight: '26px' }}>Sort:</span>
          {SORTS.map(s => (
            <button key={s} onClick={() => setSort(s)} style={{
              background: sort === s ? '#E0F2FE' : '#fff',
              border: `1px solid ${sort === s ? '#0891B2' : '#E2E8F0'}`,
              borderRadius: 6, padding: '4px 10px',
              color: sort === s ? '#0891B2' : '#64748B',
              fontSize: '0.78rem', fontWeight: sort === s ? 600 : 500,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
            }}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 290px', gap: 20 }}>
        <div>
          {loading ? (
            <p style={{ color: '#94A3B8', padding: '40px 0', textAlign: 'center' }}>Loading issues...</p>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: '#94A3B8' }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#475569', marginBottom: 6 }}>No issues found</div>
              <div style={{ fontSize: '0.85rem' }}>Try changing your filters or report a new issue.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filtered.map((issue, i) => (
                <div key={issue.id} className="animate-in" style={{ animationDelay: `${i * 0.04}s` }}>
                  <ReportCard issue={issue} navigate={navigate} onUpvoted={() => undefined} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626' }} />
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>Critical — 30+ Days</span>
            </div>
            {issues.filter(i => i.daysUnresolved >= 30 && i.status !== 'Resolved').slice(0, 3).map(issue => (
              <div key={issue.id} onClick={() => navigate('issue-detail', issue.id)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', gap: 10, padding: '9px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F172A', lineHeight: 1.3, marginBottom: 2 }}>{issue.title}</div>
                  <div style={{ fontSize: '0.71rem', color: '#94A3B8' }}>{issue.location}</div>
                </div>
                <Timer days={issue.daysUnresolved} size="sm" showLabel={false} />
              </div>
            ))}
            {issues.filter(i => i.daysUnresolved >= 30 && i.status !== 'Resolved').length === 0 && (
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>No critical issues right now.</p>
            )}
          </div>

          <div className="card" style={{ padding: '16px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A', marginBottom: 12 }}>By Category</div>
            {categoryCounts.map(({ cat: c, count, color }) => (
              <div key={c} onClick={() => setCat(c)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
                  <span style={{ fontSize: '0.82rem', color: '#475569' }}>{c}</span>
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94A3B8' }}>{count}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: 12, padding: '18px', textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1E40AF', marginBottom: 5 }}>See a problem?</div>
            <p style={{ fontSize: '0.8rem', color: '#3B82F6', margin: '0 0 14px', lineHeight: 1.5 }}>Report it and keep it publicly tracked.</p>
            <button className="btn-primary" onClick={() => navigate('report')} style={{ width: '100%', justifyContent: 'center' }}>Report an Issue</button>
          </div>
        </div>
      </div>
    </div>
  )
}
