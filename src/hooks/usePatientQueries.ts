import { useQuery } from '@tanstack/react-query'
import {
  getProfile,
  getHistory,
  getSchedule,
  getCertificates,
} from '../api/patient'

export const patientKeys = {
  profile:      (id: number) => ['patient', id, 'profile']      as const,
  history:      (id: number) => ['patient', id, 'history']      as const,
  schedule:     (id: number) => ['patient', id, 'schedule']     as const,
  certificates: (id: number) => ['patient', id, 'certificates'] as const,
}

export function useProfile(patientId: number) {
  return useQuery({
    queryKey: patientKeys.profile(patientId),
    queryFn: ({ signal }) => getProfile(patientId, signal),
  })
}

export function useHistory(patientId: number) {
  return useQuery({
    queryKey: patientKeys.history(patientId),
    queryFn: ({ signal }) => getHistory(patientId, signal),
  })
}

export function useSchedule(patientId: number) {
  return useQuery({
    queryKey: patientKeys.schedule(patientId),
    queryFn: ({ signal }) => getSchedule(patientId, signal),
  })
}

export function useCertificates(patientId: number) {
  return useQuery({
    queryKey: patientKeys.certificates(patientId),
    queryFn: ({ signal }) => getCertificates(patientId, signal),
  })
}
