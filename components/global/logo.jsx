import { HousePlus } from "lucide-react";
import React from "react";

const Logo = () => {
  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 h-8 w-8 rounded-lg text-white flex items-center justify-center shadow-lg">
      <HousePlus className="size-5 drop-shadow-md" />
    </div>
  );
};

export default Logo;
