import { combineReducers } from "redux";

import appSettingsReducer from "./appSettings";
import auditLogReducer from "./auditLog";
import authReducer from "./auth";
import classReducer from "./class";
import dashboardReducer from "./dashboard";
import studentReducer from "./student";
import uiReducer from "./ui";

// Re-export AppAction from types for backwards compatibility
export { AppAction } from "../types";

const rootReducer = combineReducers({
  appSettings: appSettingsReducer,
  auditLog: auditLogReducer,
  auth: authReducer,
  class: classReducer,
  dashboard: dashboardReducer,
  student: studentReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
