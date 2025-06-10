"use client";

import { UserReviews } from "@/components/reviews/reviews-list";

export default function ReviewsTab({ user }) {
  if (!user?.id) {
    return (
      <div className="p-4 text-center text-gray-500">
        Impossible de charger les avis pour cet utilisateur
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserReviews userId={user.id} />
    </div>
  );
}
