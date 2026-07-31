import { ROLE_LABELS } from '../data/seed'
import { useStore } from '../store/Store'

export function LoginPage() {
  const { state, login } = useStore()

  return (
    <div className="login-hero">
      <div className="login-stage">
        <div className="login-copy">
          <div className="eyebrow">
            <span className="brand-mark" style={{ width: 28, height: 28 }} />
            Clearance
          </div>
          <h1>Mission clearance for remote pilots.</h1>
          <p>
            Load a mission. Get Senior or Chief Remote Pilot sign-off. Fly with a
            clean audit trail — without the AVCRM / Fly Freely complexity.
          </p>
        </div>

        <div className="panel role-picker">
          <h2 style={{ margin: '0 0 4px', fontSize: '1.15rem' }}>Enter as</h2>
          <p style={{ margin: '0 0 8px', color: 'var(--muted)', fontSize: '0.88rem' }}>
            Demo organisation · {state.orgName}
          </p>
          {state.users.map((user) => (
            <button
              key={user.id}
              type="button"
              className="role-card"
              onClick={() => login(user.id)}
            >
              <strong>{user.name}</strong>
              <span>{user.email}</span>
              <small>
                {ROLE_LABELS[user.role]}
                {user.replNumber ? ` · ${user.replNumber}` : ''}
              </small>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
