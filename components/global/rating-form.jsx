"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import RatingStars from "./rating-stars"


export default function RatingForm({
  onSubmit,
  title = "Laisser une évaluation",
  submitLabel = "Soumettre",
  initialRating = 0,
  initialComment = "",
}) {
  const [rating, setRating] = useState(initialRating)
  const [comment, setComment] = useState(initialComment)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return

    setIsSubmitting(true)
    try {
      await onSubmit(rating, comment)
      // Réinitialiser le formulaire après soumission réussie
      if (initialRating === 0 && initialComment === "") {
        setRating(0)
        setComment("")
      }
    } catch (error) {
      console.error("Erreur lors de la soumission de l'évaluation:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="rating" className="text-sm font-medium">
            Note
          </label>
          <RatingStars rating={rating} onChange={setRating} size="lg" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="comment" className="text-sm font-medium">
            Commentaire
          </label>
          <Textarea
            id="comment"
            placeholder="Partagez votre expérience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? "Envoi en cours..." : submitLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { RatingForm }
