import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/actions/favorite";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const FavorisButton = ({ offerId, isFavorited }) => {
  return (
    <form action={toggleFavorite.bind(null, offerId)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              type="submit"
              className="absolute top-3 right-3 bg-white/80 rounded-full p-1.5 hover:bg-white transition-colors"
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </form>
  );
};

export default FavorisButton;
