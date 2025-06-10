"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

// Get dashboard statistics for the current user
export async function getDashboardStats() {
  try {
    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    const userId = session.user.id;

    // Get user's offers with applications
    const offers = await prisma.offer.findMany({
      where: { userId },
      include: {
        applications: {
          include: {
            user: true,
          },
        },
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get received applications (applications to user's offers)
    const receivedApplications = await prisma.application.findMany({
      where: {
        offer: { userId },
      },
      include: {
        user: true,
        offer: {
          include: {
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate offer counts
    const offerCounts = {
      all: offers.length,
      active: offers.filter((o) => o.status === "active").length,
      draft: offers.filter((o) => o.status === "draft").length,
      archived: offers.filter((o) => o.status === "archived").length,
      pending: offers.filter((o) => o.status === "pending").length,
    };

    // Calculate application counts
    const applicationCounts = {
      all: receivedApplications.length,
      pending: receivedApplications.filter((a) => a.status === "pending")
        .length,
      accepted: receivedApplications.filter((a) => a.status === "accepted")
        .length,
      rejected: receivedApplications.filter((a) => a.status === "rejected")
        .length,
    };

    // Get recent applications (last 5)
    const recentApplications = receivedApplications
      .filter((app) => app.status === "pending")
      .slice(0, 5);

    // Calculate total views across all offers
    const totalViews = offers.reduce(
      (sum, offer) => sum + (offer.views || 0),
      0
    );

    return {
      offerCounts,
      applicationCounts,
      recentApplications,
      totalViews,
      offers,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Failed to fetch dashboard statistics");
  }
}

// Get current roommates for the user (accepted applications)
export async function getCurrentRoommates() {
  try {
    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    const userId = session.user.id;

    // Get accepted applications for user's offers
    const acceptedApplications = await prisma.application.findMany({
      where: {
        offer: { userId },
        status: "accepted",
      },
      include: {
        user: true,
        offer: {
          include: {
            images: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return acceptedApplications;
  } catch (error) {
    console.error("Error fetching current roommates:", error);
    throw new Error("Failed to fetch current roommates");
  }
}

// Get recent reviews for the user's properties
export async function getRecentReviews() {
  try {
    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    const userId = session.user.id;

    // Note: This would require a reviews/ratings table in your schema
    // For now, returning empty array as the reviews system might not be implemented yet
    // You can implement this when you add the reviews/ratings feature

    return [];
  } catch (error) {
    console.error("Error fetching recent reviews:", error);
    return [];
  }
}
