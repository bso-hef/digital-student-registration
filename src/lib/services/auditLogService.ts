import http from "./api";

export interface AuditLogFilters {
  category?: string;
  action?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

const auditLogService = {
  getAll: (params?: AuditLogFilters) => {
    return http.get("/api/audit-logs", { params });
  },
  getStats: () => {
    return http.get("/api/audit-logs/stats");
  },
  export: (format: "csv" | "json", filters?: AuditLogFilters) => {
    return http.get("/api/audit-logs/export", {
      params: { format, ...filters },
      responseType: "blob",
    });
  },
  clearLogs: () => {
    return http.delete("/api/audit-logs");
  },
  deleteSelected: (ids: string[]) => {
    return http.post("/api/audit-logs/delete", { ids });
  },
};

export default auditLogService;
