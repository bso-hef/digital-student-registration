import { isSystemSetup } from "@/lib/auth/auth";
import { getSetupCookieValue } from "@/lib/auth/setupCookie";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import ClientLayout from "./ClientLayout";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digitale Schüleranmeldung",
  description: "A platform for students to onboard digitally.",
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check both cookie and database state on EVERY request
  const cookieStore = await cookies();
  const cookieSaysComplete = getSetupCookieValue(cookieStore);
  const dbSaysComplete = await isSystemSetup();

  // If cookie says complete but database says not complete (e.g., DB was reset)
  // Clear the cookie and redirect to setup
  if (cookieSaysComplete && !dbSaysComplete) {
    console.log(
      "⚠️  Setup cookie/database mismatch detected - clearing cookie",
    );
    redirect("/api/auth/setup/clear?redirect=/setup");
  }

  // If database says not complete, redirect to setup
  // (unless already on setup page)
  if (!dbSaysComplete) {
    // Note: We don't check pathname here because middleware handles the actual routing
    // This just ensures the cookie is in sync with DB
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
