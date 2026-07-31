export type Role = 'rp' | 'srp' | 'crp'

export type MissionStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'ready_to_fly'
  | 'completed'
  | 'finalised'

export type OperationType = 'VLOS' | 'EVLOS' | 'Night VLOS' | 'Over people (excluded)' | 'Other'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  replNumber?: string
  aroc?: boolean
}

export interface Aircraft {
  id: string
  callsign: string
  type: string
  registration: string
  mtowKg: number
}

export interface AuditEntry {
  id: string
  at: string
  actorId: string
  actorName: string
  action: string
  note?: string
}

export interface Mission {
  id: string
  reference: string
  title: string
  status: MissionStatus
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
  createdById: string
  createdAt: string
  updatedAt: string
  approvalComment?: string
  approvedById?: string
  approvedAt?: string
  rejectionReason?: string
  audit: AuditEntry[]
}

export interface AppState {
  orgName: string
  users: User[]
  aircraft: Aircraft[]
  missions: Mission[]
  currentUserId: string | null
}
