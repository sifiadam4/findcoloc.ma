"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Helper function to check if user is admin
async function checkAdminAccess() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    redirect("/forbidden");
  }

  return session;
}

// ================== STATISTICS FUNCTIONS ==================

/**
 * Get general admin statistics
 */
export async function getAdminStats() {
  try {
    await checkAdminAccess();

    const [
      totalUsers,
      verifiedUsers,
      pendingUsers,
      suspendedUsers,
      totalOffers,
      pendingOffers,
      activeOffers,
      closedOffers,
      draftOffers,
      rentedOffers,
      totalApplications,
      pendingApplications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "verified" } }),
      prisma.user.count({ where: { status: "pending" } }),
      prisma.user.count({ where: { status: "suspended" } }),
      prisma.offer.count(),
      prisma.offer.count({ where: { status: "pending" } }),
      prisma.offer.count({ where: { status: "active" } }),
      prisma.offer.count({ where: { status: "closed" } }),
      prisma.offer.count({ where: { status: "draft" } }),
      prisma.offer.count({ where: { status: "rented" } }),
      prisma.application.count(),
      prisma.application.count({ where: { status: "pending" } }),
    ]);

    return {
      users: {
        total: totalUsers,
        verified: verifiedUsers,
        pending: pendingUsers,
        suspended: suspendedUsers,
      },
      offers: {
        total: totalOffers,
        pending: pendingOffers,
        active: activeOffers,
        closed: closedOffers,
        draft: draftOffers,
        rented: rentedOffers,
        // Keep these for backward compatibility with admin components
        approved: activeOffers,
        rejected: closedOffers,
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
      },
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw new Error("Failed to fetch admin statistics");
  }
}

// ================== USER MANAGEMENT FUNCTIONS ==================

/**
 * Get all users with filtering and pagination
 */
export async function getUsers(
  searchTerm = "",
  statusFilter = "all",
  typeFilter = "all",
  page = 1,
  limit = 50
) {
  try {
    await checkAdminAccess();

    const skip = (page - 1) * limit;

    // Build where conditions
    const where = {};

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    if (statusFilter !== "all") {
      where.status = statusFilter;
    }

    // For typeFilter, we'll need to determine type based on offers count
    let users;
    if (typeFilter !== "all") {
      if (typeFilter === "Propriétaire") {
        users = await prisma.user.findMany({
          where: {
            ...where,
            offers: {
              some: {},
            },
          },
          include: {
            offers: true,
            _count: {
              select: {
                offers: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        });
      } else {
        users = await prisma.user.findMany({
          where: {
            ...where,
            offers: {
              none: {},
            },
          },
          include: {
            offers: true,
            _count: {
              select: {
                offers: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        });
      }
    } else {
      users = await prisma.user.findMany({
        where,
        include: {
          offers: true,
          _count: {
            select: {
              offers: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    const totalUsers = await prisma.user.count({ where });

    return {
      users: users.map((user) => ({
        ...user,
        type: user._count.offers > 0 ? "Propriétaire" : "Locataire",
        properties: user._count.offers,
      })),
      total: totalUsers,
      hasMore: skip + limit < totalUsers,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

/**
 * Get pending users for admin approval
 */
export async function getPendingUsers(limit = 10) {
  try {
    await checkAdminAccess();

    const pendingUsers = await prisma.user.findMany({
      where: { status: "pending" },
      include: {
        _count: {
          select: {
            offers: true,
          },
        },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return pendingUsers.map((user) => ({
      ...user,
      type: user._count.offers > 0 ? "Propriétaire" : "Locataire",
      properties: user._count.offers,
    }));
  } catch (error) {
    console.error("Error fetching pending users:", error);
    throw new Error("Failed to fetch pending users");
  }
}

/**
 * Update user status (verify, suspend, reactivate)
 */
export async function updateUserStatus(userId, status) {
  try {
    await checkAdminAccess();

    const validStatuses = ["pending", "verified", "suspended"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status },
      include: {
        _count: {
          select: {
            offers: true,
          },
        },
      },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin");

    return {
      success: true,
      user: {
        ...updatedUser,
        type: updatedUser._count.offers > 0 ? "Propriétaire" : "Locataire",
        properties: updatedUser._count.offers,
      },
    };
  } catch (error) {
    console.error("Error updating user status:", error);
    return {
      success: false,
      error: "Failed to update user status",
    };
  }
}

/**
 * Delete user account
 */
export async function deleteUser(userId) {
  try {
    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    // Don't allow deleting the current admin user
    if (session.user.id === userId) {
      return {
        success: false,
        error: "Cannot delete your own account",
      };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin");

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: "Failed to delete user",
    };
  }
}

// ================== OFFER MANAGEMENT FUNCTIONS ==================

/**
 * Get all offers with filtering and pagination for admin
 */
export async function getAdminOffers(
  searchTerm = "",
  statusFilter = "all",
  typeFilter = "all",
  page = 1,
  limit = 50
) {
  try {
    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    const skip = (page - 1) * limit;

    // Build where conditions
    const where = {};

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { city: { contains: searchTerm, mode: "insensitive" } },
        { address: { contains: searchTerm, mode: "insensitive" } },
        { user: { name: { contains: searchTerm, mode: "insensitive" } } },
      ];
    }

    if (statusFilter !== "all") {
      where.status = statusFilter;
    }

    if (typeFilter !== "all") {
      where.propertyType = typeFilter;
    }

    const offers = await prisma.offer.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        images: true,
        _count: {
          select: {
            applications: true,
            favorites: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalOffers = await prisma.offer.count({ where });

    return {
      offers: offers.map((offer) => ({
        ...offer,
        owner: {
          name: offer.user.name,
          email: offer.user.email,
          avatar: offer.user.image,
        },
        submittedAt: offer.createdAt,
        imagesCount: offer.images.length,
        applicationsCount: offer._count.applications,
        favoritesCount: offer._count.favorites,
      })),
      total: totalOffers,
      hasMore: skip + limit < totalOffers,
    };
  } catch (error) {
    console.error("Error fetching admin offers:", error);
    throw new Error("Failed to fetch offers");
  }
}

/**
 * Update offer status (approve, reject, pending)
 */
export async function updateOfferStatus(offerId, status) {
  try {
    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    // Map admin actions to proper statuses for the 5-status system
    let newStatus = status;
    if (status === "approved") {
      newStatus = "active"; // When admin approves, set to active
    } else if (status === "rejected") {
      newStatus = "closed"; // When admin rejects, set to closed
    }

    const validStatuses = ["pending", "active", "rented", "draft", "closed"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error("Invalid status");
    }

    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: { status: newStatus },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        images: true,
        _count: {
          select: {
            applications: true,
            favorites: true,
          },
        },
      },
    });

    revalidatePath("/admin/annonces");
    revalidatePath("/admin");

    return {
      success: true,
      offer: {
        ...updatedOffer,
        owner: {
          name: updatedOffer.user.name,
          email: updatedOffer.user.email,
          avatar: updatedOffer.user.image,
        },
        submittedAt: updatedOffer.createdAt,
        imagesCount: updatedOffer.images.length,
        applicationsCount: updatedOffer._count.applications,
        favoritesCount: updatedOffer._count.favorites,
      },
    };
  } catch (error) {
    console.error("Error updating offer status:", error);
    return {
      success: false,
      error: "Failed to update offer status",
    };
  }
}

/**
 * Delete offer (admin only)
 */
export async function adminDeleteOffer(offerId) {
  try {
    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    await prisma.offer.delete({
      where: { id: offerId },
    });

    revalidatePath("/admin/annonces");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Offer deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting offer:", error);
    return {
      success: false,
      error: "Failed to delete offer",
    };
  }
}

// ================== RECENT ACTIVITY FUNCTIONS ==================

/**
 * Get recent activity for admin dashboard
 */
export async function getRecentActivity(limit = 10) {
  try {
    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        status: true,
      },
    });

    // Get recent offers
    const recentOffers = await prisma.offer.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get recent applications
    const recentApplications = await prisma.application.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        offer: {
          select: {
            title: true,
          },
        },
      },
    });

    // Format activities
    const activities = [];

    // Add user registrations
    recentUsers.forEach((user) => {
      activities.push({
        id: `user_${user.id}`,
        type: "user_registered",
        user: user.name || "Utilisateur anonyme",
        action: "Nouvel utilisateur inscrit",
        target: "",
        time: user.createdAt,
        icon: "UserPlus",
        color: "text-blue-600",
      });
    });

    // Add offer submissions
    recentOffers.forEach((offer) => {
      activities.push({
        id: `offer_${offer.id}`,
        type: "offer_submitted",
        user: offer.user.name || "Utilisateur anonyme",
        action: "Nouvelle annonce soumise",
        target: offer.title,
        time: offer.createdAt,
        icon: "FileText",
        color: "text-orange-600",
      });
    });

    // Add applications
    recentApplications.forEach((application) => {
      activities.push({
        id: `application_${application.id}`,
        type: "application_submitted",
        user: application.user.name || "Utilisateur anonyme",
        action: "Nouvelle candidature",
        target: application.offer.title,
        time: application.createdAt,
        icon: "Send",
        color: "text-purple-600",
      });
    });

    // Sort by time and limit
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    return activities.slice(0, limit);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    throw new Error("Failed to fetch recent activity");
  }
}

// ================== PENDING PROPERTIES FUNCTIONS ==================

/**
 * Get pending properties for admin approval
 */
export async function getPendingProperties(limit = 10) {
  try {
    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    const pendingOffers = await prisma.offer.findMany({
      where: { status: "pending" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        images: {
          take: 1,
          orderBy: { order: "asc" },
        },
      },
      // take: limit,
      orderBy: { createdAt: "desc" },
    });

    console.log("Pending offers:", pendingOffers);

    return pendingOffers.map((offer) => ({
      id: offer.id,
      title: offer.title,
      location: `${offer.city}, ${offer.address}`,
      price: offer.price,
      owner: {
        name: offer.user.name,
        email: offer.user.email,
        avatar: offer.user.image,
      },
      submittedAt: offer.createdAt,
      images: offer.images.length,
      type: offer.propertyType,
      image: offer.images[0]?.url || "/placeholder.svg",
    }));
  } catch (error) {
    console.error("Error fetching pending properties:", error);
    throw new Error("Failed to fetch pending properties");
  }
}
