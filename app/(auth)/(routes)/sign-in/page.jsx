import SigninButton from "@/components/auth/signin-button";

const SigninPage = () => {
  return (
    <div className="w-full max-w-lg p-6 gap-4 grid">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl">🏡</h1>

        <div className="flex flex-col space-y-1.5">
          <h1 className="sm:text-center text-lg font-semibold leading-none tracking-tight">
            Welcome to FindColoc
          </h1>
          <p className="sm:text-center text-sm text-muted-foreground">
            Enter your credentials to login to your account.
          </p>
        </div>
      </div>

      <SigninButton />
    </div>
  );
};

export default SigninPage;
