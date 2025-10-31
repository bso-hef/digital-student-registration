import http from "./api";

type CreateStudentInput = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    timezone?: string;
  };
  status?: "imported" | "invited" | "onboarded";
};

const studentService = {
  getAll: () => {
    return http.get("/api/students");
  },
  getById: (id: string) => {
    return http.get(`/api/students/${id}`);
  },
  getUnassigned: () => {
    return http.get("/api/students?unassigned=true");
  },
  create: (students: CreateStudentInput[]) => {
    return http.post("/api/students", { students });
  },
  delete: (ids: string[]) => {
    return http.delete("/api/students", { data: { ids } });
  },
  // Onboarding methods
  updateOnboarding: (id: string, data: Record<string, unknown>) => {
    return http.patch(`/api/students/${id}/onboarding`, data);
  },
  submitOnboarding: (id: string, data: Record<string, unknown>) => {
    return http.patch(`/api/students/${id}/onboarding`, {
      ...data,
      finalSubmit: true,
    });
  },
};

export default studentService;
