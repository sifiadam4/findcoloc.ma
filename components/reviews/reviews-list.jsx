"use client";

import { useState, useEffect } from "react";
import { getUserReviews, getPropertyReviews } from "@/actions/review";
import { ReviewCard } from "./review-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Loader2 } from "lucide-react";

function AverageRating({ rating }) {
  const roundedRating = Math.round(rating * 10) / 10; // Round to 1 decimal place

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="font-medium">{roundedRating.toFixed(1)}</span>
    </div>
  );
}

export function UserReviews({ userId }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const result = await getUserReviews(userId);
        if (result.success) {
          setData(result);
        } else {
          setError(result.error || "Erreur lors du chargement des avis");
        }
      } catch (err) {
        setError("Erreur lors du chargement des avis");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.reviews || data.reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Aucun avis pour le moment
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            Avis des utilisateurs
          </CardTitle>
          <div className="flex items-center gap-2">
            <AverageRating rating={data.averageRating} />
            <span className="text-sm text-gray-500">
              {data.count} {data.count > 1 ? "avis" : "avis"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PropertyReviews({ offerId }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const result = await getPropertyReviews(offerId);
        if (result.success) {
          // Debug log to check if comments are coming from the server
          console.log("Property reviews:", result);
          if (result.reviews) {
            result.reviews.forEach((review) => {
              console.log(
                `Review #${review.id} - Comment: "${
                  review.comment || "No comment"
                }"`
              );
            });
          }

          setData(result);
        } else {
          setError(result.error || "Erreur lors du chargement des avis");
        }
      } catch (err) {
        setError("Erreur lors du chargement des avis");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [offerId]);

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.reviews || data.reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Aucun avis pour le moment
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            Avis sur la propriété
          </CardTitle>
          <div className="flex items-center gap-2">
            <AverageRating rating={data.averageRating} />
            <span className="text-sm text-gray-500">
              {data.count} {data.count > 1 ? "avis" : "avis"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
