import type { PatientSummary } from '@/api/patient'

const KEY = 'lv_patient_session'
const TTL = 30 * 60 * 1000 // 30 minutes in ms

interface Session {
  patient: PatientSummary
  savedAt: number
}

export function saveSession(patient: PatientSummary): void {
  const session: Session = { patient, savedAt: Date.now() }
  localStorage.setItem(KEY, JSON.stringify(session))
}

export function loadSession(): PatientSummary | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null

    const session: Session = JSON.parse(raw)
    if (Date.now() - session.savedAt > TTL) {
      localStorage.removeItem(KEY)
      return null
    }

    return session.patient
  } catch {
    localStorage.removeItem(KEY)
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(KEY)
}
