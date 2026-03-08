import { useState } from 'react'
import { PatientSummary } from './api/patient'
import { saveSession, loadSession, clearSession } from './lib/session'
import PhonePage from './pages/PhonePage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  const [patient, setPatient] = useState<PatientSummary | null>(() => loadSession())

  function handleSelect(p: PatientSummary) {
    saveSession(p)

    if (window.Telegram?.WebApp?.BackButton) {
      window.Telegram.WebApp.BackButton.show()
      window.Telegram.WebApp.BackButton.onClick(() => {
        clearSession()
        setPatient(null)
        window.Telegram?.WebApp?.BackButton?.hide()
      })
    }

    setPatient(p)
  }

  if (patient) {
    return <ProfilePage patientId={patient.id} />
  }

  return <PhonePage onSelect={handleSelect} />
}
