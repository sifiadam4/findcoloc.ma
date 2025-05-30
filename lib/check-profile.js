import { redirect } from "next/navigation";
import prisma from "./prisma";

export async function isProfileCompleted(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isProfileComplete: true,
      },
    });

    if (user?.isProfileComplete === true) {
      console.log("Profile is complete");
      redirect("/dashboard");
    }

    return user?.isProfileComplete || false;
  } catch (error) {
    console.error("Error checking profile completion:", error);
    return false;
  }
}

export async function checkProfileCompletion(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isProfileComplete: true,
        name: true,
        phonenumber: true,
        dob: true,
        gender: true,
        city: true,
      },
    });

    return {
      isComplete: user?.isProfileComplete || false,
      hasBasicInfo: !!(
        user?.name &&
        user?.phonenumber &&
        user?.dob &&
        user?.gender
      ),
      user,
    };
  } catch (error) {
    console.error("Error checking profile completion:", error);
    return {
      isComplete: false,
      hasBasicInfo: false,
      user: null,
    };
  }
}
