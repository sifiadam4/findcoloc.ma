import Logo from "@/components/global/logo";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-[70%_30%]">
      <div className="flex flex-col ">
        {/* Main Content */}
        <div className="flex flex-1 items-start justify-center p-6">
          <div className="w-full">
            <OnboardingWizard user={session.user} />
          </div>
        </div>
      </div>

      {/* Right Sidebar with Image */}
      <div className="relative hidden bg-muted lg:block lg:fixed lg:right-0 lg:top-0 lg:w-[30vw] lg:h-full">
        <img
          src="https://images.unsplash.com/photo-1748183346959-dfeec5ade5d9?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="People living together"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent p-10">
          <a href="/" className="flex items-center gap-1">
            <Logo />
            <h1 className="font-semibold text-2xl tracking-tight text-white">
              Find<span className="text-primary">Coloc</span>
            </h1>
          </a>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-10">
          <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
            Find Your Perfect Roommate
          </h2>
          <p className="text-white/80">
            Complete your profile to find compatible roommates and the perfect
            place to live
          </p>
        </div>
      </div>
    </div>
  );
}
