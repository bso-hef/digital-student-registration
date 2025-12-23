import {
  DashboardLayout,
  DashboardState,
  DashboardStats,
  HealthReport,
  RecentActivityItem,
} from "@/types/dashboard";

import * as TYPES from "../types";
import { AppAction } from "../types";

const DEFAULT_LAYOUT: DashboardLayout = {
  quickStats: [
    "totalStudents",
    "totalClasses",
    "unassignedStudents",
    "onboardingProgress",
  ],
  charts: [
    "registrationTrend",
    "studentStatus",
    "classDistribution",
    "recentActivity",
  ],
  isLocked: true,
};

const initialState: DashboardState = {
  stats: null,
  health: null,
  recentActivity: [],
  activityLoading: false,
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

    case TYPES.TOGGLE_DASHBOARD_LOCK:
      return {
        ...state,
        layout: {
          ...state.layout,
          isLocked: !state.layout.isLocked,
        },
      };

    case TYPES.GET_DASHBOARD_ACTIVITY_REQUEST:
      return { ...state, activityLoading: true };

    case TYPES.GET_DASHBOARD_ACTIVITY_SUCCESS:
      return {
        ...state,
        activityLoading: false,
        recentActivity: action.payload as RecentActivityItem[],
      };

    case TYPES.GET_DASHBOARD_ACTIVITY_FAILURE:
      return {
        ...state,
        activityLoading: false,
      };

    default:
      return state;
  }
};

export default dashboardReducer;
