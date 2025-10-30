import { auth, isSystemSetup } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  // Check if system setup is complete
  const setupComplete = await isSystemSetup();

  // If setup is not complete, redirect to setup wizard
  if (!setupComplete) {
    redirect("/setup");
  }

  // Check if user is authenticated
  const session = await auth();

  // If authenticated, redirect to admin dashboard
  if (session) {
    redirect("/admin/dashboard");
  }

  // Otherwise, redirect to login
  redirect("/login");
}
