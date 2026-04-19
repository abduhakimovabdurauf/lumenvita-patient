const PHONE_KEY = 'lv_phone_token'
const TTL = 60 * 60 * 1000 // 1 hour in ms

interface PhoneToken {
  phone: string
  savedAt: number
}

export function savePhoneToken(phone: string): void {
  const token: PhoneToken = { phone, savedAt: Date.now() }
  localStorage.setItem(PHONE_KEY, JSON.stringify(token))
}

export function loadPhoneToken(): string | null {
  try {
    const raw = localStorage.getItem(PHONE_KEY)
    if (!raw) return null

    const token: PhoneToken = JSON.parse(raw)
    if (Date.now() - token.savedAt > TTL) {
      localStorage.removeItem(PHONE_KEY)
      return null
    }

    return token.phone
  } catch {
    localStorage.removeItem(PHONE_KEY)
    return null
  }
}

export function clearPhoneToken(): void {
  localStorage.removeItem(PHONE_KEY)
}
