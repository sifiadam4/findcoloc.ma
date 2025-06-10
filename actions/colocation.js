"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { redirect } from "next/navigation";

// Server action to fetch offers with filters - only approved/active listings
export async function getOffers(
  page = 1,
  pageSize = 12,
  filters = {},
  sortBy = "recommended"
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Build where clause with filters
    const whereClause = {
      status: {
        in: ["approved", "active"],
      },
    };

    // Add price filters
    if (filters.minPrice && filters.minPrice > 0) {
      whereClause.price = { ...whereClause.price, gte: filters.minPrice };
    }
    if (filters.maxPrice && filters.maxPrice < 999999) {
      whereClause.price = { ...whereClause.price, lte: filters.maxPrice };
    } // Add location filter
    if (filters.location && filters.location.trim()) {
      whereClause.OR = [
        { city: { contains: filters.location } },
        { address: { contains: filters.location } },
      ];
    }

    // Add property type filter
    if (filters.types && filters.types.length > 0) {
      const typeMapping = {
        Appartement: "apartment",
        Maison: "house",
        Studio: "studio",
        Villa: "villa",
      };

      const mappedTypes = filters.types.map(
        (type) => typeMapping[type] || type.toLowerCase()
      );
      whereClause.propertyType = { in: mappedTypes };
    }

    // Add availability date filter
    if (filters.availableDate) {
      whereClause.availableDate = { lte: new Date(filters.availableDate) };
    }

    // Add features filters
    if (filters.features && filters.features.length > 0) {
      const featureMapping = {
        "Wi-Fi": "hasWifi",
        Chauffage: "hasHeating",
        Climatisation: "hasAirCon",
        "Lave-linge": "hasWasher",
        "Cuisine équipée": "hasKitchen",
        Parking: "hasParking",
        Salon: "hasLivingRoom",
        "Balcon/Terrasse": "hasBalcony",
        Ascenseur: "hasElevator",
      };

      filters.features.forEach((feature) => {
        const mappedFeature = featureMapping[feature];
        if (mappedFeature) {
          whereClause[mappedFeature] = true;
        }
      });
    }

    // Add options filters
    if (filters.options && filters.options.length > 0) {
      const optionMapping = {
        "Non-fumeur": { smokingAllowed: false },
        "Animaux acceptés": { petsAllowed: true },
        Meublé: { roomFurnished: true },
        "Visiteurs autorisés": { visitorsAllowed: true },
        "Fêtes autorisées": { partyAllowed: true },
      };

      filters.options.forEach((option) => {
        const optionFilter = optionMapping[option];
        if (optionFilter) {
          Object.assign(whereClause, optionFilter);
        }
      });
    }

    // Build order by clause based on sort
    let orderBy;
    switch (sortBy) {
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "recommended":
      default:
        // Default sorting - most recent first
        orderBy = { createdAt: "desc" };
        break;
    }

    // Get total count for pagination
    const totalCount = await prisma.offer.count({
      where: whereClause,
    });

    // Execute query with pagination and filters
    const offers = await prisma.offer.findMany({
      where: whereClause,
      include: {
        images: true,
        favorites: userId
          ? {
              where: {
                userId: userId,
              },
            }
          : false,
      },
      orderBy,
      skip,
      take: pageSize,
    });

    // Add isFavorited property to each offer
    const offersWithFavoriteStatus = offers.map((offer) => ({
      ...offer,
      isFavorited: userId ? offer.favorites.length > 0 : false,
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      offers: offersWithFavoriteStatus,
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
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
            email: true,
            emailVerified: true,
            bio: true,
            city: true,
            occupation: true,
            reviewsReceived: {
              select: {
                rating: true,
              },
            },
          },
        },
        applications: true,
      },
    });

    return offer;
  } catch (error) {
    console.error("Error fetching offer:", error);
    throw new Error("Failed to fetch offer");
  }
}

// Public function to get offer by ID - only returns approved/active offers
export async function getPublicOfferById(id) {
  try {
    const offer = await prisma.offer.findFirst({
      where: {
        id,
        status: {
          in: ["approved", "active"],
        },
      },
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
            email: true,
            emailVerified: true,
            bio: true,
            city: true,
            occupation: true,
            reviewsReceived: {
              select: {
                rating: true,
              },
            },
          },
        },
        applications: true,
      },
    });

    return offer;
  } catch (error) {
    console.error("Error fetching public offer:", error);
    throw new Error("Failed to fetch offer");
  }
}

export async function getMyOffers(
  query = "",
  sort = "recent",
  status = "all",
  page = 1,
  pageSize = 12
) {
  try {
    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    const userId = session.user.id;

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Base query
    const where = {
      userId,
    };

    // Add status filter
    if (status !== "all") {
      where.status = status;
    } // Add search query filter if provided
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { city: { contains: query } },
        { description: { contains: query } },
        { address: { contains: query } },
      ];
    }

    // Determine sort order
    let orderBy = {};
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "title":
        orderBy = { title: "asc" };
        break;
      default: // "recent" is the default
        orderBy = { createdAt: "desc" };
        break;
    }

    // Get total count for pagination
    const totalCount = await prisma.offer.count({
      where,
    });

    // Execute query with filters, sorting, and pagination
    const offers = await prisma.offer.findMany({
      where,
      include: {
        images: true,
        favorites: true,
        applications: true,
      },
      orderBy,
      skip,
      take: pageSize,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      offers,
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
    let uploadedImages = [];
    console.log("Processing images:", images?.length || 0);

    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imageData = images[i];
        console.log(
          `Processing image ${i + 1}:`,
          imageData?.substring(0, 50) + "..."
        );

        if (imageData && typeof imageData === "string") {
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
        } else {
          console.warn(`Skipping invalid image data at index ${i + 1}`);
        }
      }
    }

    // Ensure uploadedImages is always an array
    if (!Array.isArray(uploadedImages)) {
      uploadedImages = [];
    }
    console.log("Total images uploaded:", uploadedImages.length); // Validate and prepare required fields
    if (!title || typeof title !== "string") {
      throw new Error("Title is required and must be a string");
    }
    if (!description || typeof description !== "string") {
      throw new Error("Description is required and must be a string");
    }
    if (!price || isNaN(parseInt(price))) {
      throw new Error("Price is required and must be a valid number");
    }
    if (!availableDate) {
      throw new Error("Available date is required");
    }
    if (!address || typeof address !== "string") {
      throw new Error("Address is required and must be a string");
    }
    if (!city || typeof city !== "string") {
      throw new Error("City is required and must be a string");
    }
    if (!zipCode || typeof zipCode !== "string") {
      throw new Error("Zip code is required and must be a string");
    }
    if (!country || typeof country !== "string") {
      throw new Error("Country is required and must be a string");
    }
    if (!propertyType || typeof propertyType !== "string") {
      throw new Error("Property type is required and must be a string");
    }
    if (!roomType || typeof roomType !== "string") {
      throw new Error("Room type is required and must be a string");
    }
    if (!genderPreference || typeof genderPreference !== "string") {
      throw new Error("Gender preference is required and must be a string");
    }

    // Prepare the offer data with proper type conversion and defaults
    const offerData = {
      userId,

      // Basic Information
      title: String(title).trim(),
      description: String(description).trim(),
      price: parseInt(price),
      availableDate: new Date(availableDate),

      // Property Location
      address: String(address).trim(),
      city: String(city).trim(),
      zipCode: String(zipCode).trim(),
      state: state ? String(state).trim() : undefined,
      country: String(country).trim(),
      latitude:
        latitude && !isNaN(parseFloat(latitude))
          ? parseFloat(latitude)
          : undefined,
      longitude:
        longitude && !isNaN(parseFloat(longitude))
          ? parseFloat(longitude)
          : undefined,

      // Property Details
      propertyType: String(propertyType).trim(),
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
      roomType: String(roomType).trim(),
      roomFurnished: Boolean(roomFurnished),
      privateToilet: Boolean(privateToilet),

      status: "pending",

      // Rules and Preferences
      genderPreference: String(genderPreference).trim(),
      smokingAllowed: Boolean(smokingAllowed),
      petsAllowed: Boolean(petsAllowed),
      visitorsAllowed: Boolean(visitorsAllowed),
      partyAllowed: Boolean(partyAllowed),
    }; // Only add images if we have valid uploadedImages array with content
    if (
      uploadedImages &&
      Array.isArray(uploadedImages) &&
      uploadedImages.length > 0
    ) {
      offerData.images = {
        create: uploadedImages,
      };
    }

    // Remove undefined values to prevent Prisma issues
    Object.keys(offerData).forEach((key) => {
      if (offerData[key] === undefined) {
        delete offerData[key];
      }
    });

    // Final validation of offerData before creating offer
    if (!offerData || typeof offerData !== "object") {
      throw new Error("Invalid offer data structure");
    }
    if (!offerData.userId || typeof offerData.userId !== "string") {
      throw new Error("User ID is missing or invalid");
    }

    console.log("Offer data prepared:", {
      hasImages: !!offerData.images,
      imageCount: offerData.images?.create?.length || 0,
      userId: offerData.userId,
      title: offerData.title,
      requiredFieldsPresent: {
        title: !!offerData.title,
        description: !!offerData.description,
        price: !isNaN(offerData.price),
        availableDate: offerData.availableDate instanceof Date,
        address: !!offerData.address,
        city: !!offerData.city,
        zipCode: !!offerData.zipCode,
        country: !!offerData.country,
        propertyType: !!offerData.propertyType,
        roomType: !!offerData.roomType,
        genderPreference: !!offerData.genderPreference,
      },
    }); // Create the offer with images
    console.log(
      "Creating offer with data:",
      JSON.stringify(offerData, null, 2)
    );

    try {
      const offer = await prisma.offer.create({
        data: offerData,
        include: {
          images: true,
          user: true,
        },
      });

      console.log("Offer created successfully:", {
        id: offer.id,
        title: offer.title,
        imageCount: offer.images?.length || 0,
      });

      return {
        success: true,
        offer,
        message: "Offre créée avec succès!",
      };
    } catch (prismaError) {
      console.error("Prisma error creating offer:", {
        error: prismaError,
        message: prismaError.message,
        code: prismaError.code,
        meta: prismaError.meta,
      });
      throw new Error(`Database error: ${prismaError.message}`);
    }
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
    } = data; // Handle image uploads
    let uploadedImages = [];
    console.log("Processing images for update:", images?.length || 0);

    if (images && Array.isArray(images) && images.length > 0) {
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
        } else {
          console.warn(
            `Skipping invalid image data at index ${i + 1}:`,
            typeof image
          );
        }
      }
    }

    // Ensure uploadedImages is always an array
    if (!Array.isArray(uploadedImages)) {
      uploadedImages = [];
    }

    console.log("Total images processed for update:", uploadedImages.length); // Delete existing images and create new ones
    await prisma.offerImage.deleteMany({
      where: { offerId },
    });

    // Prepare the update data
    const updateData = {
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
    };

    // Only add images if we have valid uploadedImages array with content
    if (
      uploadedImages &&
      Array.isArray(uploadedImages) &&
      uploadedImages.length > 0
    ) {
      updateData.images = {
        create: uploadedImages,
      };
    }

    // Update the offer
    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: updateData,
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
      // return {
      //   success: false,
      //   error: "Vous devez être connecté pour publier une offre.",
      // };
      redirect("/sign-in");
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
    } // Update the offer status to pending (awaiting admin approval)
    await prisma.offer.update({
      where: { id: offerId },
      data: {
        status: "pending",
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Offre soumise pour approbation!",
    };
  } catch (error) {
    console.error("Error publishing offer:", error);
    return {
      success: false,
      error: error?.message || "Échec de la publication de l'offre",
    };
  }
}
