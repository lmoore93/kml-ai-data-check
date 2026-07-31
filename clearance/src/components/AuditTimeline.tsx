import { format } from 'date-fns'
import type { AuditEntry } from '../types'

export function AuditTimeline({ entries }: { entries: AuditEntry[] }) {
  const ordered = [...entries].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  )

  return (
    <ul className="timeline">
      {ordered.map((entry) => (
        <li key={entry.id}>
          <strong>{entry.action}</strong>
          <span>
            {entry.actorName} · {format(new Date(entry.at), 'dd MMM yyyy HH:mm')}
          </span>
          {entry.note ? <em>{entry.note}</em> : null}
        </li>
      ))}
    </ul>
  )
}
