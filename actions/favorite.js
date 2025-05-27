"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function checkIsFavorited(offerId) {
  try {
    const session = await auth();

    const userId = session.user.id;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_offerId: {
          userId,
          offerId: offerId,
        },
      },
    });

    return !!favorite;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
}

export async function toggleFavorite(offerId) {
  try {
    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    const userId = session.user.id;

    // Check current favorite status
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_offerId: {
          userId,
          offerId,
        },
      },
    });

    if (existingFavorite) {
      // Remove from favorites
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });

      // Revalidate relevant pages
      revalidatePath("/mes-favoris");
      revalidatePath("/");

      return {
        success: true,
        message: "Removed from favorites!",
        isFavorited: false,
      };
    } else {
      // Add to favorites
      await prisma.favorite.create({
        data: {
          userId,
          offerId,
        },
      });

      // Revalidate relevant pages
      revalidatePath("/mes-favoris");
      revalidatePath("/");

      return {
        success: true,
        message: "Added to favorites!",
        isFavorited: true,
      };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { success: false, error: "Failed to update favorites" };
  }
}

export async function getFavorites(query = "", sort = "recent") {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  try {
    // Base query
    const where = { userId };

    // Add search query filter if provided
    // const offerFilter = query
    //   ? {
    //       offer: {
    //         OR: [
    //           { title: { contains: query, mode: "insensitive" } },
    //           { city: { contains: query, mode: "insensitive" } },
    //           { description: { contains: query, mode: "insensitive" } },
    //           { address: { contains: query, mode: "insensitive" } },
    //         ],
    //       },
    //     }
    //   : {};

    // Combine filters
    // const finalWhere = {
    //   ...where,
    //   ...offerFilter,
    // };

    // Determine sort order
    // let orderBy = {};
    // switch (sort) {
    //   case "oldest":
    //     orderBy = { createdAt: "asc" };
    //     break;
    //   case "price_asc":
    //     orderBy = { offer: { price: "asc" } };
    //     break;
    //   case "price_desc":
    //     orderBy = { offer: { price: "desc" } };
    //     break;
    //   case "availability":
    //     orderBy = { offer: { availableDate: "asc" } };
    //     break;
    //   default: // "recent" is the default
    //     orderBy = { createdAt: "desc" };
    //     break;
    // }

    // Execute query with filters and sorting
    const favorites = await prisma.favorite.findMany({
      where,
      include: {
        offer: {
          include: {
            images: true,
          },
        },
      },
      // orderBy,
    });

    return favorites;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw new Error("Failed to fetch favorites");
  }
}