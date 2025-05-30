"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Shield, ShieldCheck, AlertTriangle, MoreHorizontal, Mail, Phone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    phone: "+33 6 12 34 56 78",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "verified",
    joinedAt: "2024-03-15",
    properties: 2,
    type: "Propriétaire",
    lastActive: "2024-03-20",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@email.com",
    phone: "+33 6 98 76 54 32",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "pending",
    joinedAt: "2024-03-20",
    properties: 0,
    type: "Locataire",
    lastActive: "2024-03-20",
  },
  {
    id: 3,
    name: "Claire Martin",
    email: "claire.martin@email.com",
    phone: "+33 6 11 22 33 44",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "verified",
    joinedAt: "2024-03-10",
    properties: 1,
    type: "Propriétaire",
    lastActive: "2024-03-19",
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+33 6 55 66 77 88",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "suspended",
    joinedAt: "2024-03-05",
    properties: 0,
    type: "Locataire",
    lastActive: "2024-03-15",
  },
  {
    id: 5,
    name: "Emma Brown",
    email: "emma.brown@email.com",
    phone: "+33 6 99 88 77 66",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "verified",
    joinedAt: "2024-02-28",
    properties: 3,
    type: "Propriétaire",
    lastActive: "2024-03-20",
  },
  {
    id: 6,
    name: "Frank Davis",
    email: "frank.davis@email.com",
    phone: "+33 6 44 33 22 11",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "pending",
    joinedAt: "2024-03-18",
    properties: 0,
    type: "Locataire",
    lastActive: "2024-03-18",
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

export function UsersTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesType = typeFilter === "all" || user.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleVerifyUser = (id) => {
    console.log(`Verifying user ${id}`)
  }

  const handleSuspendUser = (id) => {
    console.log(`Suspending user ${id}`)
  }

  const handleReactivateUser = (id) => {
    console.log(`Reactivating user ${id}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tous les Utilisateurs</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="verified">Vérifiés</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="suspended">Suspendus</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="Propriétaire">Propriétaires</SelectItem>
              <SelectItem value="Locataire">Locataires</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Propriétés</TableHead>
              <TableHead>Inscription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Dernière activité: {new Date(user.lastActive).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {user.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{user.type}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  <span className="font-medium">{user.properties}</span>
                  <span className="text-sm text-muted-foreground ml-1">propriété{user.properties > 1 ? "s" : ""}</span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.joinedAt).toLocaleDateString("fr-FR")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
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
                      <Button size="sm" onClick={() => handleReactivateUser(user.id)}>
                        Réactiver
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir profil</DropdownMenuItem>
                        <DropdownMenuItem>Envoyer message</DropdownMenuItem>
                        <DropdownMenuItem>Historique</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Supprimer compte</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">Aucun utilisateur trouvé avec ces critères.</div>
        )}
      </CardContent>
    </Card>
  )
}
