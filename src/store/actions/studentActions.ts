import studentService, {
  StudentListFilters,
} from "@/lib/services/studentService";
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

export const setEditingFromSummary =
  (isEditing: boolean): AppThunk =>
  (dispatch) => {
    dispatch({
      type: TYPES.SET_EDITING_FROM_SUMMARY,
      payload: isEditing,
    });
  };

export const getStudents =
  (page?: number, limit?: number, filters?: StudentListFilters): AppThunk =>
  async (dispatch, getState) => {
    const studentState = getState().student;
    const currentPagination = studentState.pagination;
    const requestedPage = page ?? currentPagination.page;
    const requestedLimit = limit ?? currentPagination.limit;
    const requestedFilters = filters ?? studentState.filters;

    dispatch({ type: TYPES.GET_STUDENTS_REQUEST });
    try {
      const { data } = await studentService.getAll({
        page: requestedPage,
        limit: requestedLimit,
        ...requestedFilters,
      });

      dispatch({
        type: TYPES.GET_STUDENTS_SUCCESS,
        payload: {
          students: data.students,
          pagination: {
            page: data.page,
            limit: data.limit,
            total: data.total,
            pages: data.pages,
          },
          filters: requestedFilters,
        },
      });
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
      dispatch(getStudents());
    } catch (error) {
      errorNotification(i18n.t("actions.studentDeleteFailed"));
      dispatch({ type: TYPES.DELETE_STUDENTS_FAILURE, payload: error });
    }
  };

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

      return data.studentId;
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      const errorMessage =
        err?.response?.data?.error || i18n.t("actions.verificationFailed");

      errorNotification(errorMessage);
      dispatch({
        type: TYPES.VERIFY_STUDENT_FAILURE,
        payload: error,
      });

      throw error;
    }
  };

export const updateStudentOnboardingData =
  (data: Partial<StudentData>): AppThunk =>
  (dispatch) => {
    dispatch({
      type: TYPES.UPDATE_STUDENT_ONBOARDING_DATA,
      payload: data,
    });
  };

export const setStudentOnboardingClass =
  (currentClass: StudentData["currentClassData"]): AppThunk =>
  (dispatch) => {
    dispatch({
      type: TYPES.SET_STUDENT_ONBOARDING_CLASS,
      payload: currentClass,
    });
  };

export const clearStudentOnboardingData = (): AppThunk => (dispatch) => {
  dispatch({ type: TYPES.CLEAR_STUDENT_ONBOARDING_DATA });
};

export const clearStudentError = (): AppThunk => (dispatch) => {
  dispatch({ type: TYPES.CLEAR_STUDENT_ERROR });
};

function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export const loadStudentForOnboarding =
  (studentId: string): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.LOAD_STUDENT_FOR_ONBOARDING_REQUEST });
    try {
      if (!isValidObjectId(studentId)) {
        throw new ValidationError(
          "Invalid student ID format",
          OnboardingErrorCode.INVALID_STUDENT_ID,
        );
      }

      const response = await studentService.getById(studentId);
      const data = response.data.data;

      if (!data) {
        throw new ValidationError(
          "Student not found",
          OnboardingErrorCode.STUDENT_NOT_FOUND,
        );
      }

      if (data.status === "onboarded") {
        throw new ValidationError(
          "Student has already completed onboarding",
          OnboardingErrorCode.ALREADY_ONBOARDED,
        );
      }

      const currentClass =
        typeof data.currentClass === "object" && data.currentClass !== null
          ? data.currentClass
          : null;

      const formData = mapModelToFormData(data);

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
          studentId,
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
      const modelData = mapFormDataToModel(formData);

      const state = getState();
      const prevStep =
        previousStep !== undefined
          ? previousStep
          : (state.student.previousStep ?? null);

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
    } catch (error) {
      console.error("Auto-save failed:", error);
      dispatch({
        type: TYPES.SAVE_ONBOARDING_PROGRESS_FAILURE,
        payload: error,
      });
    }
  };

export const submitOnboarding =
  (studentId: string, formData: StudentData): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.SUBMIT_ONBOARDING_REQUEST });
    try {
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

      dispatch(clearStudentOnboardingData());
    } catch (error) {
      errorNotification(i18n.t("actions.onboardingSubmitFailed"));
      dispatch({
        type: TYPES.SUBMIT_ONBOARDING_FAILURE,
        payload: error,
      });
    }
  };

export const updateStudentClass =
  (studentId: string, classId: string | null): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.UPDATE_STUDENT_CLASS_REQUEST });
    try {
      await studentService.updateClass(studentId, classId);

      dispatch({ type: TYPES.UPDATE_STUDENT_CLASS_SUCCESS });
      successNotification(i18n.t("actions.studentClassUpdateSuccess"));

      dispatch(getStudents());
    } catch (error) {
      errorNotification(i18n.t("actions.studentClassUpdateFailed"));
      dispatch({
        type: TYPES.UPDATE_STUDENT_CLASS_FAILURE,
        payload: error,
      });
      throw error;
    }
  };

// Admin student detail actions
export const getStudent =
  (studentId: string): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.GET_STUDENT_REQUEST });
    try {
      const response = await studentService.getById(studentId);
      const data = response.data.data;

      dispatch({
        type: TYPES.GET_STUDENT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      errorNotification(i18n.t("actions.studentFetchFailed"));
      dispatch({
        type: TYPES.GET_STUDENT_FAILURE,
        payload: error,
      });
    }
  };

export const updateStudent =
  (studentId: string, patch: Record<string, unknown>): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.UPDATE_STUDENT_REQUEST });
    try {
      const response = await studentService.patch(studentId, patch);
      const data = response.data.data;

      dispatch({
        type: TYPES.UPDATE_STUDENT_SUCCESS,
        payload: data,
      });

      successNotification(i18n.t("actions.studentUpdateSuccess"));

      // Refresh the students list
      dispatch(getStudents());
    } catch (error) {
      errorNotification(i18n.t("actions.studentUpdateFailed"));
      dispatch({
        type: TYPES.UPDATE_STUDENT_FAILURE,
        payload: error,
      });
    }
  };

export const clearCurrentStudent = (): AppThunk => (dispatch) => {
  dispatch({ type: TYPES.CLEAR_CURRENT_STUDENT });
};
