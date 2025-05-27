"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { redirect } from "next/navigation";

// Server action to fetch offers with filters
export async function getOffers() {
  try {
    // Execute query with pagination
    const offers = await prisma.offer.findMany({
      include: {
        images: true,
      },
    });

    return offers;
  } catch (error) {
    console.error("Error fetching offers:", error);
    throw new Error("Failed to fetch offers");
  }
}

export async function getOfferById(id) {
  try {
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        images: true,
        user: true,
        applications: true,
      },
    });

    return offer;
  } catch (error) {
    console.error("Error fetching offer:", error);
    throw new Error("Failed to fetch offer");
  }
}

export async function getMyOffers() {
  try {
    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    const userId = session.user.id;

    const offers = await prisma.offer.findMany({
      where: { userId },
      include: {
        images: true,
        favorites: true,
        applications: true,
      },
      orderBy: {
        createdAt: "desc", // Order by creation date, most recent first
      },
    });

    return offers;
  } catch (error) {
    console.error("Error fetching user's offers:", error);
    throw new Error("Failed to fetch user's offers");
  }
}

export async function candidat_offer_compatibilityScore(offer) {
  const session = await auth();

  if (!session) {
    return 0;
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!offer || !user) return 0;

  let score = 0;
  let totalCriteria = 0;

  totalCriteria++;
  if (
    offer.genderPreference === user.gender ||
    offer.genderPreference === "any"
  ) {
    score++;
  }

  totalCriteria++;
  if (user.minBudget <= offer.price && offer.price <= user.maxBudget) {
    score++;
  }

  totalCriteria++;
  if (
    offer.smokingAllowed === user.smokingAllowed ||
    (offer.smokingAllowed === true && user.smokingAllowed === false)
  ) {
    // If offer allows smoking, it's compatible with both smokers and non-smokers
    // If offer doesn't allow smoking, only compatible with non-smokers
    score++;
  }

  // Pets preference
  totalCriteria++;
  if (
    offer.petsAllowed === user.petsAllowed ||
    (offer.petsAllowed === true && user.petsAllowed === false)
  ) {
    score++;
  }

  // Visitors preference
  totalCriteria++;
  if (
    offer.visitorsAllowed === user.visitorsAllowed ||
    (offer.visitorsAllowed === true && user.visitorsAllowed === false)
  ) {
    score++;
  }

  // Party preference
  totalCriteria++;
  if (
    offer.partyAllowed === user.partyAllowed ||
    (offer.partyAllowed === true && user.partyAllowed === false)
  ) {
    score++;
  }

  // Calculate percentage
  const compatibilityPercentage = Math.round((score / totalCriteria) * 100);

  // console.log(`Compatibility Score: ${score}/${totalCriteria} = ${compatibilityPercentage}%`);
  return compatibilityPercentage;
}

export async function createOffer(formData) {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Authentication required");
    }

    const userId = session.user.id;

    // Extract data from formData
    const {
      // Step 1: Basic Information
      title,
      description,
      price,
      availableDate,
      images = [],

      // Step 2: Property Location
      address,
      city,
      zipCode,
      state,
      country,
      latitude,
      longitude,

      // Step 3: Property Details
      propertyType,
      hasWifi = false,
      hasHeating = false,
      hasAirCon = false,
      hasWasher = false,
      hasKitchen = false,
      hasParking = false,
      hasLivingRoom = false,
      hasBalcony = false,
      hasElevator = false,

      // Step 4: Room Details
      roomType,
      roomFurnished = false,
      privateToilet = false,

      // Step 5: Rules and Preferences
      genderPreference,
      smokingAllowed = false,
      petsAllowed = false,
      visitorsAllowed = true,
      partyAllowed = false,
    } = formData;

    // Validate required fields
    if (
      !title ||
      !description ||
      !price ||
      !availableDate ||
      !address ||
      !city ||
      !zipCode ||
      !country ||
      !propertyType ||
      !roomType
    ) {
      throw new Error("Missing required fields");
    } // Upload images to Cloudinary
    const uploadedImages = [];
    console.log("Processing images:", images?.length || 0);

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imageData = images[i];
        console.log(
          `Processing image ${i + 1}:`,
          imageData?.substring(0, 50) + "..."
        );

        if (imageData) {
          try {
            const uploadResult = await uploadImageToCloudinary(
              imageData,
              "offers"
            );
            console.log(
              `Image ${i + 1} uploaded successfully:`,
              uploadResult.url
            );

            uploadedImages.push({
              url: uploadResult.url,
              order: i,
            });
          } catch (error) {
            console.error(`Failed to upload image ${i + 1}:`, error);
            // Continue with other images even if one fails
          }
        }
      }
    }

    console.log("Total images uploaded:", uploadedImages.length);

    // Create the offer with images
    const offer = await prisma.offer.create({
      data: {
        userId,

        // Basic Information
        title,
        description,
        price: parseInt(price),
        availableDate: new Date(availableDate),

        // Property Location
        address,
        city,
        zipCode,
        state,
        country,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,

        // Property Details
        propertyType,
        hasWifi: Boolean(hasWifi),
        hasHeating: Boolean(hasHeating),
        hasAirCon: Boolean(hasAirCon),
        hasWasher: Boolean(hasWasher),
        hasKitchen: Boolean(hasKitchen),
        hasParking: Boolean(hasParking),
        hasLivingRoom: Boolean(hasLivingRoom),
        hasBalcony: Boolean(hasBalcony),
        hasElevator: Boolean(hasElevator),

        // Room Details
        roomType,
        roomFurnished: Boolean(roomFurnished),
        privateToilet: Boolean(privateToilet),

        // Rules and Preferences
        genderPreference,
        smokingAllowed: Boolean(smokingAllowed),
        petsAllowed: Boolean(petsAllowed),
        visitorsAllowed: Boolean(visitorsAllowed),
        partyAllowed: Boolean(partyAllowed),

        // Create associated images
        images: {
          create: uploadedImages,
        },
      },
      include: {
        images: true,
        user: true,
      },
    });

    return {
      success: true,
      offer,
      message: "Offre créée avec succès!",
    };
  } catch (error) {
    console.error("Error creating offer:", error);
    return {
      success: false,
      error: error.message || "Failed to create offer",
    };
  }
}

export async function updateOffer(offerId, data) {
  try {
    console.log("updateOffer called with:", {
      offerId,
      data: data ? "data provided" : "no data",
    });

    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    const userId = session.user.id;

    // Check if the offer exists and belongs to the user
    const existingOffer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { images: true },
    });

    if (!existingOffer) {
      return {
        success: false,
        error: "Offre introuvable.",
      };
    }
    if (existingOffer.userId !== userId) {
      return {
        success: false,
        error: "Vous n'êtes pas autorisé à modifier cette offre.",
      };
    }

    // Check if data is provided
    if (!data || typeof data !== "object") {
      return {
        success: false,
        error: "Données manquantes ou invalides.",
      };
    }

    const {
      // Basic Information
      title,
      description,
      price,
      availableDate,
      images = [],

      // Property Location
      address,
      city,
      zipCode,
      state,
      country,
      latitude,
      longitude,

      // Property Details
      propertyType,
      hasWifi,
      hasHeating,
      hasAirCon,
      hasWasher,
      hasKitchen,
      hasParking,
      hasLivingRoom,
      hasBalcony,
      hasElevator,

      // Room Details
      roomType,
      roomFurnished,
      privateToilet,

      // Rules and Preferences
      genderPreference,
      smokingAllowed,
      petsAllowed,
      visitorsAllowed,
      partyAllowed,
    } = data;

    // Handle image uploads
    let uploadedImages = [];
    console.log("Processing images for update:", images?.length || 0);

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        console.log(
          `Processing image ${i + 1}:`,
          typeof image,
          image?.substring ? image.substring(0, 50) + "..." : image
        );

        if (typeof image === "string" && image.startsWith("http")) {
          // Existing image URL, keep it
          console.log(`Keeping existing image ${i + 1}:`, image);
          uploadedImages.push({
            url: image,
            order: i,
          });
        } else if (typeof image === "string" && image.startsWith("data:")) {
          // New image to upload (base64)
          try {
            console.log(`Uploading new image ${i + 1}`);
            const result = await uploadImageToCloudinary(image, "offers");
            console.log(`Image ${i + 1} uploaded successfully:`, result.url);
            uploadedImages.push({
              url: result.url,
              order: i,
            });
          } catch (uploadError) {
            console.error(`Error uploading image ${i + 1}:`, uploadError);
            // Continue with other images even if one fails
          }
        } else if (image instanceof File) {
          // New image file to upload
          try {
            console.log(`Uploading new image file ${i + 1}`);
            const result = await uploadImageToCloudinary(image, "offers");
            console.log(
              `Image file ${i + 1} uploaded successfully:`,
              result.url
            );
            uploadedImages.push({
              url: result.url,
              order: i,
            });
          } catch (uploadError) {
            console.error(`Error uploading image file ${i + 1}:`, uploadError);
            // Continue with other images even if one fails
          }
        }
      }
    }

    console.log("Total images processed for update:", uploadedImages.length);

    // Delete existing images and create new ones
    await prisma.offerImage.deleteMany({
      where: { offerId },
    });

    // Update the offer
    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: {
        // Basic Information
        title,
        description,
        price: parseInt(price),
        availableDate: new Date(availableDate),

        // Property Location
        address,
        city,
        zipCode,
        state,
        country,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,

        // Property Details
        propertyType,
        hasWifi: Boolean(hasWifi),
        hasHeating: Boolean(hasHeating),
        hasAirCon: Boolean(hasAirCon),
        hasWasher: Boolean(hasWasher),
        hasKitchen: Boolean(hasKitchen),
        hasParking: Boolean(hasParking),
        hasLivingRoom: Boolean(hasLivingRoom),
        hasBalcony: Boolean(hasBalcony),
        hasElevator: Boolean(hasElevator),

        // Room Details
        roomType,
        roomFurnished: Boolean(roomFurnished),
        privateToilet: Boolean(privateToilet),

        // Rules and Preferences
        genderPreference,
        smokingAllowed: Boolean(smokingAllowed),
        petsAllowed: Boolean(petsAllowed),
        visitorsAllowed: Boolean(visitorsAllowed),
        partyAllowed: Boolean(partyAllowed),

        // Update associated images
        images: {
          create: uploadedImages,
        },
      },
      include: {
        images: true,
        user: true,
      },
    });
    return {
      success: true,
      offer: updatedOffer,
      message: "Offre modifiée avec succès!",
    };
  } catch (error) {
    console.error("Error updating offer:", error?.message || error);
    return {
      success: false,
      error: error?.message || "Failed to update offer",
    };
  }
}

export async function duplicateOffer(offerId) {
  try {
    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    const userId = session.user.id;

    // Get the original offer
    const originalOffer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { images: true },
    });

    if (!originalOffer) {
      return {
        success: false,
        error: "Offre introuvable.",
      };
    }

    // Check if the user owns the offer
    if (originalOffer.userId !== userId) {
      return {
        success: false,
        error: "Vous n'êtes pas autorisé à dupliquer cette offre.",
      };
    }

    // Prepare the duplicated offer data
    const duplicatedOfferData = {
      userId,

      // Basic Information - add "Copie de " prefix to title
      title: `Copie de ${originalOffer.title}`,
      description: originalOffer.description,
      price: originalOffer.price,
      availableDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow

      // Property Location
      address: originalOffer.address,
      city: originalOffer.city,
      zipCode: originalOffer.zipCode,
      state: originalOffer.state,
      country: originalOffer.country,
      latitude: originalOffer.latitude,
      longitude: originalOffer.longitude,

      // Property Details
      propertyType: originalOffer.propertyType,
      hasWifi: originalOffer.hasWifi,
      hasHeating: originalOffer.hasHeating,
      hasAirCon: originalOffer.hasAirCon,
      hasWasher: originalOffer.hasWasher,
      hasKitchen: originalOffer.hasKitchen,
      hasParking: originalOffer.hasParking,
      hasLivingRoom: originalOffer.hasLivingRoom,
      hasBalcony: originalOffer.hasBalcony,
      hasElevator: originalOffer.hasElevator,

      // Room Details
      roomType: originalOffer.roomType,
      roomFurnished: originalOffer.roomFurnished,
      privateToilet: originalOffer.privateToilet,

      // Rules and Preferences
      genderPreference: originalOffer.genderPreference,
      smokingAllowed: originalOffer.smokingAllowed,
      petsAllowed: originalOffer.petsAllowed,
      visitorsAllowed: originalOffer.visitorsAllowed,
      partyAllowed: originalOffer.partyAllowed,

      // Set as draft by default
      status: "draft",
    };

    // Create the duplicated offer
    const duplicatedOffer = await prisma.offer.create({
      data: duplicatedOfferData,
      include: {
        images: true,
        user: true,
      },
    });

    // Copy images if they exist
    if (originalOffer.images && originalOffer.images.length > 0) {
      const imagesToCreate = originalOffer.images.map((image, index) => ({
        offerId: duplicatedOffer.id,
        url: image.url,
        order: index,
      }));

      await prisma.offerImage.createMany({
        data: imagesToCreate,
      });
    }

    // Fetch the complete duplicated offer with images
    const completeOffer = await prisma.offer.findUnique({
      where: { id: duplicatedOffer.id },
      include: {
        images: true,
        user: true,
      },
    });

    return {
      success: true,
      offer: completeOffer,
      message: "Offre dupliquée avec succès!",
    };
  } catch (error) {
    console.error("Error duplicating offer:", error);
    return {
      success: false,
      error: error?.message || "Échec de la duplication de l'offre",
    };
  }
}

export async function deleteOffer(offerId) {
  try {
    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    const userId = session.user.id;

    // Check if the offer exists and belongs to the user
    const existingOffer = await prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!existingOffer) {
      return {
        success: false,
        error: "Offre introuvable.",
      };
    }

    if (existingOffer.userId !== userId) {
      return {
        success: false,
        error: "Vous n'êtes pas autorisé à supprimer cette offre.",
      };
    }

    // Delete the offer (this will cascade delete images, applications, etc.)
    await prisma.offer.delete({
      where: { id: offerId },
    });

    return {
      success: true,
      message: "Offre supprimée avec succès!",
    };
  } catch (error) {
    console.error("Error deleting offer:", error);
    return {
      success: false,
      error: error?.message || "Échec de la suppression de l'offre",
    };
  }
}

export async function publishOffer(offerId) {
  try {
    const session = await auth();

    if (!session) {
      return {
        success: false,
        error: "Vous devez être connecté pour publier une offre.",
      };
    }

    // Verify that the offer belongs to the current user
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      select: { userId: true, status: true },
    });

    if (!offer) {
      return {
        success: false,
        error: "Offre introuvable.",
      };
    }

    if (offer.userId !== session.user.id) {
      return {
        success: false,
        error: "Vous n'êtes pas autorisé à publier cette offre.",
      };
    }

    if (offer.status !== "draft") {
      return {
        success: false,
        error: "Seules les offres en brouillon peuvent être publiées.",
      };
    }

    // Update the offer status to active
    await prisma.offer.update({
      where: { id: offerId },
      data: {
        status: "active",
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Offre publiée avec succès!",
    };
  } catch (error) {
    console.error("Error publishing offer:", error);
    return {
      success: false,
      error: error?.message || "Échec de la publication de l'offre",
    };
  }
}
