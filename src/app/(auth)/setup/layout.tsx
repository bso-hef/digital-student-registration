import { redirect } from "next/navigation";

import { isSystemSetup } from "@/lib/auth/auth";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if setup is already complete
  // This runs in Node.js runtime (not edge), so we can use mongoose
  const setupComplete = await isSystemSetup();

  // If setup is complete, redirect to login
  if (setupComplete) {
    redirect("/login");
  }

  return <>{children}</>;
}
