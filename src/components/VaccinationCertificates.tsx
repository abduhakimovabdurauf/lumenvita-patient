import { useCertificates } from '@/hooks/usePatientQueries'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  patientId: number
}

function formatDate(d: string | null) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}.${m}.${y}`
}

export default function VaccinationCertificates({ patientId }: Props) {
  const { data: items, isPending, error } = useCertificates(patientId)

  if (isPending) return (
    <p className="py-10 text-center text-sm text-muted-foreground">Загрузка…</p>
  )
  if (error) return (
    <p className="py-10 text-center text-sm text-destructive">{error.message}</p>
  )
  if (!items?.length) return (
    <p className="py-10 text-center text-sm text-muted-foreground">Сертификатов нет</p>
  )

  return (
    <div className="flex flex-col gap-3">
      {items.map(item => (
        <Card key={`${item.id}-${item.order_id}`}>
          <CardContent className="p-4">
            <p className="font-semibold">{item.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">Дата: {formatDate(item.order_date)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Заказ #{item.order_id}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
