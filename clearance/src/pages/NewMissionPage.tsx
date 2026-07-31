import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/Store'
import type { OperationType } from '../types'

const OPERATIONS: OperationType[] = [
  'VLOS',
  'EVLOS',
  'Night VLOS',
  'Over people (excluded)',
  'Other',
]

function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function NewMissionPage() {
  const navigate = useNavigate()
  const { state, currentUser, createMission } = useStore()

  const defaultStart = (() => {
    const start = new Date()
    start.setDate(start.getDate() + 1)
    start.setHours(9, 0, 0, 0)
    return start
  })()
  const defaultEnd = (() => {
    const end = new Date(defaultStart)
    end.setHours(12, 0, 0, 0)
    return end
  })()

  const [title, setTitle] = useState('')
  const [operationType, setOperationType] = useState<OperationType>('VLOS')
  const [locationName, setLocationName] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [maxHeightAglM, setMaxHeightAglM] = useState(120)
  const [startAt, setStartAt] = useState(toLocalInputValue(defaultStart))
  const [endAt, setEndAt] = useState(toLocalInputValue(defaultEnd))
  const [purpose, setPurpose] = useState('')
  const [riskNotes, setRiskNotes] = useState('')
  const [aircraftId, setAircraftId] = useState(state.aircraft[0]?.id ?? '')
  const [rpicId, setRpicId] = useState(currentUser?.id ?? '')
  const [observerName, setObserverName] = useState('')
  const [error, setError] = useState('')

  if (!currentUser) return null

  const onSubmit = (e: FormEvent, andSubmit: boolean) => {
    e.preventDefault()
    setError('')
    if (!title.trim() || !locationName.trim() || !purpose.trim() || !riskNotes.trim()) {
      setError('Title, location, purpose, and risk notes are required.')
      return
    }
    const mission = createMission(
      {
        title,
        operationType,
        locationName,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        maxHeightAglM: Number(maxHeightAglM),
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        purpose,
        riskNotes,
        aircraftId,
        rpicId,
        observerName,
      },
      { submit: andSubmit },
    )
    navigate(`/missions/${mission.id}`)
  }

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>New mission</h1>
          <p>Capture the operational picture your SRP or CRP needs to clear the flight.</p>
        </div>
      </div>

      <form className="panel" onSubmit={(e) => onSubmit(e, false)}>
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="title">Mission title</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Tower inspection — Geelong South"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="operationType">Operation type</label>
            <select
              id="operationType"
              value={operationType}
              onChange={(e) => setOperationType(e.target.value as OperationType)}
            >
              {OPERATIONS.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="maxHeight">Max height AGL (m)</label>
            <input
              id="maxHeight"
              type="number"
              min={1}
              max={400}
              value={maxHeightAglM}
              onChange={(e) => setMaxHeightAglM(Number(e.target.value))}
            />
          </div>

          <div className="field full">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Site name / address"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="lat">Latitude (optional)</label>
            <input
              id="lat"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="-37.8136"
            />
          </div>

          <div className="field">
            <label htmlFor="lng">Longitude (optional)</label>
            <input
              id="lng"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="144.9631"
            />
          </div>

          <div className="field">
            <label htmlFor="start">Window start</label>
            <input
              id="start"
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="end">Window end</label>
            <input
              id="end"
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="aircraft">RPA</label>
            <select
              id="aircraft"
              value={aircraftId}
              onChange={(e) => setAircraftId(e.target.value)}
            >
              {state.aircraft.map((ac) => (
                <option key={ac.id} value={ac.id}>
                  {ac.callsign} — {ac.type}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="rpic">Remote Pilot in Command</label>
            <select
              id="rpic"
              value={rpicId}
              onChange={(e) => setRpicId(e.target.value)}
            >
              {state.users
                .filter((u) => u.role === 'rp' || u.role === 'srp' || u.role === 'crp')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.replNumber})
                  </option>
                ))}
            </select>
          </div>

          <div className="field full">
            <label htmlFor="observer">Observer / crew (optional)</label>
            <input
              id="observer"
              value={observerName}
              onChange={(e) => setObserverName(e.target.value)}
              placeholder="Name(s)"
            />
          </div>

          <div className="field full">
            <label htmlFor="purpose">Purpose</label>
            <textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Why this flight is required"
              required
            />
          </div>

          <div className="field full">
            <label htmlFor="risk">Risk notes / mitigations</label>
            <textarea
              id="risk"
              value={riskNotes}
              onChange={(e) => setRiskNotes(e.target.value)}
              placeholder="Key hazards, airspace, people, weather abort criteria..."
              required
            />
          </div>
        </div>

        {error ? (
          <p style={{ color: 'var(--coral)', marginTop: 14 }}>{error}</p>
        ) : null}

        <div className="actions">
          <button className="btn btn-ghost" type="submit">
            Save draft
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={(e) => onSubmit(e as unknown as FormEvent, true)}
          >
            Save & submit for approval
          </button>
        </div>
      </form>
    </main>
  )
}
