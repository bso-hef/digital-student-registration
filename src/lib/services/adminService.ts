import http from "./api";

export interface AdminAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  lastLogin: string | null;
  createdAt: string;
  isCurrentUser: boolean;
}

export interface AdminInput {
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  password?: string;
}

interface AdminListResponse {
  success: boolean;
  data: AdminAccount[];
}

interface AdminResponse {
  success: boolean;
  data: AdminAccount;
  recoveryCode?: string;
}

const adminService = {
  getAll: () => http.get<AdminListResponse>("/api/admins"),
  create: (data: AdminInput) => http.post<AdminResponse>("/api/admins", data),
  update: (id: string, data: AdminInput) =>
    http.patch<AdminResponse>(`/api/admins/${id}`, data),
  delete: (id: string) =>
    http.delete<{ success: boolean }>(`/api/admins/${id}`),
};

export default adminService;
