import http from "./api";

const dashboardService = {
  getStats: () => {
    return http.get("/api/dashboard/stats");
  },
  getHealthFull: () => {
    return http.get("/api/health/full");
  },
  getHealthLive: () => {
    return http.get("/api/health/live");
  },
  getRecentActivity: () => {
    return http.get("/api/dashboard/activity");
  },
};

export default dashboardService;
