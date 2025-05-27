"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { RatingForm } from "@/components/global/rating-form"
import Link from "next/link"


export default function EvaluationPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Données fictives pour la démonstration
  const pendingEvaluation = {
    id,
    userId: "user4",
    userName: "Lucas Bernard",
    userImage: "/placeholder.svg?height=100&width=100",
    colocationId: "coloc1",
    colocationTitle: "Appartement centre-ville",
    colocationImage: "/placeholder.svg?height=300&width=500",
    startDate: new Date(2023, 0, 15),
    endDate: new Date(2023, 6, 1),
  }

  const handleSubmitRating = async (rating, comment) => {
    setIsSubmitting(true)

    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Évaluation soumise:", { userId: pendingEvaluation.userId, rating, comment })

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Rediriger après un court délai
    setTimeout(() => {
      router.push("/evaluations")
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/evaluations" className="mb-6 flex items-center text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux évaluations
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Évaluer votre expérience</h1>

      {isSubmitted ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <h2 className="mb-4 text-xl font-semibold text-green-600">Évaluation envoyée avec succès !</h2>
            <p className="mb-6 text-muted-foreground">
              Merci d'avoir partagé votre expérience. Vous allez être redirigé vers la page des évaluations.
            </p>
            <Link href="/evaluations">
              <Button>Retour aux évaluations</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 aspect-video w-full overflow-hidden rounded-md">
                <img
                  src={pendingEvaluation.colocationImage || "/placeholder.svg"}
                  alt={pendingEvaluation.colocationTitle}
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="mb-2 text-xl font-semibold">{pendingEvaluation.colocationTitle}</h2>
              <div className="mb-4 flex items-center gap-3">
                <img
                  src={pendingEvaluation.userImage || "/placeholder.svg"}
                  alt={pendingEvaluation.userName}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="font-medium">{pendingEvaluation.userName}</span>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  Début: <span className="font-medium">{pendingEvaluation.startDate.toLocaleDateString()}</span>
                </p>
                <p>
                  Fin: <span className="font-medium">{pendingEvaluation.endDate.toLocaleDateString()}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <RatingForm
            onSubmit={handleSubmitRating}
            title={`Évaluer ${pendingEvaluation.userName}`}
            submitLabel="Envoyer l'évaluation"
          />
        </div>
      )}
    </div>
  )
}
