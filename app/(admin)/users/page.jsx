
import { UsersTable } from "@/components/admin/users-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, Clock } from "lucide-react"

const userStats = [
  {
    title: "Total Utilisateurs",
    value: "2,847",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Vérifiés",
    value: "2,456",
    icon: UserCheck,
    color: "text-green-600",
  },
  {
    title: "En Attente",
    value: "312",
    icon: Clock,
    color: "text-orange-600",
  },
  {
    title: "Suspendus",
    value: "79",
    icon: UserX,
    color: "text-red-600",
  },
]

export default function UsersPage() {
  return (
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
            <p className="text-muted-foreground">Gérez tous les utilisateurs de votre plateforme de colocation.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {userStats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <UsersTable />
        </div>
  )
}
