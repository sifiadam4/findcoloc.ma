"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendEmail } from "./email";
import { redirect } from "next/navigation";

// Check if a user can start a new sejour
export async function canUserStartSejour(tenantId) {
  try {
    // Count active sejours for this tenant
    const activeSejoursCount = await prisma.sejour.count({
      where: {
        tenantId,
        status: "active",
      },
    });

    return {
      canStart: activeSejoursCount === 0,
      activeSejoursCount,
    };
  } catch (error) {
    console.error("Error checking if user can start sejour:", error);
    return {
      canStart: false,
      error: error.message,
    };
  }
}

// Start séjour when application is accepted
export async function startSejour(applicationId, ownerId, tenantId, offerId) {
  try {
    // Validate required parameters
    if (!applicationId || !ownerId || !tenantId || !offerId) {
      return {
        success: false,
        error: "Paramètres manquants pour démarrer le séjour",
      };
    } // Check if the tenant can start another sejour (only one active sejour at a time)
    const userCanStartResult = await canUserStartSejour(tenantId);
    if (!userCanStartResult.canStart) {
      return {
        success: false,
        error:
          "Vous avez déjà un séjour actif. Vous ne pouvez pas en démarrer un autre.",
      };
    }

    // Check if there's already an active sejour for this offer and tenant
    const existingSejour = await prisma.sejour.findFirst({
      where: {
        offerId,
        tenantId,
        status: "active",
      },
    });

    if (existingSejour) {
      return {
        success: false,
        error: "Un séjour actif existe déjà pour cette offre et ce locataire",
        sejour: existingSejour,
      };
    }

    // Check if the offer is already rented (has any active sejour)
    const offerAlreadyRented = await prisma.sejour.findFirst({
      where: {
        offerId,
        status: "active",
      },
    });

    if (offerAlreadyRented) {
      return {
        success: false,
        error: "Cette offre est déjà occupée par un autre locataire",
        sejour: offerAlreadyRented,
      };
    }

    // Check if the offer status is "rented"
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      return {
        success: false,
        error: "Cette offre n'existe plus",
      };
    }

    if (offer.status === "rented") {
      return {
        success: false,
        error: "Cette offre est déjà louée",
      };
    }

    // Create the sejour once we've confirmed no duplicates exist
    const sejour = await prisma.sejour.create({
      data: {
        applicationId,
        ownerId,
        tenantId,
        offerId,
        status: "active",
        startDate: new Date(),
      },
      include: {
        application: true,
        owner: true,
        tenant: true,
        offer: true,
      },
    });

    // Update offer status to rented/occupied
    await prisma.offer.update({
      where: { id: offerId },
      data: { status: "rented" },
    });

    // Update application status to accepted
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "accepted" },
    });

    // Send confirmation emails (with validation)
    if (sejour.tenant?.email) {
      try {
        await sendEmail({
          to: sejour.tenant.email,
          subject: "Félicitations ! Votre séjour a commencé",
          html: `
            <h2>Bonjour ${sejour.tenant.name || "Locataire"},</h2>
            <p>Félicitations ! Votre séjour en colocation a officiellement commencé.</p>
            <p><strong>Détails du séjour :</strong></p>
            <ul>
              <li>Propriété : ${sejour.offer.title}</li>
              <li>Adresse : ${sejour.offer.address}, ${sejour.offer.city}</li>
              <li>Date de début : ${sejour.startDate.toLocaleDateString(
                "fr-FR"
              )}</li>
              <li>Propriétaire : ${sejour.owner.name || "Propriétaire"}</li>
            </ul>
            <p>Nous vous souhaitons un excellent séjour !</p>
            <p>L'équipe FindColoc.ma</p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email to tenant:", emailError);
      }
    }

    if (sejour.owner?.email) {
      try {
        await sendEmail({
          to: sejour.owner.email,
          subject: "Nouveau colocataire - Séjour commencé",
          html: `
            <h2>Bonjour ${sejour.owner.name || "Propriétaire"},</h2>
            <p>Le séjour de votre nouveau colocataire a officiellement commencé.</p>
            <p><strong>Détails du séjour :</strong></p>
            <ul>
              <li>Colocataire : ${sejour.tenant.name || "Locataire"}</li>
              <li>Propriété : ${sejour.offer.title}</li>
              <li>Date de début : ${sejour.startDate.toLocaleDateString(
                "fr-FR"
              )}</li>
            </ul>
            <p>L'équipe FindColoc.ma</p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email to owner:", emailError);
      }
    }
    try {
      revalidatePath("/dashboard");
      revalidatePath("/mes-demandes");
      revalidatePath("/mes-sejours");
    } catch (revalidateError) {
      console.error("Revalidation error:", revalidateError);
      // Continue anyway, as this is not critical
    }

    return { success: true, sejour };
  } catch (error) {
    console.error("Error starting séjour:", error);
    return { success: false, error: error.message };
  }
}

// End séjour
export async function endSejour(sejourId) {
  try {
    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    // Get current séjour
    const currentSejour = await prisma.sejour.findUnique({
      where: { id: sejourId },
      include: {
        owner: true,
        tenant: true,
        offer: true,
      },
    });

    if (!currentSejour) {
      return { success: false, error: "Séjour non trouvé" };
    }

    // Check if user is authorized to end this séjour
    if (
      currentSejour.ownerId !== session.user.id &&
      currentSejour.tenantId !== session.user.id
    ) {
      return { success: false, error: "Non autorisé à terminer ce séjour" };
    }

    // Update séjour status
    const updatedSejour = await prisma.sejour.update({
      where: { id: sejourId },
      data: {
        status: "ended",
        endDate: new Date(),
      },
      include: {
        owner: true,
        tenant: true,
        offer: true,
      },
    }); // Update offer status back to active
    await prisma.offer.update({
      where: { id: currentSejour.offerId },
      data: { status: "active" },
    });

    // Update application status back to pending
    await prisma.application.update({
      where: { id: currentSejour.applicationId },
      data: { status: "pending" },
    });

    // Send notification emails with feedback links
    const feedbackUrl = `${process.env.NEXTAUTH_URL}/feedback?sejourId=${sejourId}`;

    await sendEmail({
      to: updatedSejour.tenant.email,
      subject: "Fin de votre séjour - Partagez votre expérience",
      html: `
        <h2>Bonjour ${updatedSejour.tenant.name},</h2>
        <p>Votre séjour en colocation est maintenant terminé.</p>
        <p><strong>Détails du séjour :</strong></p>
        <ul>
          <li>Propriété : ${updatedSejour.offer.title}</li>
          <li>Date de début : ${updatedSejour.startDate.toLocaleDateString(
            "fr-FR"
          )}</li>
          <li>Date de fin : ${updatedSejour.endDate.toLocaleDateString(
            "fr-FR"
          )}</li>
        </ul>
        <p>Nous espérons que votre séjour s'est bien passé !</p>
        <p><a href="${feedbackUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Laisser un avis sur votre expérience</a></p>
        <p>Merci d'avoir utilisé FindColoc.ma</p>
      `,
    });

    await sendEmail({
      to: updatedSejour.owner.email,
      subject: "Fin de séjour - Partagez votre expérience",
      html: `
        <h2>Bonjour ${updatedSejour.owner.name},</h2>
        <p>Le séjour de votre colocataire est maintenant terminé.</p>
        <p><strong>Détails du séjour :</strong></p>
        <ul>
          <li>Colocataire : ${updatedSejour.tenant.name}</li>
          <li>Propriété : ${updatedSejour.offer.title}</li>
          <li>Date de début : ${updatedSejour.startDate.toLocaleDateString(
            "fr-FR"
          )}</li>
          <li>Date de fin : ${updatedSejour.endDate.toLocaleDateString(
            "fr-FR"
          )}</li>
        </ul>
        <p><a href="${feedbackUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Laisser un avis sur votre colocataire</a></p>
        <p>Merci d'avoir utilisé FindColoc.ma</p>
      `,
    });

    revalidatePath("/dashboard");
    revalidatePath("/mes-demandes");
    revalidatePath("/mes-sejours");

    return { success: true, sejour: updatedSejour };
  } catch (error) {
    console.error("Error ending séjour:", error);
    return { success: false, error: error.message };
  }
}

// Get séjour history for a user
export async function getSejourHistory(userId) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non autorisé" };
    }

    const sejours = await prisma.sejour.findMany({
      where: {
        OR: [{ ownerId: userId }, { tenantId: userId }],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        offer: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            price: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, sejours };
  } catch (error) {
    console.error("Error fetching séjour history:", error);
    return { success: false, error: error.message };
  }
}

// Get active séjours for a user
export async function getActiveSejoursByUser(userId) {
  try {
    const activeSejoursAsOwner = await prisma.sejour.findMany({
      where: {
        ownerId: userId,
        status: "active",
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        offer: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            price: true,
            images: true,
          },
        },
      },
    });

    const activeSejoursAsTenant = await prisma.sejour.findMany({
      where: {
        tenantId: userId,
        status: "active",
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        offer: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            price: true,
            images: true,
          },
        },
      },
    });

    return {
      success: true,
      asOwner: activeSejoursAsOwner,
      asTenant: activeSejoursAsTenant,
    };
  } catch (error) {
    console.error("Error fetching active séjours:", error);
    return { success: false, error: error.message };
  }
}

// Get séjour by ID
export async function getSejourById(sejourId) {
  try {
    const sejour = await prisma.sejour.findUnique({
      where: { id: sejourId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        offer: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            price: true,
            images: true,
          },
        },
        application: true,
      },
    });

    if (!sejour) {
      return { success: false, error: "Séjour non trouvé" };
    }

    return { success: true, sejour };
  } catch (error) {
    console.error("Error fetching séjour:", error);
    return { success: false, error: error.message };
  }
}
