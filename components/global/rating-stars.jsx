"use client"

import { Star } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

// Utilisation de l'export par défaut
export default function RatingStars({
  rating = 0,
  maxRating = 5,
  size = "md",
  onChange,
  readOnly = false,
}) {
  const [hoverRating, setHoverRating] = useState(0)
  const [currentRating, setCurrentRating] = useState(rating)

  const handleMouseEnter = (index) => {
    if (readOnly) return
    setHoverRating(index)
  }

  const handleMouseLeave = () => {
    if (readOnly) return
    setHoverRating(0)
  }

  const handleClick = (index) => {
    if (readOnly) return
    setCurrentRating(index)
    if (onChange) {
      onChange(index)
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4"
      case "lg":
        return "w-8 h-8"
      case "md":
      default:
        return "w-6 h-6"
    }
  }

  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1
        const isActive = readOnly ? starValue <= rating : starValue <= (hoverRating || currentRating)

        return (
          <Star
            key={index}
            className={cn(
              getSizeClass(),
              "cursor-pointer transition-all duration-200",
              isActive ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
              !readOnly && "hover:scale-110",
            )}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
          />
        )
      })}
    </div>
  )
}

// Ajout d'un export nommé pour plus de compatibilité
export { RatingStars }
