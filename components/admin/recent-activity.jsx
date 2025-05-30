import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle, XCircle, UserPlus, FileText } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "property_approved",
    user: "Marie Dubois",
    action: "Annonce approuvée",
    target: "Appartement 3 pièces - Paris 11ème",
    time: "Il y a 10 minutes",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "user_registered",
    user: "Thomas Martin",
    action: "Nouvel utilisateur inscrit",
    target: "",
    time: "Il y a 25 minutes",
    icon: UserPlus,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "property_rejected",
    user: "Sophie Laurent",
    action: "Annonce rejetée",
    target: "Studio - Marseille 2ème",
    time: "Il y a 1 heure",
    icon: XCircle,
    color: "text-red-600",
  },
  {
    id: 4,
    type: "property_submitted",
    user: "Pierre Durand",
    action: "Nouvelle annonce soumise",
    target: "Colocation 4 chambres - Lyon 3ème",
    time: "Il y a 2 heures",
    icon: FileText,
    color: "text-orange-600",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activité Récente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-sm text-muted-foreground">{activity.action}</span>
                </div>
                {activity.target && <p className="text-sm text-muted-foreground">{activity.target}</p>}
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
