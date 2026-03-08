// Strip trailing slash so VITE_API_BASE_URL can be set with or without it
// e.g. https://your-backend.com/api  OR  https://your-backend.com/api/
const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string ?? '').replace(/\/$/, '')

async function request<T>(
  method: string,
  path: string,
  signal?: AbortSignal,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    signal,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? `HTTP ${res.status}`)
  }

  return res.json() as Promise<T>
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PatientSummary {
  id: number
  full_name: string
  date_of_birth: string | null
}

export interface PatientProfile {
  id: number
  full_name: string
  date_of_birth: string | null
  age: number | null
  phones: string[]
  gender: string | null
  address: string | null
  district: string | null
  region: string | null
  country: string | null
}

export interface HistoryItem {
  step_id: number
  order_id: number | null
  date: string | null
  vaccine_name: string | null
  scheme_name: string | null
  step_number: number
  dose_name: string | null
  doctor_name: string | null
  serie: string
  status: 'completed'
}

export interface ScheduleItem {
  step_id: number
  vaccine_name: string | null
  scheme_name: string | null
  step_number: number
  scheduled_date: string | null
  days_remaining: number | null
}

export interface CertificateItem {
  id: number
  name: string
  order_id: number
  order_date: string | null
}

// ─── API calls ───────────────────────────────────────────────────────────────

export async function identifyPatient(phone: string, signal?: AbortSignal): Promise<PatientSummary[]> {
  const data = await request<{ patients: PatientSummary[] }>('POST', '/patient/identify', signal, { phone })
  return data.patients
}

export async function getProfile(patientId: number, signal?: AbortSignal): Promise<PatientProfile> {
  const data = await request<{ patient: PatientProfile }>('GET', `/patient/${patientId}/profile`, signal)
  return data.patient
}

export async function getHistory(patientId: number, signal?: AbortSignal): Promise<HistoryItem[]> {
  const data = await request<{ history: HistoryItem[] }>('GET', `/patient/${patientId}/vaccination-history`, signal)
  return data.history
}

export async function getSchedule(patientId: number, signal?: AbortSignal): Promise<ScheduleItem[]> {
  const data = await request<{ schedule: ScheduleItem[] }>('GET', `/patient/${patientId}/vaccination-schedule`, signal)
  return data.schedule
}

export async function getCertificates(patientId: number, signal?: AbortSignal): Promise<CertificateItem[]> {
  const data = await request<{ certificates: CertificateItem[] }>('GET', `/patient/${patientId}/vaccination-certificate`, signal)
  return data.certificates
}

export function getPdfUrl(patientId: number): string {
  return `${BASE_URL}/patient/${patientId}/vaccination-report/pdf`
}
