import { redirect } from "next/navigation";
import prisma from "./prisma";

export async function isProfileCompleted(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isProfileComplete: true,
      },
    });
  
    if (user?.isProfileComplete === true) {
      console.log("Profile is complete");
      redirect("/");
    }
  }