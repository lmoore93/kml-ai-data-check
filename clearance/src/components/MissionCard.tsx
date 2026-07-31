import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { StatusBadge } from './StatusBadge'
import type { Mission, User, Aircraft } from '../types'

export function MissionCard({
  mission,
  users,
  aircraft,
}: {
  mission: Mission
  users: User[]
  aircraft: Aircraft[]
}) {
  const rpic = users.find((u) => u.id === mission.rpicId)
  const ac = aircraft.find((a) => a.id === mission.aircraftId)

  return (
    <Link to={`/missions/${mission.id}`} className="mission-row">
      <div>
        <h3>{mission.title}</h3>
        <div className="mission-meta">
          <span>{mission.reference}</span>
          <span>{mission.locationName}</span>
          <span>
            {format(new Date(mission.startAt), 'dd MMM yyyy HH:mm')}
          </span>
          <span>{rpic?.name ?? 'Unassigned'} · {ac?.callsign ?? '—'}</span>
        </div>
      </div>
      <StatusBadge status={mission.status} />
    </Link>
  )
}
