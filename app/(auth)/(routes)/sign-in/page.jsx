import React from "react";
import SigninButton from "@/components/auth/signin-button";
import Logo from "@/components/global/logo";

const SigninPage = ({ searchParams }) => {
  const params = React.use(searchParams);
  const callbackUrl = params?.callbackUrl;

  return (
    <div className="w-full max-w-lg p-6 gap-4 grid">
      <div className="flex flex-col items-center gap-2">
        {/* <h1 className="text-3xl">🏡</h1> */}
        <Logo />

        <div className="flex flex-col space-y-1.5">
          <h1 className="sm:text-center text-lg font-semibold leading-none tracking-tight">
            Welcome to FindColoc
          </h1>
          <p className="sm:text-center text-sm text-muted-foreground">
            {callbackUrl
              ? "Connectez-vous pour accéder à cette page."
              : "Enter your credentials to login to your account."}
          </p>
        </div>
      </div>

      <SigninButton callbackUrl={callbackUrl} />
    </div>
  );
};

export default SigninPage;
