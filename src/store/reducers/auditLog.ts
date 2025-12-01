import * as TYPES from "../types";
import { AppAction } from "../types";

export interface AuditLogEntry {
  _id: string;
  action: string;
  category: string;
  description: string;
  status: "success" | "failure" | "partial";
  userId: string;
  userName: string;
  userEmail?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface AuditLogStats {
  total: number;
  byCategory: Record<string, number>;
  byAction: Record<string, number>;
  byStatus: Record<string, number>;
  recentActivity: Record<string, number>;
  topUsers: Record<string, number>;
}

export interface AuditLogFilters {
  category?: string;
  action?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

interface AuditLogState {
  logs: AuditLogEntry[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  pages: number;
  filters: AuditLogFilters;
  stats: AuditLogStats | null;
  statsLoading: boolean;
  exporting: boolean;
  clearing: boolean;
}

const initialState: AuditLogState = {
  logs: [],
  loading: false,
  error: null,
  page: 1,
  limit: 25,
  total: 0,
  pages: 0,
  filters: {},
  stats: null,
  statsLoading: false,
  exporting: false,
  clearing: false,
};

const auditLogReducer = (
  state = initialState,
  action: AppAction,
): AuditLogState => {
  switch (action.type) {
    case TYPES.GET_AUDIT_LOGS_REQUEST:
      return { ...state, loading: true, error: null };

    case TYPES.GET_AUDIT_LOGS_SUCCESS: {
      const { logs, page, limit, total, pages } = action.payload;
      return {
        ...state,
        loading: false,
        logs: logs ?? [],
        page: page ?? state.page,
        limit: limit ?? state.limit,
        total: total ?? 0,
        pages: pages ?? 0,
        error: null,
      };
    }

    case TYPES.GET_AUDIT_LOGS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case TYPES.GET_AUDIT_LOG_STATS_REQUEST:
      return { ...state, statsLoading: true };

    case TYPES.GET_AUDIT_LOG_STATS_SUCCESS:
      return {
        ...state,
        statsLoading: false,
        stats: action.payload.stats,
      };

    case TYPES.GET_AUDIT_LOG_STATS_FAILURE:
      return { ...state, statsLoading: false };

    case TYPES.EXPORT_AUDIT_LOGS_REQUEST:
      return { ...state, exporting: true };

    case TYPES.EXPORT_AUDIT_LOGS_SUCCESS:
    case TYPES.EXPORT_AUDIT_LOGS_FAILURE:
      return { ...state, exporting: false };

    case TYPES.CLEAR_AUDIT_LOGS_REQUEST:
      return { ...state, clearing: true };

    case TYPES.CLEAR_AUDIT_LOGS_SUCCESS:
      return {
        ...state,
        clearing: false,
        logs: [],
        total: 0,
        pages: 0,
      };

    case TYPES.CLEAR_AUDIT_LOGS_FAILURE:
      return { ...state, clearing: false };

    case TYPES.SET_AUDIT_LOG_FILTERS:
      return { ...state, filters: action.payload, page: 1 };

    case TYPES.SET_AUDIT_LOG_PAGE:
      return { ...state, page: action.payload };

    default:
      return state;
  }
};

export default auditLogReducer;
