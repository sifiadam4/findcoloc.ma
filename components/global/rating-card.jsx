"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import RatingStars from "@/components/global/rating-stars"


export default function RatingCard({ rating }) {
  const { userName, userImage, rating: ratingValue, comment, date } = rating

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar>
          <AvatarImage src={userImage || "/placeholder.svg?height=40&width=40"} alt={userName} />
          <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-medium">{userName}</p>
          <div className="flex items-center gap-2">
            <RatingStars rating={ratingValue} size="sm" readOnly />
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(date, { addSuffix: true, locale: fr })}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{comment}</p>
      </CardContent>
    </Card>
  )
}

export { RatingCard }
