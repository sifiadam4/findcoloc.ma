import { ThemeProvider } from "@/components/theme-provider";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: "FindColoc.ma",
  description:
    "FindColoc.ma is a platform that helps you find the perfect roommate to share your apartment with.",
};

export default function RootLayout({ children, modal }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.className} antialiased`} >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {modal}
        </ThemeProvider>
      </body>
    </html>
  );
}
