import {
  DashboardLayout,
  DashboardState,
  DashboardStats,
  HealthReport,
} from "@/types/dashboard";

import * as TYPES from "../types";
import { AppAction } from "./index";

const DEFAULT_LAYOUT: DashboardLayout = {
  quickStats: [
    "totalStudents",
    "totalClasses",
    "unassignedStudents",
    "activeClasses",
  ],
  charts: [
    "registrationTrend",
    "studentStatus",
    "classDistribution",
    "systemHealth",
  ],
};

const initialState: DashboardState = {
  stats: null,
  health: null,
  loading: false,
  error: null,
  lastUpdated: null,
  layout: DEFAULT_LAYOUT,
};

const dashboardReducer = (
  state = initialState,
  action: AppAction,
): DashboardState => {
  switch (action.type) {
    case TYPES.GET_DASHBOARD_STATS_REQUEST:
      return { ...state, loading: true, error: null };

    case TYPES.GET_DASHBOARD_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        stats: action.payload as DashboardStats,
        lastUpdated: new Date().toISOString(),
        error: null,
      };

    case TYPES.GET_DASHBOARD_STATS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload as string,
      };

    case TYPES.GET_DASHBOARD_HEALTH_REQUEST:
      return { ...state, error: null };

    case TYPES.GET_DASHBOARD_HEALTH_SUCCESS:
      return {
        ...state,
        health: action.payload as HealthReport,
        lastUpdated: new Date().toISOString(),
        error: null,
      };

    case TYPES.GET_DASHBOARD_HEALTH_FAILURE:
      return {
        ...state,
        error: action.payload as string,
      };

    case TYPES.SET_DASHBOARD_LAYOUT:
      return {
        ...state,
        layout: action.payload as DashboardLayout,
      };

    case TYPES.RESET_DASHBOARD_LAYOUT:
      return {
        ...state,
        layout: DEFAULT_LAYOUT,
      };

    default:
      return state;
  }
};

export default dashboardReducer;
