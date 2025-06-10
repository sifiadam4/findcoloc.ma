
import { Lexend } from "next/font/google";
import { SessionProvider } from "next-auth/react";
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
            {children}
            {modal}
        </SessionProvider>
      </body>
    </html>
  );
}
