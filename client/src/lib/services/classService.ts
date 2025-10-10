import { ClassCreateInput } from "@/types/class";

import http from "./api";

export type ClassPatch = Partial<ClassCreateInput>;

const classService = {
  getAll: () => {
    return http.get("/api/classes");
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
};

export default classService;
