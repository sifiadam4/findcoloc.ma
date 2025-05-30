"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Users, Search, Shield, ShieldCheck, AlertTriangle } from "lucide-react"

const users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "verified",
    joinedAt: "15 mars 2024",
    properties: 2,
    type: "Propriétaire",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "pending",
    joinedAt: "20 mars 2024",
    properties: 0,
    type: "Locataire",
  },
  {
    id: 3,
    name: "Claire Martin",
    email: "claire.martin@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "verified",
    joinedAt: "10 mars 2024",
    properties: 1,
    type: "Propriétaire",
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.wilson@email.com",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "suspended",
    joinedAt: "5 mars 2024",
    properties: 0,
    type: "Locataire",
  },
]

const getStatusBadge = (status) => {
  switch (status) {
    case "verified":
      return (
        <Badge className="bg-green-100 text-green-800">
          <ShieldCheck className="h-3 w-3 mr-1" />
          Vérifié
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline">
          <Shield className="h-3 w-3 mr-1" />
          En attente
        </Badge>
      )
    case "suspended":
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Suspendu
        </Badge>
      )
    default:
      return <Badge variant="secondary">Inconnu</Badge>
  }
}

export function UsersManagement() {
  const handleVerifyUser = (id) => {
    console.log(`Verifying user ${id}`)
  }

  const handleSuspendUser = (id) => {
    console.log(`Suspending user ${id}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gestion des Utilisateurs
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un utilisateur..." className="pl-8" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{user.name}</h4>
                    {getStatusBadge(user.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Inscrit le {user.joinedAt}</span>
                    <span>{user.type}</span>
                    <span>{user.properties} propriété(s)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {user.status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => handleVerifyUser(user.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Vérifier
                  </Button>
                )}
                {user.status === "verified" && (
                  <Button variant="outline" size="sm" onClick={() => handleSuspendUser(user.id)}>
                    Suspendre
                  </Button>
                )}
                {user.status === "suspended" && (
                  <Button size="sm" onClick={() => handleVerifyUser(user.id)}>
                    Réactiver
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
