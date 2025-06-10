"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createFeedback({
  rating,
  comment,
  targetId,
  sejourId,
  type,
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Utilisateur non authentifié" };
    }

    // Verify the séjour exists and is ended
    const sejour = await prisma.sejour.findUnique({
      where: { id: sejourId },
      include: {
        owner: true,
        tenant: true,
        offer: true,
      },
    });

    if (!sejour) {
      return { success: false, error: "Séjour introuvable" };
    }

    // Verify the user is part of this sejour
    const userId = session.user.id;
    const isOwner = sejour.ownerId === userId;
    const isTenant = sejour.tenantId === userId;

    if (!isOwner && !isTenant) {
      return {
        success: false,
        error: "Vous n'êtes pas autorisé à laisser un avis pour ce séjour",
      };
    }

    // Check if the séjour is ended (except for testing/development)
    if (sejour.status !== "ended" && process.env.NODE_ENV === "production") {
      return {
        success: false,
        error: "Vous ne pouvez laisser un avis qu'après la fin du séjour",
      };
    } // Check if the user has already given feedback of this type for this séjour
    if (
      (isOwner && sejour.ownerFeedbackGiven) ||
      (isTenant && sejour.tenantFeedbackGiven)
    ) {
      return {
        success: false,
        error: "Vous avez déjà laissé un avis pour ce séjour",
      };
    }

    // Validate review type based on user role
    if (!["property", "owner", "tenant"].includes(type)) {
      return { success: false, error: "Type d'avis invalide" };
    }

    // BUSINESS RULE: Owner can only give feedback about tenant
    if (isOwner && type !== "tenant") {
      return {
        success: false,
        error:
          "En tant que propriétaire, vous ne pouvez évaluer que votre locataire",
      };
    }

    // BUSINESS RULE: Tenant can give feedback about owner or property, but not other tenants
    if (isTenant && type === "tenant") {
      return {
        success: false,
        error: "Vous ne pouvez pas vous évaluer vous-même",
      };
    }

    // For property reviews, make sure targetId matches the offer ID
    if (type === "property" && targetId !== sejour.offerId) {
      return {
        success: false,
        error: "ID de propriété invalide pour ce séjour",
      };
    }

    // For user reviews, make sure the targetId matches the appropriate user
    if (type === "owner" && targetId !== sejour.ownerId) {
      return {
        success: false,
        error: "ID de propriétaire invalide pour ce séjour",
      };
    }

    if (type === "tenant" && targetId !== sejour.tenantId) {
      return {
        success: false,
        error: "ID de locataire invalide pour ce séjour",
      };
    } // Debug log the received data
    console.log("Review data being saved:", {
      rating,
      comment: comment || null,
      commentLength: comment ? comment.length : 0,
      commentType: typeof comment,
      type,
      authorId: userId,
      targetId,
      offerId: type === "property" ? targetId : undefined,
    }); // Create the review with proper comment handling
    const review = await prisma.review.create({
      data: {
        rating,
        // Always set comment explicitly (null if empty/undefined)
        comment: comment && comment.trim() !== "" ? comment : null,
        type,
        authorId: userId,
        // For property reviews, only set offerId
        ...(type === "property"
          ? { offerId: targetId }
          : { targetId: targetId }),
      },
    }); // Update the séjour to mark feedback as given
    // For owners: they only give tenant feedback, so mark ownerFeedbackGiven when they give any feedback
    // For tenants: they give both property and owner feedback, mark tenantFeedbackGiven only when both are complete
    if (isOwner) {
      // Owner completed their feedback (tenant rating)
      await prisma.sejour.update({
        where: { id: sejourId },
        data: {
          ownerFeedbackGiven: true,
        },
      });
    } else {
      // Tenant gave feedback - check if they've completed both property and owner feedback
      const existingReviews = await prisma.review.findMany({
        where: {
          authorId: userId,
          OR: [
            { offerId: sejour.offerId, type: "property" },
            { targetId: sejour.ownerId, type: "owner" },
          ],
        },
      });

      // Check if tenant has now completed both types of feedback
      const hasPropertyReview =
        existingReviews.some((r) => r.type === "property") ||
        type === "property";
      const hasOwnerReview =
        existingReviews.some((r) => r.type === "owner") || type === "owner";

      if (hasPropertyReview && hasOwnerReview) {
        await prisma.sejour.update({
          where: { id: sejourId },
          data: {
            tenantFeedbackGiven: true,
          },
        });
      }
    }

    // Revalidate relevant paths
    revalidatePath("/mes-sejours");
    revalidatePath("/feedback");
    if (type === "property") {
      revalidatePath(`/colocation/${targetId}`);
    } else {
      revalidatePath(`/profile/${targetId}`);
    }

    return {
      success: true,
      review,
      message: "Avis soumis avec succès",
    };
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      success: false,
      error: error.message || "Erreur lors de la création de l'avis",
    };
  }
}

export async function getUserReviews(userId) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        targetId: userId,
        type: { in: ["owner", "tenant"] },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate average rating
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return {
      success: true,
      reviews,
      averageRating,
      count: reviews.length,
    };
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return {
      success: false,
      error: error.message || "Erreur lors de la récupération des avis",
    };
  }
}

export async function getPropertyReviews(offerId) {
  try {
    // Add some console logging for debugging
    console.log(`Fetching property reviews for offer ID: ${offerId}`);

    const reviews = await prisma.review.findMany({
      where: {
        offerId,
        type: "property",
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Debug the results
    console.log(`Found ${reviews.length} reviews`);
    reviews.forEach((review, index) => {
      console.log(`Review ${index + 1} comment: "${review.comment}"`);
    });

    // Calculate average rating
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return {
      success: true,
      reviews,
      averageRating,
      count: reviews.length,
    };
  } catch (error) {
    console.error("Error fetching property reviews:", error);
    return {
      success: false,
      error: error.message || "Erreur lors de la récupération des avis",
    };
  }
}
