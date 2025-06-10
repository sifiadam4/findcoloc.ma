"use client";

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ReviewCard({ review }) {
  // Make sure we have a valid review object
  if (!review) {
    console.error("ReviewCard received invalid review:", review);
    return null;
  }

  // Convert null or undefined comment to empty string
  const reviewComment = review.comment || "";

  const formattedDate = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-3">
        {/* Author info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={review.author?.image} />
            <AvatarFallback>
              {review.author?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {review.author?.name || "Utilisateur anonyme"}
            </p>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
        {/* Rating stars */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-200"
              }`}
            />
          ))}
        </div>{" "}
        {/* Review comment */}
        {reviewComment && reviewComment.trim() !== "" ? (
          <div className="text-sm text-gray-700">{reviewComment}</div>
        ) : (
          <div className="text-sm italic text-gray-500">Aucun commentaire</div>
        )}
      </CardContent>
    </Card>
  );
}
