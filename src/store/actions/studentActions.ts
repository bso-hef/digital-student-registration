import studentService from "@/lib/services/studentService";
import { CreateStudentInput } from "@/types/student";
import {
  errorNotification,
  successNotification,
} from "@/utils/notification.utils";
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
