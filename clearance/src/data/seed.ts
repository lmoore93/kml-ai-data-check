import type { Aircraft, AppState, Mission, User } from '../types'

export const USERS: User[] = [
  {
    id: 'u-rp-1',
    name: 'Alex Chen',
    email: 'alex@clearops.demo',
    role: 'rp',
    replNumber: 'RePL-10482',
    aroc: true,
  },
  {
    id: 'u-rp-2',
    name: 'Sam Rivera',
    email: 'sam@clearops.demo',
    role: 'rp',
    replNumber: 'RePL-11890',
    aroc: true,
  },
  {
    id: 'u-srp-1',
    name: 'Jordan Blake',
    email: 'jordan@clearops.demo',
    role: 'srp',
    replNumber: 'RePL-09012',
    aroc: true,
  },
  {
    id: 'u-crp-1',
    name: 'Morgan Hale',
    email: 'morgan@clearops.demo',
    role: 'crp',
    replNumber: 'RePL-04110',
    aroc: true,
  },
]

export const AIRCRAFT: Aircraft[] = [
  {
    id: 'ac-1',
    callsign: 'OSPREY-1',
    type: 'DJI Matrice 350 RTK',
    registration: 'VH-RPA01',
    mtowKg: 9.2,
  },
  {
    id: 'ac-2',
    callsign: 'OSPREY-2',
    type: 'DJI Mavic 3 Enterprise',
    registration: 'VH-RPA02',
    mtowKg: 1.05,
  },
  {
    id: 'ac-3',
    callsign: 'FALCON-1',
    type: 'Autel EVO II Dual',
    registration: 'VH-RPA03',
    mtowKg: 1.2,
  },
]

function daysFromNow(days: number, hour = 9): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

export const SEED_MISSIONS: Mission[] = [
  {
    id: 'm-1',
    reference: 'CLR-2026-014',
    title: 'Bridge deck inspection — West Gate approach',
    status: 'pending_approval',
    operationType: 'VLOS',
    locationName: 'West Gate Bridge, Melbourne VIC',
    latitude: -37.8197,
    longitude: 144.8986,
    maxHeightAglM: 80,
    startAt: daysFromNow(2, 8),
    endAt: daysFromNow(2, 12),
    purpose: 'Structural condition survey of northern approach spans for asset management.',
    riskNotes:
      'Public road corridor below. Spotters on both banks. NOTAM reviewed. Max height 80 m AGL. Abort if wind > 10 m/s.',
    aircraftId: 'ac-1',
    rpicId: 'u-rp-1',
    observerName: 'Sam Rivera',
    createdById: 'u-rp-1',
    createdAt: daysFromNow(-1, 14),
    updatedAt: daysFromNow(-1, 14),
    audit: [
      {
        id: 'a-1',
        at: daysFromNow(-1, 14),
        actorId: 'u-rp-1',
        actorName: 'Alex Chen',
        action: 'Created mission draft',
      },
      {
        id: 'a-2',
        at: daysFromNow(-1, 15),
        actorId: 'u-rp-1',
        actorName: 'Alex Chen',
        action: 'Submitted for approval',
        note: 'Ready for SRP/CRP review',
      },
    ],
  },
  {
    id: 'm-2',
    reference: 'CLR-2026-015',
    title: 'Solar farm orthomosaic — Mildura',
    status: 'approved',
    operationType: 'VLOS',
    locationName: 'Red Cliffs Solar Farm, Mildura VIC',
    latitude: -34.308,
    longitude: 142.198,
    maxHeightAglM: 120,
    startAt: daysFromNow(5, 7),
    endAt: daysFromNow(5, 16),
    purpose: 'Quarterly aerial mapping for panel soiling and alignment analysis.',
    riskNotes: 'Rural site, low traffic. Standard VLOS grid. Battery swap plan confirmed.',
    aircraftId: 'ac-2',
    rpicId: 'u-rp-2',
    createdById: 'u-rp-2',
    createdAt: daysFromNow(-3, 10),
    updatedAt: daysFromNow(-2, 11),
    approvalComment: 'Approved. Ensure radio watch on CTAF if aircraft activity noted.',
    approvedById: 'u-srp-1',
    approvedAt: daysFromNow(-2, 11),
    audit: [
      {
        id: 'a-3',
        at: daysFromNow(-3, 10),
        actorId: 'u-rp-2',
        actorName: 'Sam Rivera',
        action: 'Created mission draft',
      },
      {
        id: 'a-4',
        at: daysFromNow(-3, 11),
        actorId: 'u-rp-2',
        actorName: 'Sam Rivera',
        action: 'Submitted for approval',
      },
      {
        id: 'a-5',
        at: daysFromNow(-2, 11),
        actorId: 'u-srp-1',
        actorName: 'Jordan Blake',
        action: 'Approved mission',
        note: 'Approved. Ensure radio watch on CTAF if aircraft activity noted.',
      },
    ],
  },
  {
    id: 'm-3',
    reference: 'CLR-2026-012',
    title: 'Emergency services training — Ballarat',
    status: 'finalised',
    operationType: 'EVLOS',
    locationName: 'Ballarat Airport surrounds VIC',
    maxHeightAglM: 60,
    startAt: daysFromNow(-7, 9),
    endAt: daysFromNow(-7, 15),
    purpose: 'Joint training with CFA for night-adjacent EVLOS procedures (daylight only).',
    riskNotes: 'Coordinated with aerodrome operator. Dedicated observer network.',
    aircraftId: 'ac-1',
    rpicId: 'u-rp-1',
    observerName: 'Jordan Blake',
    createdById: 'u-rp-1',
    createdAt: daysFromNow(-10, 9),
    updatedAt: daysFromNow(-6, 17),
    approvedById: 'u-crp-1',
    approvedAt: daysFromNow(-9, 10),
    approvalComment: 'CRP approved for EVLOS training profile.',
    audit: [
      {
        id: 'a-6',
        at: daysFromNow(-10, 9),
        actorId: 'u-rp-1',
        actorName: 'Alex Chen',
        action: 'Created mission draft',
      },
      {
        id: 'a-7',
        at: daysFromNow(-10, 10),
        actorId: 'u-rp-1',
        actorName: 'Alex Chen',
        action: 'Submitted for approval',
      },
      {
        id: 'a-8',
        at: daysFromNow(-9, 10),
        actorId: 'u-crp-1',
        actorName: 'Morgan Hale',
        action: 'Approved mission',
        note: 'CRP approved for EVLOS training profile.',
      },
      {
        id: 'a-9',
        at: daysFromNow(-7, 16),
        actorId: 'u-rp-1',
        actorName: 'Alex Chen',
        action: 'Marked completed',
      },
      {
        id: 'a-10',
        at: daysFromNow(-6, 17),
        actorId: 'u-crp-1',
        actorName: 'Morgan Hale',
        action: 'Finalised mission record',
      },
    ],
  },
]

export const INITIAL_STATE: AppState = {
  orgName: 'ClearOps Demo ReOC',
  users: USERS,
  aircraft: AIRCRAFT,
  missions: SEED_MISSIONS,
  currentUserId: null,
}

export const ROLE_LABELS: Record<string, string> = {
  rp: 'Remote Pilot',
  srp: 'Senior Remote Pilot',
  crp: 'Chief Remote Pilot',
}

export const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  pending_approval: 'Pending approval',
  approved: 'Approved',
  rejected: 'Rejected',
  ready_to_fly: 'Ready to fly',
  completed: 'Completed',
  finalised: 'Finalised',
}
