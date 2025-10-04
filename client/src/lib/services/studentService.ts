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
  create: (students: CreateStudentInput[]) => {
    return http.post("/api/students", { students });
  },
};

export default studentService;
