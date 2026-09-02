import { useState } from 'react'
import type { NavigateFn, IssueCategory } from '../types'
import { useIsMobile } from '../hooks/useIsMobile'
import { api } from '../services/api'

const CATEGORIES: IssueCategory[] = ['Infrastructure', 'Municipal', 'Public Safety', 'Healthcare', 'Education', 'Other']

export default function ReportProblem({ navigate, onSubmitted }: { navigate: NavigateFn; onSubmitted: () => Promise<void> }) {
  const isMobile = useIsMobile()
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '', image: '', anonymous: false })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [doneId, setDoneId] = useState<string | null>(null)

  if (doneId) {
    return (
      <div style={{ maxWidth: 540, margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Report submitted</h1>
        <p style={{ color: '#64748B' }}>It is now on the public feed with a tracking clock.</p>
        <button className="btn-primary" onClick={() => navigate('home')}>View feed</button>
        <button className="btn-ghost" onClick={() => navigate('issue-detail', doneId)}>View details</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: isMobile ? '16px 14px 80px' : '28px 24px 80px' }}>
      <h1 style={{ fontSize: isMobile ? '1.5rem' : '1.9rem', fontWeight: 800, margin: '0 0 4px' }}>Report an Issue</h1>
      <p style={{ color: '#64748B', marginBottom: 24 }}>Describe the problem so it can be tracked publicly.</p>
      <form onSubmit={async e => {
        e.preventDefault()
        setSaving(true)
        try {
          const saved = await api.submitReport({
            title: form.title,
            description: form.description,
            category: form.category,
            location: form.location,
            image: form.image || undefined,
            anonymous: form.anonymous,
          })
          await onSubmitted()
          setDoneId(saved.id)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Could not submit report')
        } finally {
          setSaving(false)
        }
      }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input className="input" placeholder="Issue title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
        <textarea className="input" rows={4} placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
          <option value="">Select a category</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="input" placeholder="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
        <input className="input" placeholder="Image URL (optional)" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.85rem' }}>
          <input type="checkbox" checked={form.anonymous} onChange={e => setForm(f => ({ ...f, anonymous: e.target.checked }))} />
          Report anonymously
        </label>
        {error && <div style={{ color: '#DC2626', fontSize: '0.85rem' }}>{error}</div>}
        <button type="submit" className="btn-primary" disabled={saving} style={{ justifyContent: 'center' }}>{saving ? 'Submitting...' : 'Submit Report'}</button>
      </form>
    </div>
  )
}
