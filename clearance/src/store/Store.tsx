import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { nanoid } from 'nanoid'
import { INITIAL_STATE } from '../data/seed'
import type {
  AppState,
  AuditEntry,
  Mission,
  MissionStatus,
  OperationType,
  User,
} from '../types'

const STORAGE_KEY = 'clearance-app-v1'

type MissionInput = {
  title: string
  operationType: OperationType
  locationName: string
  latitude?: number
  longitude?: number
  maxHeightAglM: number
  startAt: string
  endAt: string
  purpose: string
  riskNotes: string
  aircraftId: string
  rpicId: string
  observerName?: string
}

type Store = {
  state: AppState
  currentUser: User | null
  login: (userId: string) => void
  logout: () => void
  resetDemo: () => void
  createMission: (input: MissionInput, options?: { submit?: boolean }) => Mission
  updateMission: (id: string, patch: Partial<MissionInput>) => void
  submitForApproval: (id: string) => void
  approveMission: (id: string, comment: string) => void
  rejectMission: (id: string, reason: string) => void
  markCompleted: (id: string) => void
  finaliseMission: (id: string) => void
  pendingApprovals: Mission[]
}

const StoreContext = createContext<Store | null>(null)

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(INITIAL_STATE)
    const parsed = JSON.parse(raw) as AppState
    return {
      ...INITIAL_STATE,
      ...parsed,
      users: INITIAL_STATE.users,
      aircraft: INITIAL_STATE.aircraft,
      orgName: INITIAL_STATE.orgName,
    }
  } catch {
    return structuredClone(INITIAL_STATE)
  }
}

function nextReference(missions: Mission[]): string {
  const year = new Date().getFullYear()
  const nums = missions
    .map((m) => {
      const match = m.reference.match(/CLR-(\d{4})-(\d+)/)
      return match && Number(match[1]) === year ? Number(match[2]) : 0
    })
    .filter(Boolean)
  const next = (nums.length ? Math.max(...nums) : 100) + 1
  return `CLR-${year}-${String(next).padStart(3, '0')}`
}

function audit(
  actor: User,
  action: string,
  note?: string,
): AuditEntry {
  return {
    id: nanoid(8),
    at: new Date().toISOString(),
    actorId: actor.id,
    actorName: actor.name,
    action,
    note,
  }
}

function canApprove(role: User['role']): boolean {
  return role === 'srp' || role === 'crp'
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const currentUser =
    state.users.find((u) => u.id === state.currentUserId) ?? null

  const store = useMemo<Store>(() => {
    const login = (userId: string) =>
      setState((s) => ({ ...s, currentUserId: userId }))

    const logout = () => setState((s) => ({ ...s, currentUserId: null }))

    const resetDemo = () => {
      localStorage.removeItem(STORAGE_KEY)
      setState(structuredClone(INITIAL_STATE))
    }

    const createMission = (
      input: MissionInput,
      options?: { submit?: boolean },
    ): Mission => {
      if (!currentUser) throw new Error('Not signed in')
      const now = new Date().toISOString()
      const submit = Boolean(options?.submit)
      const entries = [audit(currentUser, 'Created mission draft')]
      if (submit) {
        entries.push(audit(currentUser, 'Submitted for approval'))
      }
      const mission: Mission = {
        id: nanoid(10),
        reference: nextReference(state.missions),
        title: input.title.trim(),
        status: submit ? 'pending_approval' : 'draft',
        operationType: input.operationType,
        locationName: input.locationName.trim(),
        latitude: input.latitude,
        longitude: input.longitude,
        maxHeightAglM: input.maxHeightAglM,
        startAt: input.startAt,
        endAt: input.endAt,
        purpose: input.purpose.trim(),
        riskNotes: input.riskNotes.trim(),
        aircraftId: input.aircraftId,
        rpicId: input.rpicId,
        observerName: input.observerName?.trim() || undefined,
        createdById: currentUser.id,
        createdAt: now,
        updatedAt: now,
        audit: entries,
      }
      setState((s) => ({ ...s, missions: [mission, ...s.missions] }))
      return mission
    }

    const updateMission = (id: string, patch: Partial<MissionInput>) => {
      if (!currentUser) return
      setState((s) => ({
        ...s,
        missions: s.missions.map((m) => {
          if (m.id !== id) return m
          if (m.status !== 'draft' && m.status !== 'rejected') return m
          return {
            ...m,
            ...patch,
            updatedAt: new Date().toISOString(),
            status: m.status === 'rejected' ? 'draft' : m.status,
            rejectionReason: undefined,
            audit: [
              ...m.audit,
              audit(currentUser, 'Updated mission details'),
            ],
          }
        }),
      }))
    }

    const setStatus = (
      id: string,
      status: MissionStatus,
      action: string,
      note?: string,
      extra?: Partial<Mission>,
    ) => {
      if (!currentUser) return
      setState((s) => ({
        ...s,
        missions: s.missions.map((m) => {
          if (m.id !== id) return m
          return {
            ...m,
            ...extra,
            status,
            updatedAt: new Date().toISOString(),
            audit: [...m.audit, audit(currentUser, action, note)],
          }
        }),
      }))
    }

    const submitForApproval = (id: string) => {
      if (!currentUser) return
      setStatus(id, 'pending_approval', 'Submitted for approval')
    }

    const approveMission = (id: string, comment: string) => {
      if (!currentUser || !canApprove(currentUser.role)) return
      setStatus(id, 'ready_to_fly', 'Approved mission', comment, {
        approvalComment: comment,
        approvedById: currentUser.id,
        approvedAt: new Date().toISOString(),
        rejectionReason: undefined,
      })
    }

    const rejectMission = (id: string, reason: string) => {
      if (!currentUser || !canApprove(currentUser.role)) return
      setStatus(id, 'rejected', 'Rejected mission', reason, {
        rejectionReason: reason,
        approvalComment: undefined,
        approvedById: undefined,
        approvedAt: undefined,
      })
    }

    const markCompleted = (id: string) => {
      if (!currentUser) return
      setStatus(id, 'completed', 'Marked completed')
    }

    const finaliseMission = (id: string) => {
      if (!currentUser || !canApprove(currentUser.role)) return
      setStatus(id, 'finalised', 'Finalised mission record')
    }

    const pendingApprovals = state.missions.filter(
      (m) => m.status === 'pending_approval',
    )

    return {
      state,
      currentUser,
      login,
      logout,
      resetDemo,
      createMission,
      updateMission,
      submitForApproval,
      approveMission,
      rejectMission,
      markCompleted,
      finaliseMission,
      pendingApprovals,
    }
  }, [state, currentUser])

  return createElement(StoreContext.Provider, { value: store }, children)
}

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
