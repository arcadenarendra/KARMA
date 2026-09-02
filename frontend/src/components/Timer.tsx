interface Props {
  days: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showLabel?: boolean
}

function timerColor(d: number) {
  if (d >= 31) return { text: '#DC2626', bg: '#FEF2F2', border: '#FECACA' }
  if (d >= 8) return { text: '#D97706', bg: '#FFFBEB', border: '#FDE68A' }
  return { text: '#0891B2', bg: '#F0F9FF', border: '#BAE6FD' }
}

export default function Timer({ days, size = 'md', showLabel = true }: Props) {
  const col = timerColor(days)
  const numSize = { sm: '0.9rem', md: '1.25rem', lg: '1.8rem', xl: '2.8rem' }[size]
  const lblSize = { sm: '0.6rem', md: '0.65rem', lg: '0.72rem', xl: '0.82rem' }[size]
  const pad = size === 'xl' ? '14px 22px' : size === 'lg' ? '9px 16px' : '5px 10px'
  const label = days === 0 ? 'Under 1 day' : days === 1 ? '1 day unresolved' : `${days} days unresolved`

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', padding: pad, borderRadius: 8, background: col.bg, border: `1.5px solid ${col.border}`, gap: 2, flexShrink: 0 }}>
      <span style={{ fontSize: numSize, fontWeight: 800, color: col.text, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
        {days === 0 ? '<1d' : `${days}d`}
      </span>
      {showLabel && (
        <span style={{ fontSize: lblSize, fontWeight: 700, color: col.text, letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1 }}>
          {label}
        </span>
      )}
    </div>
  )
}
