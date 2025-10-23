/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers } from "redux";

import appSettingsReducer from "./appSettings";
import classReducer from "./class";
import studentReducer from "./student";
import uiReducer from "./ui";

export interface AppAction {
  type: string;
  payload?: any;
  [key: string]: any;
}

const rootReducer = combineReducers({
  appSettings: appSettingsReducer,
  class: classReducer,
  student: studentReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
