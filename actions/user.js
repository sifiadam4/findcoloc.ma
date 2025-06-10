"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function updateUserProfile(data) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    console.log("Processing profile update for user:", userId);
    console.log("Data received:", {
      ...data,
      frontImage: data.frontImage ? "base64 data present" : "no data",
      backImage: data.backImage ? "base64 data present" : "no data",
      selfieImage: data.selfieImage ? "base64 data present" : "no data",
    });

    // Validate required verification data
    if (!data.idType) {
      throw new Error("ID type is required for profile completion");
    }

    if (!data.frontImage || !data.backImage || !data.selfieImage) {
      throw new Error(
        "All verification documents (front, back, and selfie) are required"
      );
    }

    // Handle file uploads if present
    let frontImageUrl = null;
    let backImageUrl = null;
    let selfieImageUrl = null;

    if (data.frontImage) {
      console.log("Uploading front image to Cloudinary...");
      const frontUpload = await cloudinary.uploader.upload(data.frontImage, {
        folder: "profile_verification",
        public_id: `${userId}_front_${Date.now()}`,
      });
      frontImageUrl = frontUpload.secure_url;
      console.log("Front image uploaded:", frontImageUrl);
    }

    if (data.backImage) {
      console.log("Uploading back image to Cloudinary...");
      const backUpload = await cloudinary.uploader.upload(data.backImage, {
        folder: "profile_verification",
        public_id: `${userId}_back_${Date.now()}`,
      });
      backImageUrl = backUpload.secure_url;
      console.log("Back image uploaded:", backImageUrl);
    }

    if (data.selfieImage) {
      console.log("Uploading selfie image to Cloudinary...");
      const selfieUpload = await cloudinary.uploader.upload(data.selfieImage, {
        folder: "profile_verification",
        public_id: `${userId}_selfie_${Date.now()}`,
      });
      selfieImageUrl = selfieUpload.secure_url;
      console.log("Selfie image uploaded:", selfieImageUrl);
    }

    // Prepare user data for update
    const userUpdateData = {
      name: data.name,
      phonenumber: data.phonenumber,
      dob: data.dob ? new Date(data.dob) : null,
      gender: data.gender,
      city: data.city,
      occupation: data.occupation,
      // university: data.university,
      // yearStady: data.yearStady,
      // company: data.company,
      // jobTitle: data.jobTitle,
      bio: data.bio,
      genderPreference: data.genderPreference,
      maxBudget: data.maxBudget,
      minBudget: data.minBudget,
      smokingAllowed: data.smokingAllowed,
      petsAllowed: data.petsAllowed,
      visitorsAllowed: data.visitorsAllowed,
      partyAllowed: data.partyAllowed,
      isProfileComplete: true, // Mark profile as complete
    };

    console.log("User update data:", userUpdateData);

    // Update user in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user data
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: userUpdateData,
      });

      console.log("User updated successfully");

      // Handle ID verification documents
      if (data.idType && (frontImageUrl || backImageUrl || selfieImageUrl)) {
        console.log("Processing ID verification documents:", {
          idType: data.idType,
          hasImages: {
            front: !!frontImageUrl,
            back: !!backImageUrl,
            selfie: !!selfieImageUrl,
          },
        });

        if (data.idType === "id_card") {
          console.log("Creating/updating ID card record...");
          const idCardResult = await tx.idCard.upsert({
            where: { userId },
            create: {
              userId,
              frontPath: frontImageUrl || "",
              backPath: backImageUrl || "",
              selfiePath: selfieImageUrl || "",
            },
            update: {
              ...(frontImageUrl && { frontPath: frontImageUrl }),
              ...(backImageUrl && { backPath: backImageUrl }),
              ...(selfieImageUrl && { selfiePath: selfieImageUrl }),
            },
          });
          console.log("ID card record processed:", idCardResult);
        } else if (data.idType === "passport") {
          console.log("Creating/updating passport record...");
          const passportResult = await tx.passport.upsert({
            where: { userId },
            create: {
              userId,
              frontPath: frontImageUrl || "",
              backPath: backImageUrl || "",
              selfiePath: selfieImageUrl || "",
            },
            update: {
              ...(frontImageUrl && { frontPath: frontImageUrl }),
              ...(backImageUrl && { backPath: backImageUrl }),
              ...(selfieImageUrl && { selfiePath: selfieImageUrl }),
            },
          });
          console.log("Passport record processed:", passportResult);
        }
      } else {
        console.log("No ID verification documents to process");
      }

      return updatedUser;
    });

    console.log("Transaction completed successfully");

    // Revalidate paths
    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return { success: true, user: result };
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update profile");
  }
}

export async function getUserById(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        idCard: true,
        passport: true,
        offers: {
          include: {
            images: true,
          },
        },
        reviewsReceived: {
          include: {
            author: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Failed to fetch user");
  }
}

export async function getUserDetailsForAdmin(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        idCard: true,
        passport: true,
        offers: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            offers: true,
            applications: true,
            reviewsGiven: true,
            reviewsReceived: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user details for admin:", error);
    throw new Error("Failed to fetch user details");
  }
}
