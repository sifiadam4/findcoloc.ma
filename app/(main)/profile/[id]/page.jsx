import ProfileHeader from "@/components/profil/header";
import ProfileTabs from "@/components/profil/tabs";
import { getUserById } from "@/actions/user";
import { auth } from "@/auth";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }) {
  const { id } = params;
  const session = await auth();

  try {
    // Fetch user data from database
    const userData = await getUserById(id);

    if (!userData) {
      notFound();
    }

    // Check if this is the current user's profile
    const isCurrentUser = session?.user?.id === id;

    // Add calculated fields for UI
    const userWithUIData = {
      ...userData,
      isCurrentUser,
    };

    return (
      <main className="flex-grow pt-6 pb-16">
        <div className="container mx-auto px-4">
          <ProfileHeader user={userWithUIData} />
          <ProfileTabs user={userWithUIData} />
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error loading profile:", error);
    notFound();
  }
}
