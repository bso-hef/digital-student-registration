import studentService from "@/lib/services/studentService";
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
 * Loads student data for onboarding
 * Fetches student from database and pre-fills form data
 * Checks if student is already onboarded and blocks if so
 */
export const loadStudentForOnboarding =
  (studentId: string): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.LOAD_STUDENT_FOR_ONBOARDING_REQUEST });
    try {
      const { data } = await studentService.getById(studentId);

      if (!data) {
        throw new Error("Student not found");
      }

      // Check if student has already completed onboarding
      if (data.status === "onboarded") {
        throw new Error("Student has already completed onboarding");
      }

      // Convert database model (English) to form data (German)
      const formData = mapModelToFormData(data);

      // Extract currentClass from populated field (if available)
      const currentClass =
        typeof data.currentClass === "object" ? data.currentClass : null;

      dispatch({
        type: TYPES.LOAD_STUDENT_FOR_ONBOARDING_SUCCESS,
        payload: {
          student: data,
          formData,
          currentClass,
          status: data.status,
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
  (studentId: string, formData: Partial<StudentData>): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.SAVE_ONBOARDING_PROGRESS_REQUEST });
    try {
      // Convert form data (German) to database model (English)
      const modelData = mapFormDataToModel(formData);

      const { data } = await studentService.updateOnboarding(
        studentId,
        modelData,
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
