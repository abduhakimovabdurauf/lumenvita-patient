import { useState } from 'react'
import { clearSession } from './lib/session'
import PhonePage from './pages/PhonePage'
import QueueStatusPage from './pages/QueueStatusPage'
// ProfilePage is temporarily disabled — vaccination report features will be re-enabled later
// import { PatientSummary } from './api/patient'
// import ProfilePage from './pages/ProfilePage'

export default function App() {
  const [phone, setPhone] = useState<string | null>(null)

  function handlePhoneSubmit(submittedPhone: string) {
    clearSession()

    if (window.Telegram?.WebApp?.BackButton) {
      window.Telegram.WebApp.BackButton.show()
      window.Telegram.WebApp.BackButton.onClick(() => {
        setPhone(null)
        window.Telegram?.WebApp?.BackButton?.hide()
      })
    }

    setPhone(submittedPhone)
  }

  function handleBack() {
    setPhone(null)
    if (window.Telegram?.WebApp?.BackButton) {
      window.Telegram.WebApp.BackButton.hide()
    }
  }

  if (phone) {
    return <QueueStatusPage phone={phone} onBack={handleBack} />
  }

  return <PhonePage onPhoneSubmit={handlePhoneSubmit} />
}
