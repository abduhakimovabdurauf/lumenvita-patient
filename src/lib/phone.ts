/**
 * Formats a raw phone input into a country-specific display format.
 * Supports +998 (Uzbekistan), +7 (Russia/Kazakhstan), and generic fallback.
 * The backend normalises digits server-side, so sending the formatted string is safe.
 */
export function formatPhoneNumber(raw: string): string {
  // Strip everything except digits
  const digits = raw.replace(/\D/g, '')

  if (!digits) return ''

  // ─── Uzbekistan: +998 XX XXX XX XX (9 local digits) ───────────────────────
  if (digits.startsWith('998')) {
    const d = digits.slice(3, 12)
    let r = '+998'
    if (d.length > 0) r += ' '  + d.slice(0, 2)
    if (d.length > 2) r += ' '  + d.slice(2, 5)
    if (d.length > 5) r += ' '  + d.slice(5, 7)
    if (d.length > 7) r += ' '  + d.slice(7, 9)
    return r
  }

  // ─── Russia / Kazakhstan: +7 (XXX) XXX-XX-XX (10 local digits) ────────────
  if (digits.startsWith('7') && digits.length > 1) {
    const d = digits.slice(1, 11)
    let r = '+7'
    if (d.length > 0) r += ' (' + d.slice(0, 3)
    if (d.length >= 3) r += ')'
    if (d.length > 3) r += ' '  + d.slice(3, 6)
    if (d.length > 6) r += '-'  + d.slice(6, 8)
    if (d.length > 8) r += '-'  + d.slice(8, 10)
    return r
  }

  // ─── Generic fallback: +[up to 15 digits] ─────────────────────────────────
  return '+' + digits.slice(0, 15)
}

/** Returns only the digits from a formatted phone string. */
export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '')
}
