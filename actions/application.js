"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { startSejour } from "./sejour";
import { sendApplicationNotification } from "./email";

export async function getCandidatures(
  query = "",
  sort = "recent",
  page = 1,
  pageSize = 12
) {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  try {
    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Base query
    const where = {
      userId,
    }; // Add search query filter if provided
    if (query) {
      where.offer = {
        OR: [
          { title: { contains: query } },
          { city: { contains: query } },
          { description: { contains: query } },
          { address: { contains: query } },
        ],
      };
    }

    // Determine sort order
    let orderBy = {};
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price_asc":
        orderBy = { offer: { price: "asc" } };
        break;
      case "price_desc":
        orderBy = { offer: { price: "desc" } };
        break;
      default: // "recent" is the default
        orderBy = { createdAt: "desc" };
        break;
    }

    // Get total count for pagination
    const totalCount = await prisma.application.count({
      where,
    });

    // Execute query with filters, sorting, and pagination
    const applications = await prisma.application.findMany({
      where,
      include: {
        offer: {
          include: {
            images: true,
            user: true,
          },
        },
      },
      orderBy,
      skip,
      take: pageSize,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      applications,
      pagination: {
        currentPage: page,
        totalPages,
        pageSize,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw new Error("Failed to fetch applications");
  }
}

export async function ApplyToColocation(offerId, message) {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    select: { userId: true },
  });

  if (!offer) {
    throw new Error("Offer not found");
  }

  if (offer.userId === userId) {
    // throw new Error("You cannot apply to your own offer");
    return { success: false, message: "You cannot apply to your own offer" };
  }

  const existingApplication = await prisma.application.findFirst({
    where: {
      offerId,
      userId,
    },
  });

  if (existingApplication) {
    // throw new Error("You have already applied to this offer");
    return {
      success: false,
      message: "You have already applied to this offer",
    };
  }

  try {
    const application = await prisma.application.create({
      data: {
        message,
        status: "pending",
        offerId,
        userId,
      },
    });

    revalidatePath("/mes-condidatures");
    revalidatePath("/mes-demandes");
    revalidatePath("/");

    return application;
  } catch (error) {
    console.error("Error creating application:", error);
    throw new Error("Failed to create application");
  }
}

export async function UpdateApplication(id, status) {
  const session = await auth();

  if (!session) {
    throw new Error("User not authenticated");
  }

  try {
    // Get application details before updating
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        offer: {
          include: {
            user: true, // Property owner
          },
        },
        user: true, // Applicant/tenant
      },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    // Check if user is authorized to update this application
    if (application.offer.userId !== session.user.id) {
      throw new Error("Not authorized to update this application");
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
    }); // If application is accepted, start séjour
    if (status === "accepted") {
      // Check if a sejour already exists for this offer and tenant
      const existingSejour = await prisma.sejour.findFirst({
        where: {
          offerId: application.offerId,
          tenantId: application.userId,
          status: "active",
        },
      });

      if (!existingSejour) {
        const sejourResult = await startSejour(
          application.id,
          application.offer.userId, // Owner ID
          application.userId, // Tenant ID
          application.offerId // Offer ID
        );

        if (!sejourResult.success) {
          console.error("Failed to start séjour:", sejourResult.error);
          // Continue with application update even if séjour creation fails
        }
      } else {
        console.log(
          "Skipping sejour creation - active sejour already exists:",
          existingSejour.id
        );
      }
    }

    revalidatePath("/mes-condidatures");
    revalidatePath("/mes-demandes");
    revalidatePath("/");

    return updatedApplication;
  } catch (error) {
    console.error("Error updating application:", error);
    throw new Error("Failed to update application");
  }
}

export async function DeleteApplication(id) {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  try {
    const application = await prisma.application.delete({
      where: { id, userId },
    });

    revalidatePath("/mes-condidatures");
    revalidatePath("/mes-demandes");
    revalidatePath("/");

    return application;
  } catch (error) {
    console.error("Error deleting application:", error);
    throw new Error("Failed to delete application");
  }
}

export async function getReceivedApplications() {
  const session = await auth();

  if (!session) {
    throw new Error("User not authenticated");
  }

  const userId = session.user.id;

  try {
    const applications = await prisma.application.findMany({
      where: { offer: { userId } },
      include: {
        user: true,
        offer: {
          include: {
            images: true,
            user: true,
          },
        },
      },
    });

    return applications;
  } catch (error) {
    console.error("Error fetching received applications:", error);
    throw new Error("Failed to fetch received applications");
  }
}

export async function getReceivedApplicationsByOfferId(offerId) {
  const session = await auth();

  if (!session) {
    throw new Error("User not authenticated");
  }

  const userId = session.user.id;

  try {
    // First verify that the offer belongs to the current user
    const offer = await prisma.offer.findFirst({
      where: {
        id: offerId,
        userId: userId,
      },
      include: {
        images: true,
        user: true,
      },
    });

    if (!offer) {
      throw new Error("Offer not found or not owned by user");
    }

    // Get all applications for this specific offer
    const applications = await prisma.application.findMany({
      where: { offerId: offerId },
      include: {
        user: true,
        offer: {
          include: {
            images: true,
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      offer,
      applications,
    };
  } catch (error) {
    console.error("Error fetching applications for offer:", error);
    throw new Error("Failed to fetch applications for offer");
  }
}
