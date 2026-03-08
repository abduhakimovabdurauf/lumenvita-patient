import { useHistory } from '@/hooks/usePatientQueries'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  patientId: number
}

function formatDate(d: string | null) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}.${m}.${y}`
}

export default function VaccinationHistory({ patientId }: Props) {
  const { data: items, isPending, error } = useHistory(patientId)

  if (isPending) return (
    <p className="py-10 text-center text-sm text-muted-foreground">Загрузка…</p>
  )
  if (error) return (
    <p className="py-10 text-center text-sm text-destructive">{error.message}</p>
  )
  if (!items?.length) return (
    <p className="py-10 text-center text-sm text-muted-foreground">Прививок не найдено</p>
  )

  return (
    <div className="flex flex-col gap-3">
      {items.map(item => (
        <Card key={item.step_id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold leading-snug">{item.vaccine_name ?? '—'}</span>
              <Badge variant="success" className="shrink-0">Провакцинирован(а)</Badge>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">{formatDate(item.date)}</p>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {item.scheme_name  && <span>Схема: {item.scheme_name}</span>}
              {item.step_number != null && <span>Доза #{item.step_number}</span>}
              {item.dose_name    && <span>{item.dose_name}</span>}
              {item.doctor_name  && <span>Врач: {item.doctor_name}</span>}
              {item.serie        && <span>Серия: {item.serie}</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
