import {
  Shield,
  CheckCircle,
  MessageCircle,
  Edit,
  Share2,
  Flag,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileHeader({ user }) {
  // Generate stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="bg-primary/5 h-32 md:h-48 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-moroccan-pattern opacity-10"></div>
      </div>

      <div className="px-6 pb-6 relative">
        {" "}
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <Avatar className="h-32 w-32 border-4 border-white shadow-md">
            <AvatarImage
              src={user.image || "/placeholder.svg"}
              alt={user.name || "User"}
            />
            <AvatarFallback className="text-4xl bg-primary text-white">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </div>
        {/* Action buttons */}
        <div className="flex justify-end pt-4 mb-16 md:mb-0">
          {user.isCurrentUser ? (
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <Edit className="h-4 w-4 mr-2" />
              Modifier mon profil
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button className="">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contacter
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full text-red-500 hover:text-red-600"
              >
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>{" "}
        {/* User info */}
        <div className="md:ml-36 md:pt-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {user.name || "Utilisateur"}
            </h1>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            {/* Verification badges */}
            <div className="flex gap-2">
              {user.identityVerified && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-600 border-green-600 flex items-center gap-1"
                >
                  <Shield className="h-3 w-3" /> Identité vérifiée
                </Badge>
              )}
              {user.phoneVerified && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-600 border-green-600 flex items-center gap-1"
                >
                  <CheckCircle className="h-3 w-3" /> Téléphone vérifié
                </Badge>
              )}
              {user.emailVerified && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-600 border-green-600 flex items-center gap-1"
                >
                  <CheckCircle className="h-3 w-3" /> Email vérifié
                </Badge>
              )}
            </div>

            {/* Rating */}
            {user.rating > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex">{renderStars(user.rating)}</div>
                <span className="text-gray-700">
                  {user.rating} ({user.reviewCount} avis)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
