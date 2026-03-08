import { useSchedule } from '@/hooks/usePatientQueries'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { BadgeProps } from '@/components/ui/badge'

interface Props {
  patientId: number
}

function formatDate(d: string | null) {
  if (!d) return 'Дата не назначена'
  const [y, m, day] = d.split('-')
  return `${day}.${m}.${y}`
}

function DaysLabel({ days }: { days: number | null }) {
  if (days === null) return null

  let variant: BadgeProps['variant']
  let label: string

  if (days > 0)       { variant = 'warning'; label = `Через ${days} дн.` }
  else if (days === 0) { variant = 'warning'; label = 'Сегодня' }
  else                 { variant = 'danger';  label = `Просрочено на ${Math.abs(days)} дн.` }

  return <Badge variant={variant} className="shrink-0">{label}</Badge>
}

export default function VaccinationSchedule({ patientId }: Props) {
  const { data: items, isPending, error } = useSchedule(patientId)

  if (isPending) return (
    <p className="py-10 text-center text-sm text-muted-foreground">Загрузка…</p>
  )
  if (error) return (
    <p className="py-10 text-center text-sm text-destructive">{error.message}</p>
  )
  if (!items?.length) return (
    <p className="py-10 text-center text-sm text-muted-foreground">Предстоящих прививок нет</p>
  )

  return (
    <div className="flex flex-col gap-3">
      {items.map(item => (
        <Card key={item.step_id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold leading-snug">{item.vaccine_name ?? '—'}</span>
              <DaysLabel days={item.days_remaining} />
            </div>

            <p className="mt-1 text-sm text-muted-foreground">{formatDate(item.scheduled_date)}</p>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {item.scheme_name   && <span>Схема: {item.scheme_name}</span>}
              {item.step_number != null && <span>Доза #{item.step_number}</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
