import * as TYPES from "../types";
import { AppAction } from "../types";

export interface AuthUser {
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  phone?: string;
  jobTitle?: string;
  timezone?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setupCompleted: boolean;
  checkingSession: boolean;
  checkingSetup: boolean;
  setupWizardStep: number;
  setupWizardEmail: string;
  setupWizardPassword: string;
}

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  setupCompleted: false,
  checkingSession: false,
  checkingSetup: false,
  setupWizardStep: 0,
  setupWizardEmail: "",
  setupWizardPassword: "",
};

const authReducer = (state = initialAuthState, action: AppAction) => {
  switch (action.type) {
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
        setupWizardStep: 0,
        setupWizardEmail: "",
        setupWizardPassword: "",
      };

    case TYPES.AUTH_LOGOUT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

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

    case TYPES.AUTH_SYNC_SESSION:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      };

    case TYPES.AUTH_CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case TYPES.AUTH_UPDATE_SETUP_WIZARD:
      return {
        ...state,
        setupWizardStep: action.payload.step ?? state.setupWizardStep,
        setupWizardEmail: action.payload.email ?? state.setupWizardEmail,
        setupWizardPassword:
          action.payload.password ?? state.setupWizardPassword,
      };

    case TYPES.AUTH_CLEAR_SETUP_WIZARD:
      return {
        ...state,
        setupWizardStep: 0,
        setupWizardEmail: "",
        setupWizardPassword: "",
      };

    case TYPES.AUTH_UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case TYPES.AUTH_UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: state.user
          ? {
              ...state.user,
              firstName: action.payload.firstName,
              lastName: action.payload.lastName,
              avatar: action.payload.avatar,
              phone: action.payload.phone,
              jobTitle: action.payload.jobTitle,
              timezone: action.payload.timezone,
            }
          : null,
        error: null,
      };

    case TYPES.AUTH_UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case TYPES.AUTH_FETCH_PROFILE_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case TYPES.AUTH_FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: state.user
          ? {
              ...state.user,
              firstName: action.payload.firstName,
              lastName: action.payload.lastName,
              avatar: action.payload.avatar,
              phone: action.payload.phone,
              jobTitle: action.payload.jobTitle,
              timezone: action.payload.timezone,
            }
          : null,
        error: null,
      };

    case TYPES.AUTH_FETCH_PROFILE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
