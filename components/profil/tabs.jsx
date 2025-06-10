"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InfoTab from "@/components/profil/info-tab";
import ListingsTab from "@/components/profil/listings-tab";
import ReviewsTab from "@/components/profil/reviews-tab";
import { Info, Heart, Star } from "lucide-react";

export default function ProfileTabs({ user }) {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <Tabs
      defaultValue="info"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="mb-6">
        <TabsTrigger value="info" className="flex items-center gap-2">
          <Info className="h-4 w-4 md:mr-1" />
          <span className="hidden md:inline">Informations</span>
        </TabsTrigger>{" "}
        {/* Show listings tab only if user has offers or favorites */}
        {(user.offers?.length > 0 || user.favorites?.length > 0) && (
          <TabsTrigger value="listings" className="flex items-center gap-2">
            <Heart className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Annonces</span>
          </TabsTrigger>
        )}
        <TabsTrigger value="reviews" className="flex items-center gap-2">
          <Star className="h-4 w-4 md:mr-1" />
          <span className="hidden md:inline">Avis</span>
        </TabsTrigger>
      </TabsList>{" "}
      <TabsContent value="info">
        <InfoTab user={user} />
      </TabsContent>
      <TabsContent value="listings">
        <ListingsTab
          offers={user.offers}
          favorites={user.favorites}
          isCurrentUser={user.isCurrentUser}
        />
      </TabsContent>{" "}
      <TabsContent value="reviews">
        <ReviewsTab user={user} />
      </TabsContent>
    </Tabs>
  );
}
