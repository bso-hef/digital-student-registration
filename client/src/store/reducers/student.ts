import * as TYPES from "../types";
import { AppAction } from "./index";

interface StudentState {
  currentStep: number;
  loading: boolean;
  error: Error | null;
}

const initialStudentState: StudentState = {
  currentStep: 0,
  loading: false,
  error: null,
};

const studentReducer = (state = initialStudentState, action: AppAction) => {
  switch (action.type) {
    case TYPES.SET_STUDENT_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload,
      };
    default:
      return state;
  }
};

export default studentReducer;
