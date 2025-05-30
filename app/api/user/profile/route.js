import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const data = await request.json();

    // Handle file uploads if present
    let frontImageUrl = null;
    let backImageUrl = null;
    let selfieImageUrl = null;

    if (data.frontImage) {
      const frontUpload = await cloudinary.uploader.upload(data.frontImage, {
        folder: "profile_verification",
        public_id: `${userId}_front_${Date.now()}`,
      });
      frontImageUrl = frontUpload.secure_url;
    }

    if (data.backImage) {
      const backUpload = await cloudinary.uploader.upload(data.backImage, {
        folder: "profile_verification",
        public_id: `${userId}_back_${Date.now()}`,
      });
      backImageUrl = backUpload.secure_url;
    }

    if (data.selfieImage) {
      const selfieUpload = await cloudinary.uploader.upload(data.selfieImage, {
        folder: "profile_verification",
        public_id: `${userId}_selfie_${Date.now()}`,
      });
      selfieImageUrl = selfieUpload.secure_url;
    }

    // Prepare user data for update
    const userUpdateData = {
      name: data.name,
      phonenumber: data.phonenumber,
      dob: data.dob ? new Date(data.dob) : null,
      gender: data.gender,
      city: data.city,
      occupation: data.occupation,
      university: data.university,
      yearStady: data.yearStady,
      company: data.company,
      jobTitle: data.jobTitle,
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

    // Update user in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user data
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: userUpdateData,
      });

      // Handle ID verification documents
      if (data.idType && (frontImageUrl || backImageUrl || selfieImageUrl)) {
        if (data.idType === "id_card") {
          // Create or update ID card record
          await tx.idCard.upsert({
            where: { userId },
            create: {
              userId,
              frontPath: frontImageUrl || "",
              backPath: backImageUrl || "",
              selfiePath: selfieImageUrl || "",
            },
            update: {
              frontPath: frontImageUrl || undefined,
              backPath: backImageUrl || undefined,
              selfiePath: selfieImageUrl || undefined,
            },
          });
        } else if (data.idType === "passport") {
          // Create or update passport record
          await tx.passport.upsert({
            where: { userId },
            create: {
              userId,
              frontPath: frontImageUrl || "",
              backPath: backImageUrl || "",
              selfiePath: selfieImageUrl || "",
            },
            update: {
              frontPath: frontImageUrl || undefined,
              backPath: backImageUrl || undefined,
              selfiePath: selfieImageUrl || undefined,
            },
          });
        }
      }

      return updatedUser;
    });

    return NextResponse.json({
      success: true,
      user: result,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
