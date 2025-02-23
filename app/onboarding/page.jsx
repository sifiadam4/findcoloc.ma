import MultiStep from "@/components/onboarding/multi-step";
import { isProfileCompleted } from "@/lib/check-profile";
import { getUser } from "@/lib/get-user";
import React from "react";

const OnboardingPage = async () => {
  const session = await getUser()
  await isProfileCompleted(session?.id);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
        <MultiStep />
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://plus.unsplash.com/premium_photo-1691849271923-46ac13043dbc?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default OnboardingPage;
