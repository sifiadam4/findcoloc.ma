"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RatingCard } from "@/components/global/rating-card"
import Link from "next/link"

export default function EvaluationsPage() {
  const [activeTab, setActiveTab] = useState("received")

  // Données fictives pour la démonstration
  const receivedRatings = [
    {
      id: "1",
      userId: "user1",
      userName: "Sophie Martin",
      userImage: "/placeholder.svg?height=40&width=40",
      rating: 4,
      comment: "Très bon colocataire, respectueux et sympathique. Je recommande !",
      date: new Date(2023, 5, 15),
    },
    {
      id: "2",
      userId: "user2",
      userName: "Thomas Dubois",
      userImage: "/placeholder.svg?height=40&width=40",
      rating: 5,
      comment: "Excellent séjour, appartement propre et bien situé. Merci !",
      date: new Date(2023, 4, 20),
    },
  ]

  const givenRatings = [
    {
      id: "3",
      userId: "user3",
      userName: "Julie Leroy",
      userImage: "/placeholder.svg?height=40&width=40",
      rating: 5,
      comment: "Appartement parfait, Julie est une hôte attentionnée et disponible.",
      date: new Date(2023, 3, 10),
    },
  ]

  const pendingRatings = [
    {
      id: "4",
      userId: "user4",
      userName: "Lucas Bernard",
      userImage: "/placeholder.svg?height=40&width=40",
      colocationId: "coloc1",
      colocationTitle: "Appartement centre-ville",
      endDate: new Date(2023, 6, 1),
    },
    {
      id: "5",
      userId: "user5",
      userName: "Emma Petit",
      userImage: "/placeholder.svg?height=40&width=40",
      colocationId: "coloc2",
      colocationTitle: "Studio proche campus",
      endDate: new Date(2023, 5, 25),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl tracking-tighter font-bold text-foreground">Mes évaluations</h1>

      <Tabs defaultValue="received" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="received">Reçues</TabsTrigger>
          <TabsTrigger value="given">Données</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
        </TabsList>

        <TabsContent value="received">
          {receivedRatings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {receivedRatings.map((rating) => (
                <RatingCard key={rating.id} rating={rating} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <p className="mb-4 text-lg font-medium">Vous n'avez pas encore reçu d'évaluations</p>
                <p className="mb-6 text-muted-foreground">
                  Les évaluations apparaîtront ici une fois que vos colocataires ou propriétaires vous auront évalué.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="given">
          {givenRatings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {givenRatings.map((rating) => (
                <RatingCard key={rating.id} rating={rating} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <p className="mb-4 text-lg font-medium">Vous n'avez pas encore donné d'évaluations</p>
                <p className="mb-6 text-muted-foreground">
                  Partagez votre expérience en évaluant vos anciens colocataires ou propriétaires.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending">
          {pendingRatings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingRatings.map((pending) => (
                <Card key={pending.id}>
                  <CardContent className="flex flex-col p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <img
                        src={pending.userImage || "/placeholder.svg"}
                        alt={pending.userName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{pending.userName}</h3>
                        <p className="text-sm text-muted-foreground">{pending.colocationTitle}</p>
                      </div>
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Colocation terminée le {pending.endDate.toLocaleDateString()}
                    </p>
                    <Link href={`/evaluations/${pending.id}`}>
                      <Button className="w-full bg-primary hover:bg-primary/90">Évaluer</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <p className="mb-4 text-lg font-medium">Aucune évaluation en attente</p>
                <p className="mb-6 text-muted-foreground">
                  Vous serez invité à évaluer vos colocataires ou propriétaires après la fin de votre colocation.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
