import { Link } from 'react-router-dom'
import { MissionCard } from '../components/MissionCard'
import { useStore } from '../store/Store'
import type { MissionStatus } from '../types'

export function DashboardPage() {
  const { state, currentUser, resetDemo, pendingApprovals } = useStore()
  if (!currentUser) return null

  const myMissions =
    currentUser.role === 'rp'
      ? state.missions.filter(
          (m) => m.createdById === currentUser.id || m.rpicId === currentUser.id,
        )
      : state.missions

  const count = (status: MissionStatus | MissionStatus[]) => {
    const set = Array.isArray(status) ? status : [status]
    return myMissions.filter((m) => set.includes(m.status)).length
  }

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>Missions</h1>
          <p>
            Plan operations, submit for SRP/CRP approval, and keep a signed record
            from draft through finalisation.
          </p>
        </div>
        <div className="actions" style={{ marginTop: 0 }}>
          <button className="btn btn-ghost" type="button" onClick={resetDemo}>
            Reset demo
          </button>
          <Link className="btn btn-primary" to="/missions/new">
            New mission
          </Link>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <span>Pending approval</span>
          <strong>{pendingApprovals.length}</strong>
        </div>
        <div className="stat">
          <span>Ready to fly</span>
          <strong>{count(['approved', 'ready_to_fly'])}</strong>
        </div>
        <div className="stat">
          <span>In progress / done</span>
          <strong>{count(['completed', 'finalised'])}</strong>
        </div>
        <div className="stat">
          <span>Your view</span>
          <strong>{myMissions.length}</strong>
        </div>
      </div>

      <div className="mission-list">
        {myMissions.length === 0 ? (
          <div className="empty">No missions yet. Create one to request clearance.</div>
        ) : (
          myMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              users={state.users}
              aircraft={state.aircraft}
            />
          ))
        )}
      </div>
    </main>
  )
}
