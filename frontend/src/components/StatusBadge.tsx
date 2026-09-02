import type { IssueStatus } from '../types'

const cfg: Record<IssueStatus, { label: string; color: string; bg: string; border: string }> = {
  'New':                { label: 'New',            color: '#0891B2', bg: '#E0F2FE', border: '#BAE6FD' },
  'Under Review':       { label: 'Under Review',   color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
  'Community Verified': { label: 'Verified',        color: '#16A34A', bg: '#DCFCE7', border: '#BBF7D0' },
  'In Progress':        { label: 'In Progress',    color: '#7C3AED', bg: '#EDE9FE', border: '#DDD6FE' },
  'Resolved':           { label: 'Resolved',       color: '#64748B', bg: '#F1F5F9', border: '#E2E8F0' },
  'Awaiting Action':    { label: 'Awaiting Action', color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
}

interface Props {
  status: IssueStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const c = cfg[status]
  const pulse = status === 'Awaiting Action' || status === 'New'

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: size === 'md' ? '4px 10px' : '3px 8px',
      borderRadius: 20,
      fontSize: size === 'md' ? '0.78rem' : '0.7rem',
      fontWeight: 600,
      color: c.color,
      background: c.bg,
      border: `1px solid ${c.border}`,
      letterSpacing: '0.01em',
      whiteSpace: 'nowrap',
    }}>
      <span
        className={pulse ? 'pulse-dot' : ''}
        style={{ width: 5, height: 5, borderRadius: '50%', background: c.color, flexShrink: 0 }}
      />
      {c.label}
    </span>
  )
}
