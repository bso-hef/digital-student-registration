import { isSystemSetup } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if setup is already complete
  // This runs in Node.js runtime (not edge), so we can use mongoose
  const setupComplete = await isSystemSetup();

  // If setup is complete, redirect through the sync endpoint
  // The sync endpoint will set the cookie (can only be done in route handler)
  // and then redirect to login
  if (setupComplete) {
    redirect("/api/auth/setup/sync?redirect=/login");
  }

  return <>{children}</>;
}
