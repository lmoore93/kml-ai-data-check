import { NavLink, Outlet } from 'react-router-dom'
import { ROLE_LABELS } from '../data/seed'
import { useStore } from '../store/Store'

export function Layout() {
  const { currentUser, logout, pendingApprovals, state } = useStore()
  if (!currentUser) return null

  const canApprove = currentUser.role === 'srp' || currentUser.role === 'crp'
  const pending = pendingApprovals.length

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden />
          <div className="brand-text">
            <strong>Clearance</strong>
            <span>{state.orgName}</span>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink to="/" end>
            Missions
          </NavLink>
          <NavLink to="/missions/new">New mission</NavLink>
          {canApprove && (
            <NavLink to="/approvals">
              Approvals{pending ? ` (${pending})` : ''}
            </NavLink>
          )}
        </nav>

        <div className="user-chip">
          <div className="user-meta">
            <strong>{currentUser.name}</strong>
            <span>{ROLE_LABELS[currentUser.role]}</span>
          </div>
          <button className="btn btn-ghost" type="button" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
