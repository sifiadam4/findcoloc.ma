import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        isProfileComplete: true,
        name: true,
        phonenumber: true,
        dob: true,
        gender: true,
        city: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      isComplete: user.isProfileComplete || false,
      hasBasicInfo: !!(
        user.name &&
        user.phonenumber &&
        user.dob &&
        user.gender
      ),
      user: {
        name: user.name,
        phonenumber: user.phonenumber,
        dob: user.dob,
        gender: user.gender,
        city: user.city,
      },
    });
  } catch (error) {
    console.error("Error checking profile status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
