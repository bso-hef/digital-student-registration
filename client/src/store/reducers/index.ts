/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers } from "redux";

import studentReducer from "./student";
import uiReducer from "./ui";

export interface AppAction {
  type: string;
  payload?: any;
  [key: string]: any;
}

const rootReducer = combineReducers({
  student: studentReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
