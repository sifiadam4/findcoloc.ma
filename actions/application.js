"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getCandidatures() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  try {
    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
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
    return { success: false, message: "You have already applied to this offer"}
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
    const application = await prisma.application.update({
      where: { id },
      data: {
        status,
      },
    });

    revalidatePath("/mes-condidatures");
    revalidatePath("/mes-demandes");
    revalidatePath("/");

    return application;
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
