import { Download, Phone, Calendar, User } from 'lucide-react'
import { getPdfUrl } from '@/api/patient'
import { useProfile } from '@/hooks/usePatientQueries'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import VaccinationHistory from '@/components/VaccinationHistory'
import VaccinationSchedule from '@/components/VaccinationSchedule'

interface Props {
  patientId: number
}

function formatDob(dob: string | null) {
  if (!dob) return null
  const [y, m, d] = dob.split('-')
  return `${d}.${m}.${y}`
}

export default function ProfilePage({ patientId }: Props) {
  const { data: profile, isPending, error } = useProfile(patientId)

  if (isPending) return (
    <div className="flex min-h-dvh items-center justify-center">
      <p className="text-sm text-muted-foreground">Загрузка…</p>
    </div>
  )
  if (error) return (
    <div className="flex min-h-dvh items-center justify-center px-5">
      <p className="text-center text-sm text-destructive">{error.message}</p>
    </div>
  )
  if (!profile) return null

  const dobStr = formatDob(profile.date_of_birth)

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-5">

      {/* Patient card */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User size={20} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold leading-snug">{profile.full_name}</p>
              {profile.age != null && (
                <p className="text-sm text-muted-foreground">{profile.age} лет</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1.5">
            {dobStr && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={14} className="shrink-0" />
                <span>Дата рождения: {dobStr}</span>
              </div>
            )}
            {profile.phones.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={14} className="shrink-0" />
                <span>{profile.phones.join(', ')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="history">
        <TabsList className="w-full">
          <TabsTrigger value="history"  className="flex-1">История</TabsTrigger>
          <TabsTrigger value="schedule" className="flex-1">Расписание</TabsTrigger>
          {/* <TabsTrigger value="certificates" className="flex-1">Сертификаты</TabsTrigger> */}
        </TabsList>

        <TabsContent value="history">
          <VaccinationHistory patientId={patientId} />
        </TabsContent>

        <TabsContent value="schedule">
          <VaccinationSchedule patientId={patientId} />
        </TabsContent>

        {/* Uncomment when certificates tab is re-enabled:
        <TabsContent value="certificates">
          <VaccinationCertificates patientId={patientId} />
        </TabsContent> */}
      </Tabs>

      {/* PDF download */}
      <Button variant="outline" size="lg" className="w-full" asChild>
        <a href={getPdfUrl(patientId)} target="_blank" rel="noopener noreferrer">
          <Download size={16} />
          Скачать PDF-отчёт
        </a>
      </Button>

    </div>
  )
}
