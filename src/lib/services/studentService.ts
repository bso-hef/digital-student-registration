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
  getForAssignment: () => {
    return http.get("/api/students?forAssignment=true&limit=200");
  },
  create: (students: CreateStudentInput[]) => {
    return http.post("/api/students", { students });
  },
  delete: (ids: string[]) => {
    return http.delete("/api/students", { data: { ids } });
  },
  // Verification method
  verify: (firstName: string, lastName: string, verificationCode: string) => {
    return http.post("/api/students/verify", {
      firstName,
      lastName,
      verificationCode,
    });
  },
  // Duplicate check method
  checkDuplicate: (
    firstName: string,
    lastName: string,
    dateOfBirth: string | Date,
  ) => {
    // Format date as ISO string if it's a Date object
    const dobString =
      dateOfBirth instanceof Date
        ? dateOfBirth.toISOString()
        : dateOfBirth.toString();

    return http.get("/api/students/check-duplicate", {
      params: {
        firstName,
        lastName,
        dateOfBirth: dobString,
      },
    });
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
  // Class assignment method
  updateClass: (id: string, classId: string | null) => {
    return http.patch(`/api/students/${id}`, { currentClass: classId });
  },
};

export default studentService;
