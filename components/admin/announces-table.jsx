"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Eye, MapPin, Euro, Search, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const announces = [
  {
    id: 1,
    title: "Appartement 3 pièces - Centre ville",
    location: "Paris 11ème",
    price: 850,
    owner: {
      name: "Marie Dubois",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "pending",
    submittedAt: "2024-03-20",
    images: 5,
    type: "Appartement",
  },
  {
    id: 2,
    title: "Studio moderne avec balcon",
    location: "Lyon 6ème",
    price: 650,
    owner: {
      name: "Thomas Martin",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "approved",
    submittedAt: "2024-03-18",
    images: 8,
    type: "Studio",
  },
  {
    id: 3,
    title: "Chambre dans colocation",
    location: "Marseille 2ème",
    price: 450,
    owner: {
      name: "Sophie Laurent",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "approved",
    submittedAt: "2024-03-15",
    images: 3,
    type: "Chambre",
  },
  {
    id: 4,
    title: "Maison avec jardin",
    location: "Toulouse 3ème",
    price: 1200,
    owner: {
      name: "Pierre Durand",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "rejected",
    submittedAt: "2024-03-12",
    images: 12,
    type: "Maison",
  },
  {
    id: 5,
    title: "Loft industriel",
    location: "Bordeaux Centre",
    price: 950,
    owner: {
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "pending",
    submittedAt: "2024-03-19",
    images: 6,
    type: "Loft",
  },
]

const getStatusBadge = (status) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-100 text-green-800">Approuvée</Badge>
    case "pending":
      return <Badge variant="outline">En attente</Badge>
    case "rejected":
      return <Badge variant="destructive">Rejetée</Badge>
    default:
      return <Badge variant="secondary">Inconnu</Badge>
  }
}

export function AnnouncesTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredAnnounces = announces.filter((announce) => {
    const matchesSearch =
      announce.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announce.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announce.owner.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || announce.status === statusFilter
    const matchesType = typeFilter === "all" || announce.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleApprove = (id) => {
    console.log(`Approving announce ${id}`)
  }

  const handleReject = (id) => {
    console.log(`Rejecting announce ${id}`)
  }

  const handleView = (id) => {
    console.log(`Viewing announce ${id}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Toutes les Annonces</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une annonce..."
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
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="approved">Approuvées</SelectItem>
              <SelectItem value="rejected">Rejetées</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="Appartement">Appartement</SelectItem>
              <SelectItem value="Studio">Studio</SelectItem>
              <SelectItem value="Chambre">Chambre</SelectItem>
              <SelectItem value="Maison">Maison</SelectItem>
              <SelectItem value="Loft">Loft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Annonce</TableHead>
              <TableHead>Propriétaire</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnnounces.map((announce) => (
              <TableRow key={announce.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <img
                        src="/placeholder.svg?height=48&width=48"
                        alt={announce.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{announce.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {announce.location}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {announce.type} • {announce.images} photos
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={announce.owner.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {announce.owner.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{announce.owner.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Euro className="h-3 w-3" />
                    {announce.price}€/mois
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(announce.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(announce.submittedAt).toLocaleDateString("fr-FR")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleView(announce.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {announce.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(announce.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(announce.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir détails</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredAnnounces.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">Aucune annonce trouvée avec ces critères.</div>
        )}
      </CardContent>
    </Card>
  )
}
