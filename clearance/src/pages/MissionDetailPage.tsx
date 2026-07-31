import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { AuditTimeline } from '../components/AuditTimeline'
import { StatusBadge } from '../components/StatusBadge'
import { ROLE_LABELS } from '../data/seed'
import { useStore } from '../store/Store'

export function MissionDetailPage() {
  const { id } = useParams()
  const {
    state,
    currentUser,
    submitForApproval,
    approveMission,
    rejectMission,
    markCompleted,
    finaliseMission,
  } = useStore()
  const [comment, setComment] = useState('')
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')

  if (!currentUser) return null

  const mission = state.missions.find((m) => m.id === id)
  if (!mission) {
    return (
      <main className="page">
        <div className="empty">Mission not found.</div>
        <Link to="/">Back to missions</Link>
      </main>
    )
  }

  const rpic = state.users.find((u) => u.id === mission.rpicId)
  const aircraft = state.aircraft.find((a) => a.id === mission.aircraftId)
  const approver = state.users.find((u) => u.id === mission.approvedById)
  const canApprove =
    (currentUser.role === 'srp' || currentUser.role === 'crp') &&
    mission.status === 'pending_approval'
  const canSubmit =
    (mission.status === 'draft' || mission.status === 'rejected') &&
    (mission.createdById === currentUser.id ||
      mission.rpicId === currentUser.id ||
      currentUser.role !== 'rp')
  const canComplete =
    (mission.status === 'ready_to_fly' || mission.status === 'approved') &&
    (mission.rpicId === currentUser.id ||
      currentUser.role === 'srp' ||
      currentUser.role === 'crp')
  const canFinalise =
    mission.status === 'completed' &&
    (currentUser.role === 'srp' || currentUser.role === 'crp')

  const onApprove = (e: FormEvent) => {
    e.preventDefault()
    approveMission(mission.id, comment.trim() || 'Approved')
    setComment('')
    setMessage('Mission approved — ready to fly.')
  }

  const onReject = (e: FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      setMessage('A rejection reason is required.')
      return
    }
    rejectMission(mission.id, reason.trim())
    setReason('')
    setMessage('Mission returned to the remote pilot.')
  }

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.85rem' }}>
            {mission.reference}
          </p>
          <h1>{mission.title}</h1>
          <p>{mission.purpose}</p>
        </div>
        <StatusBadge status={mission.status} />
      </div>

      {message ? (
        <p style={{ color: 'var(--signal)', marginTop: -8 }}>{message}</p>
      ) : null}

      <div className="detail-grid">
        <section className="panel">
          <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Operational brief</h2>
          <dl className="kv">
            <div>
              <dt>Location</dt>
              <dd>
                {mission.locationName}
                {mission.latitude != null && mission.longitude != null
                  ? ` (${mission.latitude.toFixed(4)}, ${mission.longitude.toFixed(4)})`
                  : ''}
              </dd>
            </div>
            <div>
              <dt>Window</dt>
              <dd>
                {format(new Date(mission.startAt), 'dd MMM yyyy HH:mm')} →{' '}
                {format(new Date(mission.endAt), 'dd MMM yyyy HH:mm')}
              </dd>
            </div>
            <div>
              <dt>Operation</dt>
              <dd>
                {mission.operationType} · max {mission.maxHeightAglM} m AGL
              </dd>
            </div>
            <div>
              <dt>RPA</dt>
              <dd>
                {aircraft
                  ? `${aircraft.callsign} — ${aircraft.type} (${aircraft.registration})`
                  : '—'}
              </dd>
            </div>
            <div>
              <dt>RPIC</dt>
              <dd>
                {rpic
                  ? `${rpic.name} · ${rpic.replNumber ?? 'RePL n/a'}${rpic.aroc ? ' · AROC' : ''}`
                  : '—'}
              </dd>
            </div>
            {mission.observerName ? (
              <div>
                <dt>Observer / crew</dt>
                <dd>{mission.observerName}</dd>
              </div>
            ) : null}
            <div>
              <dt>Risk notes / mitigations</dt>
              <dd style={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                {mission.riskNotes}
              </dd>
            </div>
            {mission.approvalComment ? (
              <div>
                <dt>Approval comment</dt>
                <dd>
                  {mission.approvalComment}
                  {approver ? ` — ${approver.name}` : ''}
                </dd>
              </div>
            ) : null}
            {mission.rejectionReason ? (
              <div>
                <dt>Rejection reason</dt>
                <dd style={{ color: 'var(--coral)' }}>{mission.rejectionReason}</dd>
              </div>
            ) : null}
          </dl>

          <div className="actions">
            {canSubmit ? (
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  submitForApproval(mission.id)
                  setMessage('Submitted for Senior / Chief Remote Pilot sign-off.')
                }}
              >
                Submit for approval
              </button>
            ) : null}
            {canComplete ? (
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => {
                  markCompleted(mission.id)
                  setMessage('Mission marked completed — awaiting finalisation.')
                }}
              >
                Mark completed
              </button>
            ) : null}
            {canFinalise ? (
              <button
                className="btn btn-signal"
                type="button"
                onClick={() => {
                  finaliseMission(mission.id)
                  setMessage('Record finalised and locked.')
                }}
              >
                Finalise record
              </button>
            ) : null}
            <Link className="btn btn-ghost" to="/">
              Back
            </Link>
          </div>
        </section>

        <aside className="panel">
          <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Sign-off & audit</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 0 }}>
            Signed actions are attributed to {ROLE_LABELS[currentUser.role]}{' '}
            {currentUser.name}.
          </p>

          {canApprove ? (
            <div style={{ display: 'grid', gap: 14, marginBottom: 18 }}>
              <form onSubmit={onApprove}>
                <div className="field">
                  <label htmlFor="comment">Approval comment</label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Conditions, notes for the RPIC..."
                  />
                </div>
                <div className="actions">
                  <button className="btn btn-signal" type="submit">
                    Approve & clear
                  </button>
                </div>
              </form>
              <form onSubmit={onReject}>
                <div className="field">
                  <label htmlFor="reason">Return / reject reason</label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="What must change before resubmission?"
                    required
                  />
                </div>
                <div className="actions">
                  <button className="btn btn-danger" type="submit">
                    Reject
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          <AuditTimeline entries={mission.audit} />
        </aside>
      </div>
    </main>
  )
}
