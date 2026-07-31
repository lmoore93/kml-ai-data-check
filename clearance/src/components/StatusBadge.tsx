import { STATUS_LABELS } from '../data/seed'
import type { MissionStatus } from '../types'

export function StatusBadge({ status }: { status: MissionStatus }) {
  return <span className={`badge badge-${status}`}>{STATUS_LABELS[status]}</span>
}
