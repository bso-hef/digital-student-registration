import * as TYPES from "../types";
import { AppAction } from "./index";

export interface AuthUser {
  email: string;
  role: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setupCompleted: boolean;
  checkingSession: boolean;
  checkingSetup: boolean;
}

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  setupCompleted: false,
  checkingSession: false,
  checkingSetup: false,
};

const authReducer = (state = initialAuthState, action: AppAction) => {
  switch (action.type) {
    // Login actions
    case TYPES.AUTH_LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case TYPES.AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };

    case TYPES.AUTH_LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    // Logout actions
    case TYPES.AUTH_LOGOUT_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case TYPES.AUTH_LOGOUT_SUCCESS:
      return {
        ...initialAuthState,
        setupCompleted: state.setupCompleted,
      };

    case TYPES.AUTH_LOGOUT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // Setup actions
    case TYPES.AUTH_SETUP_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case TYPES.AUTH_SETUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        setupCompleted: true,
        error: null,
      };

    case TYPES.AUTH_SETUP_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // Reset password actions
    case TYPES.AUTH_RESET_PASSWORD_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case TYPES.AUTH_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };

    case TYPES.AUTH_RESET_PASSWORD_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    // Check session actions
    case TYPES.AUTH_CHECK_SESSION_REQUEST:
      return {
        ...state,
        checkingSession: true,
      };

    case TYPES.AUTH_CHECK_SESSION_SUCCESS:
      return {
        ...state,
        checkingSession: false,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      };

    case TYPES.AUTH_CHECK_SESSION_FAILURE:
      return {
        ...state,
        checkingSession: false,
        isAuthenticated: false,
        user: null,
      };

    // Check setup status actions
    case TYPES.AUTH_CHECK_SETUP_REQUEST:
      return {
        ...state,
        checkingSetup: true,
      };

    case TYPES.AUTH_CHECK_SETUP_SUCCESS:
      return {
        ...state,
        checkingSetup: false,
        setupCompleted: action.payload,
      };

    case TYPES.AUTH_CHECK_SETUP_FAILURE:
      return {
        ...state,
        checkingSetup: false,
      };

    // Sync session (for when session changes externally)
    case TYPES.AUTH_SYNC_SESSION:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      };

    // Clear error
    case TYPES.AUTH_CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default authReducer;
