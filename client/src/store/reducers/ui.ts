import * as TYPES from "../types";
import { AppAction } from "./index";

interface UIState {
  documnetDraggedOver: boolean;
  appTouched: boolean;
  theme: string;
  locale: string;
  loading: boolean;
  error: Error | null;
}

const initialUIState: UIState = {
  documnetDraggedOver: false,
  appTouched: false,
  theme: "dark",
  locale: "en",
  loading: false,
  error: null,
};

const uiReducer = (state = initialUIState, action: AppAction) => {
  switch (action.type) {
    case TYPES.SET_DOCUMENT_DRAGGED_OVER:
      return {
        ...state,
        documnetDraggedOver: action.payload,
      };
    case TYPES.SET_APP_TOUCHED:
      return {
        ...state,
        appTouched: action.payload,
      };
    case TYPES.CHANGE_APPLICATION_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    case TYPES.CHANGE_APPLICATION_LOCALE:
      return {
        ...state,
        locale: action.payload,
      };
    default:
      return state;
  }
};

export default uiReducer;
