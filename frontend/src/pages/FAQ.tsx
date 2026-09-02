import { useState } from 'react'
import type { NavigateFn } from '../types'
import { useIsMobile } from '../hooks/useIsMobile'

interface FAQItem {
  id: number
  q: string
  a: string
  category: 'General' | 'Reporting' | 'Privacy & Security' | 'Tracking & Resolution'
}

const FAQS: FAQItem[] = [
  {
    id: 1,
    category: 'General',
    q: 'What is KARM?',
    a: 'KARM is a civic platform where citizens can report local problems, share evidence, and publicly track their resolution.'
  },
  {
    id: 2,
    category: 'Reporting',
    q: 'What kind of problems can I report?',
    a: 'You can report issues related to Education, Healthcare, Municipal Works, Infrastructure, and Public Safety.'
  },
  {
    id: 3,
    category: 'Reporting',
    q: 'How do I report a problem?',
    a: 'Create a report, describe the issue, and provide photo or video evidence to support it.'
  },
  {
    id: 4,
    category: 'Privacy & Security',
    q: 'Can I report a problem anonymously?',
    a: 'Yes. You can choose to hide your identity when submitting a report.'
  },
  {
    id: 5,
    category: 'Privacy & Security',
    q: 'Will my location be visible if I upload a photo?',
    a: 'KARM removes GPS and device-related metadata from uploaded photos before they are published.'
  },
  {
    id: 6,
    category: 'Reporting',
    q: 'Why should I provide photo or video evidence?',
    a: 'Evidence helps demonstrate that the reported issue is genuine and allows other citizens to better understand the problem.'
  },
  {
    id: 7,
    category: 'General',
    q: 'Can other people support my report?',
    a: 'Yes. Other users can upvote your report and share their own experiences with the same issue.'
  },
  {
    id: 8,
    category: 'Tracking & Resolution',
    q: 'What does “Days Unresolved” mean?',
    a: 'It shows how long a reported problem has remained unresolved since it was submitted.'
  },
  {
    id: 9,
    category: 'General',
    q: 'Who will see my report?',
    a: 'Reports are publicly visible so citizens, journalists, and relevant authorities can see and track them.'
  },
  {
    id: 10,
    category: 'Tracking & Resolution',
    q: 'How does my report reach the concerned authority?',
    a: 'Reports are organised by category so the relevant government department can view issues related to its area and respond to them.'
  },
  {
    id: 11,
    category: 'Tracking & Resolution',
    q: 'Can I track what happens after I report an issue?',
    a: 'Yes. You can follow the report\'s status and see how long it remains unresolved.'
  },
  {
    id: 12,
    category: 'Tracking & Resolution',
    q: 'What happens when the problem is fixed?',
    a: 'The concerned authority can mark the issue as resolved, and the report remains in the platform\'s history with its resolution timeline.'
  },
  {
    id: 13,
    category: 'Tracking & Resolution',
    q: 'What if the authority does not respond?',
    a: 'The Days Unresolved counter continues to run publicly, making the lack of response visible.'
  },
  {
    id: 14,
    category: 'Reporting',
    q: 'What if someone has already reported the same problem?',
    a: 'You can support the existing report by upvoting it and adding your experience instead of creating another duplicate report.'
  },
  {
    id: 15,
    category: 'General',
    q: 'Can I report fake or misleading information?',
    a: 'Yes. Community flagging and moderation are used to identify potentially false or inappropriate reports.'
  },
  {
    id: 16,
    category: 'Privacy & Security',
    q: 'How does KARM prevent spam and abusive content?',
    a: 'The platform uses rule-based filtering and community flagging to identify spam, hate speech, personal information, and other inappropriate content.'
  },
  {
    id: 17,
    category: 'Privacy & Security',
    q: 'Is my personal information safe?',
    a: 'KARM aims to minimise stored personal information, particularly for anonymous reports, and uses authentication and privacy measures to protect users.'
  },
  {
    id: 18,
    category: 'General',
    q: 'Is KARM replacing government complaint systems?',
    a: 'No. KARM is designed to make civic problems and government responses more visible and accountable rather than replacing the authorities\' role.'
  },
  {
    id: 19,
    category: 'General',
    q: 'How is KARM different from social media?',
    a: 'Unlike ordinary social media posts that can quickly disappear from attention, KARM keeps civic reports organised, visible, and trackable until resolution.'
  },
  {
    id: 20,
    category: 'General',
    q: 'Why should I use KARM instead of simply complaining online?',
    a: 'KARM gives your complaint a public record, supporting evidence, community upvotes, and an unresolved timer, making it easier for an issue to remain visible until action is taken.'
  }
]

const CATEGORIES = ['All', 'General', 'Reporting', 'Privacy & Security', 'Tracking & Resolution'] as const

export default function FAQ({ navigate }: { navigate: NavigateFn }) {
  const isMobile = useIsMobile()
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState<string>('All')
  const [openIds, setOpenIds] = useState<number[]>([1, 8])

  const toggleOpen = (id: number) => {
    setOpenIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const filtered = FAQS.filter(item => {
    const matchesCat = cat === 'All' || item.category === cat
    const matchesSearch = !search ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: isMobile ? '20px 14px 80px' : '28px 24px 80px' }}>
      <button onClick={() => navigate('home')} className="btn-ghost" style={{ marginBottom: 16, padding: '5px 0', color: '#64748B' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Home
      </button>

      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0891B2', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#E0F2FE', padding: '4px 10px', borderRadius: 20 }}>
          Help Center
        </span>
        <h1 style={{ fontSize: isMobile ? '1.6rem' : '2.1rem', fontWeight: 800, color: '#0F172A', margin: '10px 0 6px' }}>
          Frequently Asked Questions
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
          Top 20 questions about KARM, civic reporting, evidence privacy, and public accountability.
        </p>
      </div>

      {/* Search and Category Pills */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="input"
            placeholder="Search FAQs (e.g., anonymous, evidence, days unresolved)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 38, fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="scrollbar-hide">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`chip ${cat === c ? 'active' : ''}`}
              onClick={() => setCat(c)}
              style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion FAQ list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8', background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>❓</div>
            <div style={{ fontWeight: 600, color: '#475569' }}>No matching questions found</div>
            <div style={{ fontSize: '0.8rem', marginTop: 4 }}>Try adjusting your search terms or selecting a different category.</div>
          </div>
        ) : (
          filtered.map(item => {
            const isOpen = openIds.includes(item.id)
            return (
              <div
                key={item.id}
                className="card"
                style={{
                  overflow: 'hidden',
                  border: `1.5px solid ${isOpen ? '#0891B2' : '#E2E8F0'}`,
                  transition: 'all 0.15s ease'
                }}
              >
                <button
                  onClick={() => toggleOpen(item.id)}
                  style={{
                    width: '100%',
                    padding: '16px 18px',
                    background: isOpen ? '#F0F9FF' : '#fff',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0891B2', background: '#E0F2FE', padding: '2px 8px', borderRadius: 6, flexShrink: 0 }}>
                      #{item.id}
                    </span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.35 }}>
                      {item.q}
                    </span>
                  </div>
                  <span style={{ fontSize: '1.2rem', color: '#0891B2', fontWeight: 600, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ↓
                  </span>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 18px 16px', background: '#F0F9FF', borderTop: '1px solid #BAE6FD' }}>
                    <p style={{ margin: '12px 0 0', fontSize: '0.88rem', color: '#334155', lineHeight: 1.6 }}>
                      {item.a}
                    </p>
                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Category: {item.category}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Bottom CTA */}
      <div style={{ marginTop: 32, padding: '20px', background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: 12, textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E40AF', margin: '0 0 6px' }}>Have an issue to report?</h3>
        <p style={{ fontSize: '0.82rem', color: '#3B82F6', margin: '0 0 14px' }}>Every report creates public evidence and accountability.</p>
        <button className="btn-primary" onClick={() => navigate('report')} style={{ padding: '9px 18px', margin: '0 auto' }}>
          Report a Problem Now
        </button>
      </div>
    </div>
  )
}
