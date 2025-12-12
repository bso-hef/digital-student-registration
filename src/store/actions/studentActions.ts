import studentService from "@/lib/services/studentService";
import { OnboardingErrorCode, ValidationError } from "@/types/errors";
import { CreateStudentInput, StudentData } from "@/types/student";
import {
  errorNotification,
  successNotification,
} from "@/utils/notification.utils";
import {
  mapFormDataToModel,
  mapModelToFormData,
} from "@/utils/studentDataMapper";
import i18n from "i18next";

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

export const getStudents = (): AppThunk => async (dispatch) => {
  dispatch({ type: TYPES.GET_STUDENTS_REQUEST });
  try {
    const { data } = await studentService.getAll();

    dispatch({ type: TYPES.GET_STUDENTS_SUCCESS, payload: data.students });
  } catch (error) {
    errorNotification(i18n.t("actions.studentFetchFailed"));
    dispatch({ type: TYPES.GET_STUDENTS_FAILURE, payload: error });
  }
};

export const addStudents =
  (students: CreateStudentInput[]): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.ADD_STUDENTS_REQUEST });
    try {
      const { data } = await studentService.create(students);

      dispatch({
        type: TYPES.ADD_STUDENTS_SUCCESS,
        payload: data.created,
      });

      successNotification(i18n.t("actions.studentAddSuccess"));
      // Refetch students to get populated class data
      dispatch(getStudents());
    } catch (error) {
      errorNotification(i18n.t("actions.studentAddFailed"));
      dispatch({ type: TYPES.ADD_STUDENTS_FAILURE, payload: error });
    }
  };

export const deleteStudents =
  (ids: string[]): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.DELETE_STUDENTS_REQUEST });
    try {
      await studentService.delete(ids);

      dispatch({ type: TYPES.DELETE_STUDENTS_SUCCESS, payload: ids });
      successNotification(i18n.t("actions.studentDeleteSuccess"));
      // Refetch students for consistency
      dispatch(getStudents());
    } catch (error) {
      errorNotification(i18n.t("actions.studentDeleteFailed"));
      dispatch({ type: TYPES.DELETE_STUDENTS_FAILURE, payload: error });
    }
  };

// ===== Student Verification Action =====

/**
 * Verifies student identity using first name, last name, and verification code
 * Returns student ID on success, which can be used to load onboarding
 */
export const verifyStudent =
  (firstName: string, lastName: string, verificationCode: string): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.VERIFY_STUDENT_REQUEST });
    try {
      const { data } = await studentService.verify(
        firstName,
        lastName,
        verificationCode,
      );

      dispatch({
        type: TYPES.VERIFY_STUDENT_SUCCESS,
        payload: data,
      });

      successNotification(i18n.t("actions.verificationSuccess"));

      return data.studentId; // Return for navigation
    } catch (error) {
      // Extract specific error message from API response
      const err = error as { response?: { data?: { error?: string } } };
      const errorMessage =
        err?.response?.data?.error || i18n.t("actions.verificationFailed");

      errorNotification(errorMessage);
      dispatch({
        type: TYPES.VERIFY_STUDENT_FAILURE,
        payload: error,
      });

      throw error; // Re-throw for component to handle
    }
  };

// ===== Student Onboarding Actions =====

/**
 * Updates student onboarding data in Redux
 * This is called after each form submission to persist data across steps
 */
export const updateStudentOnboardingData =
  (data: Partial<StudentData>): AppThunk =>
  (dispatch) => {
    dispatch({
      type: TYPES.UPDATE_STUDENT_ONBOARDING_DATA,
      payload: data,
    });
  };

/**
 * Clears student onboarding data from Redux
 * Called after successful onboarding completion or when starting fresh
 */
export const clearStudentOnboardingData = (): AppThunk => (dispatch) => {
  dispatch({ type: TYPES.CLEAR_STUDENT_ONBOARDING_DATA });
};

/**
 * Clears student error state
 * Called when retrying after an error or when error should be dismissed
 */
export const clearStudentError = (): AppThunk => (dispatch) => {
  dispatch({ type: TYPES.CLEAR_STUDENT_ERROR });
};

/**
 * Validates MongoDB ObjectId format
 * @param id - String to validate
 * @returns true if valid ObjectId format
 */
function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

/**
 * Loads student data for onboarding
 * Fetches student from database and pre-fills form data
 * Performs comprehensive validation before allowing onboarding
 */
export const loadStudentForOnboarding =
  (studentId: string): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.LOAD_STUDENT_FOR_ONBOARDING_REQUEST });
    try {
      // Validation 1: Check if studentId is valid MongoDB ObjectId format
      if (!isValidObjectId(studentId)) {
        throw new ValidationError(
          "Invalid student ID format",
          OnboardingErrorCode.INVALID_STUDENT_ID,
        );
      }

      const response = await studentService.getById(studentId);
      const data = response.data.data;

      // Validation 2: Check if student exists in system
      if (!data) {
        throw new ValidationError(
          "Student not found",
          OnboardingErrorCode.STUDENT_NOT_FOUND,
        );
      }

      // Validation 3: Check if student has already completed onboarding
      if (data.status === "onboarded") {
        throw new ValidationError(
          "Student has already completed onboarding",
          OnboardingErrorCode.ALREADY_ONBOARDED,
        );
      }

      // Extract currentClass from populated field (if available)
      // Note: currentClass can be null - students can onboard without class assignment
      const currentClass =
        typeof data.currentClass === "object" && data.currentClass !== null
          ? data.currentClass
          : null;

      // Convert database model (English) to form data (German)
      const formData = mapModelToFormData(data);

      // Get onboarding step from database (default to 0 if not set)
      const onboardingStep = data.onboardingStep || 0;
      const previousStep = data.previousStep ?? null;

      dispatch({
        type: TYPES.LOAD_STUDENT_FOR_ONBOARDING_SUCCESS,
        payload: {
          student: data,
          formData,
          currentClass,
          status: data.status,
          onboardingStep,
          previousStep,
          studentId, // Include studentId in payload
        },
      });
    } catch (error) {
      errorNotification(i18n.t("actions.studentLoadFailed"));
      dispatch({
        type: TYPES.LOAD_STUDENT_FOR_ONBOARDING_FAILURE,
        payload: error,
      });
    }
  };

/**
 * Saves onboarding progress to database (auto-save)
 * Called after each step to persist data
 */
export const saveOnboardingProgress =
  (
    studentId: string,
    formData: Partial<StudentData>,
    currentStep?: number,
    previousStep?: number | null,
  ): AppThunk =>
  async (dispatch, getState) => {
    dispatch({ type: TYPES.SAVE_ONBOARDING_PROGRESS_REQUEST });
    try {
      // Convert form data (German) to database model (English)
      const modelData = mapFormDataToModel(formData);

      // Get previousStep from Redux state if not provided
      const state = getState();
      const prevStep =
        previousStep !== undefined
          ? previousStep
          : (state.student.previousStep ?? null);

      // Add current step and previousStep if provided
      const dataToSave =
        currentStep !== undefined
          ? {
              ...modelData,
              onboardingStep: currentStep,
              previousStep: prevStep,
            }
          : modelData;

      const { data } = await studentService.updateOnboarding(
        studentId,
        dataToSave,
      );

      dispatch({
        type: TYPES.SAVE_ONBOARDING_PROGRESS_SUCCESS,
        payload: data,
      });

      // Silent success - no notification for auto-save
    } catch (error) {
      // Don't show error notification for auto-save failures
      // Just log to console for debugging
      console.error("Auto-save failed:", error);
      dispatch({
        type: TYPES.SAVE_ONBOARDING_PROGRESS_FAILURE,
        payload: error,
      });
    }
  };

/**
 * Submits final onboarding data
 * Marks student status as "onboarded" in database
 */
export const submitOnboarding =
  (studentId: string, formData: StudentData): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.SUBMIT_ONBOARDING_REQUEST });
    try {
      // Convert form data (German) to database model (English)
      const modelData = mapFormDataToModel(formData);

      const { data } = await studentService.submitOnboarding(
        studentId,
        modelData,
      );

      dispatch({
        type: TYPES.SUBMIT_ONBOARDING_SUCCESS,
        payload: data,
      });

      successNotification(i18n.t("actions.onboardingSubmitSuccess"));

      // Clear onboarding data after successful submission
      dispatch(clearStudentOnboardingData());
    } catch (error) {
      errorNotification(i18n.t("actions.onboardingSubmitFailed"));
      dispatch({
        type: TYPES.SUBMIT_ONBOARDING_FAILURE,
        payload: error,
      });
    }
  };

/**
 * Updates a student's class assignment
 * @param studentId - Student ID to update
 * @param classId - New class ID (or null to unassign)
 */
export const updateStudentClass =
  (studentId: string, classId: string | null): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.UPDATE_STUDENT_CLASS_REQUEST });
    try {
      await studentService.updateClass(studentId, classId);

      dispatch({ type: TYPES.UPDATE_STUDENT_CLASS_SUCCESS });
      successNotification(i18n.t("actions.studentClassUpdateSuccess"));

      // Refresh students list to get updated data with populated class
      dispatch(getStudents());
    } catch (error) {
      errorNotification(i18n.t("actions.studentClassUpdateFailed"));
      dispatch({
        type: TYPES.UPDATE_STUDENT_CLASS_FAILURE,
        payload: error,
      });
      throw error; // Re-throw for component to handle rollback
    }
  };
