// import { ThemeProvider } from "@/components/global/theme-provider";
// import { DM_Sans } from "next/font/google";
import { Lexend } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import ProfileGuard from "@/components/profile-guard";
import "./globals.css";

// const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });
const lexend = Lexend({ subsets: ["latin"] });

export const metadata = {
  title: "FindColoc.ma",
  description:
    "FindColoc.ma is a platform that helps you find the perfect roommate to share your apartment with.",
};

export default function RootLayout({ children, modal }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lexend.className} antialiased bg-slate-50`}>
        <SessionProvider>
          <ProfileGuard>
            {children}
            {modal}
          </ProfileGuard>
          <Toaster />
          <SonnerToaster />
          <HotToaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
