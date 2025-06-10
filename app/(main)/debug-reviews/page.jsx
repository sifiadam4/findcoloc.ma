"use client";

import { useEffect, useState } from "react";
import { getPropertyReviews } from "@/actions/review";
import { Card, CardContent } from "@/components/ui/card";

export default function ReviewDebugPage() {
  const [offerId, setOfferId] = useState("");
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    if (!offerId) return;

    try {
      setLoading(true);
      setError(null);

      const result = await getPropertyReviews(offerId);
      console.log("Review API result:", result);

      if (result.success) {
        setReviews(result);
      } else {
        setError(result.error || "Failed to fetch reviews");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("An error occurred while fetching reviews");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Review Debug Tool</h1>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Property ID:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={offerId}
            onChange={(e) => setOfferId(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Enter property ID"
          />
          <button
            onClick={fetchReviews}
            disabled={!offerId || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
          >
            {loading ? "Loading..." : "Fetch Reviews"}
          </button>
        </div>
      </div>

      {error && (
        <Card className="mb-4">
          <CardContent className="p-4 text-red-500">{error}</CardContent>
        </Card>
      )}

      {reviews && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Found {reviews.reviews.length} reviews
          </h2>
          <div className="space-y-4">
            {reviews.reviews.map((review, index) => (
              <Card key={review.id || index}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Rating</h3>
                      <p>{review.rating} / 5</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Author</h3>
                      <p>{review.author?.name || "Unknown"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Date</h3>
                      <p>{new Date(review.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Review ID</h3>
                      <p>{review.id}</p>
                    </div>
                    <div className="col-span-2">
                      <h3 className="font-medium">Comment</h3>
                      <pre className="mt-1 p-2 bg-gray-100 rounded whitespace-pre-wrap break-words">
                        {JSON.stringify(review.comment, null, 2) ||
                          "No comment"}
                        {"\n"}
                        Length: {review.comment ? review.comment.length : 0}
                        {"\n"}
                        Type: {typeof review.comment}
                        {review.comment === "" && " (empty string)"}
                        {review.comment === null && " (null)"}
                        {review.comment === undefined && " (undefined)"}
                      </pre>
                    </div>
                    <div className="col-span-2">
                      <h3 className="font-medium">Raw Data</h3>
                      <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(review, null, 2)}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
