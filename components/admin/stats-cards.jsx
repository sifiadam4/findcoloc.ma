import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, CheckCircle, XCircle } from "lucide-react"

const stats = [
  {
    title: "Utilisateurs Total",
    value: "2,847",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Annonces en Attente",
    value: "23",
    change: "+5",
    icon: FileText,
    color: "text-orange-600",
  },
  {
    title: "Annonces Approuvées",
    value: "156",
    change: "+8%",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Annonces Rejetées",
    value: "12",
    change: "-2",
    icon: XCircle,
    color: "text-red-600",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>{stat.change}</span>{" "}
              depuis le mois dernier
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
