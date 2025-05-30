"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, Eye, MapPin, Euro, FileText } from "lucide-react"

const pendingProperties = [
  {
    id: 1,
    title: "Appartement 3 pièces - Centre ville",
    location: "Paris 11ème",
    price: 850,
    owner: {
      name: "Marie Dubois",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    submittedAt: "Il y a 2 heures",
    images: 5,
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
    submittedAt: "Il y a 4 heures",
    images: 8,
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
    submittedAt: "Il y a 1 jour",
    images: 3,
  },
]

export function PendingProperties() {
  const handleApprove = (id) => {
    console.log(`Approving property ${id}`)
  }

  const handleReject = (id) => {
    console.log(`Rejecting property ${id}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Annonces en Attente de Validation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingProperties.map((property) => (
          <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=64&width=64"
                  alt={property.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">{property.title}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {property.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Euro className="h-3 w-3" />
                    {property.price}€/mois
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={property.owner.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {property.owner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{property.owner.name}</span>
                  <Badge variant="outline">{property.images} photos</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{property.submittedAt}</span>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReject(property.id)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={() => handleApprove(property.id)} className="bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
