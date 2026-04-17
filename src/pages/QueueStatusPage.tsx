import { useEffect, useState, useCallback } from 'react'
import { getQueueStatus, QueueStatus } from '@/api/patient'
import { digitsOnly } from '@/lib/phone'
import { Loader2, Clock, Bell, Stethoscope, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  phone: string
  onBack: () => void
}

export default function QueueStatusPage({ phone, onBack }: Props) {
  const [status, setStatus] = useState<QueueStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = useCallback(async (signal?: AbortSignal) => {
    try {
      const data = await getQueueStatus(digitsOnly(phone), signal)
      setStatus(data)
      setError(null)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError('Не удалось получить данные')
    } finally {
      setLoading(false)
    }
  }, [phone])

  useEffect(() => {
    const controller = new AbortController()
    fetchStatus(controller.signal)

    const interval = setInterval(() => fetchStatus(), 10_000)

    return () => {
      controller.abort()
      clearInterval(interval)
    }
  }, [fetchStatus])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-5 py-10">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-xl font-bold tracking-tight">Статус в очереди</h1>
        <p className="text-sm text-muted-foreground">{phone}</p>
      </div>

      {loading && (
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      )}

      {!loading && error && (
        <Card className="w-full max-w-sm">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <AlertCircle className="size-10 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && status && !status.found && (
        <Card className="w-full max-w-sm">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <Clock className="size-10 text-muted-foreground" />
            <p className="font-semibold">Вы не в очереди</p>
            <p className="text-sm text-muted-foreground">
              По этому номеру активная запись не найдена
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && status?.found && (
        <Card className={`w-full max-w-sm ${status.status === 'called' ? 'border-blue-500 ring-2 ring-blue-400' : ''}`}>
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
            {status.status === 'waiting' && (
              <>
                <Clock className="size-10 text-muted-foreground" />
                <div>
                  <p className="text-3xl font-bold">#{status.position}</p>
                  <p className="text-sm text-muted-foreground mt-1">ваш номер в очереди</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {status.ahead === 0
                    ? 'Вы следующий!'
                    : `Впереди: ${status.ahead} ${pluralPeople(status.ahead ?? 0)}`}
                </p>
              </>
            )}

            {status.status === 'called' && (
              <>
                <Bell className="size-10 animate-bounce text-blue-500" />
                <p className="text-xl font-bold text-blue-600">Вас вызывают!</p>
                <p className="text-sm text-muted-foreground">Подойдите к стойке</p>
              </>
            )}

            {status.status === 'in_progress' && (
              <>
                <Stethoscope className="size-10 text-green-500" />
                <p className="text-xl font-bold text-green-600">Вы на приёме</p>
              </>
            )}

            {status.name && (
              <p className="text-sm text-muted-foreground border-t pt-3 w-full">{status.name}</p>
            )}
          </CardContent>
        </Card>
      )}

      <Button variant="ghost" size="sm" onClick={onBack}>
        ← Назад
      </Button>
    </div>
  )
}

function pluralPeople(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'человек'
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'человека'
  return 'человек'
}
