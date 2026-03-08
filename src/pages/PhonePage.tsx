import { useState } from 'react'
import { Syringe } from 'lucide-react'
import { identifyPatient, PatientSummary } from '@/api/patient'
import { formatPhoneNumber, digitsOnly } from '@/lib/phone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  onSelect: (patient: PatientSummary) => void
}

export default function PhonePage({ onSelect }: Props) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [patients, setPatients] = useState<PatientSummary[] | null>(null)

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
    setError(null)
    setPatients(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (digitsOnly(phone).length < 7) return

    setError(null)
    setPatients(null)
    setLoading(true)

    try {
      const results = await identifyPatient(phone)
      if (results.length === 1) {
        onSelect(results[0])
      } else {
        setPatients(results)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Пациент не найден')
    } finally {
      setLoading(false)
    }
  }

  function formatDob(dob: string | null) {
    if (!dob) return ''
    const [y, m, d] = dob.split('-')
    return `${d}.${m}.${y}`
  }

  const canSubmit = !loading && digitsOnly(phone).length >= 7

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-5 py-10">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
          <Syringe size={28} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">LumenVita</h1>
        <p className="text-center text-sm text-muted-foreground leading-relaxed">
          Введите номер телефона, чтобы<br />найти свою карточку вакцинации
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3">
        <Input
          type="tel"
          placeholder="+998 90 123 45 67"
          value={phone}
          onChange={handlePhoneChange}
          className="h-12 text-base"
          autoFocus
        />
        <Button type="submit" size="lg" className="w-full" disabled={!canSubmit}>
          {loading ? 'Поиск…' : 'Найти'}
        </Button>
      </form>

      {error && (
        <p className="text-center text-sm text-destructive">{error}</p>
      )}

      {patients && patients.length > 1 && (
        <div className="w-full max-w-sm">
          <p className="mb-3 text-center text-sm text-muted-foreground">
            Найдено несколько записей — выберите свою:
          </p>
          <div className="flex flex-col gap-2">
            {patients.map(p => (
              <Card
                key={p.id}
                className="cursor-pointer transition-colors hover:bg-accent"
                onClick={() => onSelect(p)}
              >
                <CardContent className="p-4">
                  <p className="font-semibold">{p.full_name}</p>
                  {p.date_of_birth && (
                    <p className="text-sm text-muted-foreground">
                      Дата рождения: {formatDob(p.date_of_birth)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
