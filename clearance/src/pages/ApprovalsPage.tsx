import { Link } from 'react-router-dom'
import { MissionCard } from '../components/MissionCard'
import { useStore } from '../store/Store'

export function ApprovalsPage() {
  const { currentUser, pendingApprovals, state } = useStore()
  if (!currentUser) return null

  if (currentUser.role !== 'srp' && currentUser.role !== 'crp') {
    return (
      <main className="page">
        <div className="empty">Only Senior or Chief Remote Pilots can approve missions.</div>
        <Link to="/">Back to missions</Link>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>Approval queue</h1>
          <p>
            Review remote pilot mission packs and clear or return them with a signed
            comment.
          </p>
        </div>
      </div>

      <div className="mission-list">
        {pendingApprovals.length === 0 ? (
          <div className="empty">Nothing waiting for sign-off.</div>
        ) : (
          pendingApprovals.map((mission) => (
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
