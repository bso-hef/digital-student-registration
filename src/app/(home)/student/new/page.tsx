"use client";

import CreateStudentModal from "@/components/organisms/modals/CreateStudentModal";
import { useRouter } from "next/navigation";

/**
 * Dedicated entry point for new profiles. Existing profiles continue to use
 * /student for verification before entering onboarding.
 */
export default function NewStudentPage() {
  const router = useRouter();

  return (
    <CreateStudentModal
      open
      onClose={() => {
        router.replace("/student");
      }}
    />
  );
}
