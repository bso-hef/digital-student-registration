import { AppThunk } from "../store";
import * as TYPES from "../types";

export const setCurrentStudentOnboardingStep =
  (step: number): AppThunk =>
  (dispatch) => {
    dispatch({
      type: TYPES.SET_STUDENT_CURRENT_STEP,
      payload: step,
    });
  };
