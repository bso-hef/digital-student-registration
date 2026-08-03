import { ClassCreateInput } from "@/types/class";

import http from "./api";

export type ClassPatch = Partial<ClassCreateInput>;

const classService = {
  getAll: (page: number, limit: number, search?: string) => {
    return http.get("/api/classes", {
      params: { page, limit, search: search || undefined },
    });
  },
  getPublic: () => {
    return http.get("/api/classes/public");
  },
  get: (id: string) => {
    return http.get(`/api/classes/${id}`);
  },
  create: (classes: ClassCreateInput[]) => {
    return http.post("/api/classes", { classes });
  },
  delete: (ids: string[]) => {
    return http.delete("/api/classes", { data: { ids } });
  },
  patch: (id: string, patch: ClassPatch) => {
    return http.patch(`/api/classes/${id}`, patch);
  },
  getStudentsInClass: (classId: string) => {
    return http.get(`/api/classes/${classId}/students`);
  },
  addStudentsToClass: (classId: string, studentIds: string[]) => {
    return http.post(`/api/classes/${classId}/students`, { studentIds });
  },
  removeStudentsFromClass: (classId: string, studentIds: string[]) => {
    return http.delete(`/api/classes/${classId}/students`, {
      data: { studentIds },
    });
  },
  checkClasses: (classNames: string[]) => {
    return http.post<{
      existing: string[];
      missing: string[];
      classMap: Record<string, string>;
    }>("/api/classes/check", { classNames });
  },
};

export default classService;
