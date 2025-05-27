"use client";

import { useState } from "react";
import { Star, User, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReviewsTab({ reviews, rating, isCurrentUser }) {
  const [showAddReview, setShowAddReview] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [filter, setFilter] = useState("all");

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    if (filter === "positive") return review.rating >= 4;
    if (filter === "negative") return review.rating < 4;
    return true;
  });
  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'envoi de l'avis
    console.log("Avis envoyé:", { rating: newRating, comment });
    setShowAddReview(false);
    setNewRating(0);
    setComment("");
  };

  // Generate stars for rating
  const renderStars = (rating, interactive = false) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        stars.push(
          <Star
            key={i}
            className={`h-6 w-6 cursor-pointer ${
              i <= (hoverRating || newRating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setNewRating(i)}
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            className={`h-4 w-4 ${
              i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        );
      }
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold mr-4">
            Avis ({reviews.length})
          </h2>
          <div className="flex items-center">
            <div className="flex mr-2">{renderStars(rating)}</div>
            <span className="font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-700 mr-2">Filtrer:</span>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="Tous les avis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les avis</SelectItem>
              <SelectItem value="positive">Avis positifs</SelectItem>
              <SelectItem value="negative">Avis négatifs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews list */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun avis ne correspond à ce filtre.</p>
        </div>
      ) : (
        <div className="space-y-6 mb-8">
          {" "}
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
            >
              <div className="flex items-start">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={review.author.image || "/placeholder.svg"}
                    alt={review.author.name}
                  />
                  <AvatarFallback>
                    <User className="h-5 w-5 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{review.author.name}</div>
                  <div className="text-gray-500 text-sm">
                    {formatDate(review.createdAt)}
                  </div>
                  <div className="flex mt-1 mb-2">
                    {renderStars(review.rating)}
                  </div>
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                  {review.type && (
                    <div className="mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {review.type === "tenant"
                          ? "En tant que colocataire"
                          : review.type === "owner"
                          ? "En tant que propriétaire"
                          : review.type}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add review button/form */}
      {!isCurrentUser && !showAddReview && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowAddReview(true)}
        >
          Laisser un avis
        </Button>
      )}

      {!isCurrentUser && showAddReview && (
        <div className="border border-gray-200 rounded-lg p-4 animate-fadeIn">
          <h3 className="font-medium mb-4">Votre avis</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <div className="flex" onMouseLeave={() => setHoverRating(0)}>
                {renderStars(0, true)}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commentaire
              </label>
              <Textarea
                placeholder="Partagez votre expérience..."
                className="min-h-[100px]"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddReview(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-secondary hover:bg-secondary/90 text-white"
                disabled={newRating === 0 || !comment.trim()}
              >
                Publier
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
