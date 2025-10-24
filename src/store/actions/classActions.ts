import classService, { ClassPatch } from "@/lib/services/classService";
import { ClassCreateInput } from "@/types/class";
import { toAppError } from "@/utils/general.utils";
import {
  errorNotification,
  successNotification,
} from "@/utils/notification.utils";
import i18n from "i18next";

import { AppThunk } from "../store";
import * as TYPES from "../types";

// Hilfsfunktion: undefined entfernen (null bleibt erhalten!)
const stripUndefined = <T extends object>(obj: T): T =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as T;

export const getClasses = (): AppThunk => async (dispatch) => {
  dispatch({ type: TYPES.GET_CLASSES_REQUEST });
  try {
    const { data } = await classService.getAll();

    dispatch({ type: TYPES.GET_CLASSES_SUCCESS, payload: data });
  } catch (error) {
    errorNotification(i18n.t("actions.classFetchFailed"));
    const appError = await toAppError(error);
    dispatch({ type: TYPES.GET_CLASSES_FAILURE, payload: appError });
  }
};

export const addClass =
  (classes: ClassCreateInput[]): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.ADD_CLASS_REQUEST });
    try {
      const { data } = await classService.create(classes);

      dispatch({ type: TYPES.ADD_CLASS_SUCCESS, payload: data });
      successNotification(i18n.t("actions.classAddSuccess"));
    } catch (error) {
      errorNotification(i18n.t("actions.classAddFailed"));
      const appError = await toAppError(error);
      dispatch({ type: TYPES.ADD_CLASS_FAILURE, payload: appError });
    }
  };

export const deleteClasses =
  (ids: string[]): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.DELETE_CLASSES_REQUEST });
    try {
      await classService.delete(ids);
      dispatch({ type: TYPES.DELETE_CLASSES_SUCCESS, payload: ids });
    } catch (error) {
      const appError = await toAppError(error);
      dispatch({ type: TYPES.DELETE_CLASSES_FAILURE, payload: appError });
    }
  };

export const updateClass =
  (id: string, patch: Partial<ClassCreateInput>): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.UPDATE_CLASS_REQUEST });
    try {
      const body: ClassPatch = stripUndefined(patch);
      const { data } = await classService.patch(id, body);

      dispatch({ type: TYPES.UPDATE_CLASS_SUCCESS, payload: data });
    } catch (error) {
      const appError = await toAppError(error);
      dispatch({ type: TYPES.UPDATE_CLASS_FAILURE, payload: appError });
    }
  };

export const setCurrentClass =
  (id: string): AppThunk =>
  (dispatch, getState) => {
    const { classes } = getState().class;
    const currentClass = classes.find((c) => c._id === id);

    dispatch({ type: TYPES.SET_CURRENT_CLASS, payload: currentClass });
  };

export const clearCurrentClass = (): AppThunk => (dispatch) => {
  dispatch({ type: TYPES.CLEAR_CURRENT_CLASS });
};

export const getClass =
  (id: string): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.GET_CLASS_REQUEST });
    try {
      const { data } = await classService.get(id);
      dispatch({ type: TYPES.GET_CLASS_SUCCESS, payload: data });
    } catch (error) {
      const appError = await toAppError(error);
      dispatch({ type: TYPES.GET_CLASS_FAILURE, payload: appError });
    }
  };

export const getClassStudents =
  (classId: string): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.GET_CLASS_STUDENTS_REQUEST });
    try {
      const { data } = await classService.getStudentsInClass(classId);
      dispatch({
        type: TYPES.GET_CLASS_STUDENTS_SUCCESS,
        payload: data.students,
      });
    } catch (error) {
      errorNotification(i18n.t("actions.studentFetchFailed"));
      const appError = await toAppError(error);
      dispatch({ type: TYPES.GET_CLASS_STUDENTS_FAILURE, payload: appError });
    }
  };

export const addStudentsToClass =
  (classId: string, studentIds: string[]): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.ADD_STUDENTS_TO_CLASS_REQUEST });
    try {
      await classService.addStudentsToClass(classId, studentIds);
      dispatch({ type: TYPES.ADD_STUDENTS_TO_CLASS_SUCCESS });
      successNotification(i18n.t("actions.studentsAddedToClass"));
      // Refresh the students list after adding
      dispatch(getClassStudents(classId));
    } catch (error) {
      errorNotification(i18n.t("actions.studentsAddToClassFailed"));
      const appError = await toAppError(error);
      dispatch({
        type: TYPES.ADD_STUDENTS_TO_CLASS_FAILURE,
        payload: appError,
      });
    }
  };

export const removeStudentsFromClass =
  (classId: string, studentIds: string[]): AppThunk =>
  async (dispatch) => {
    dispatch({ type: TYPES.REMOVE_STUDENTS_FROM_CLASS_REQUEST });
    try {
      await classService.removeStudentsFromClass(classId, studentIds);
      dispatch({ type: TYPES.REMOVE_STUDENTS_FROM_CLASS_SUCCESS });
      successNotification(i18n.t("actions.studentsRemovedFromClass"));
      // Refresh the students list after removing
      dispatch(getClassStudents(classId));
    } catch (error) {
      errorNotification(i18n.t("actions.studentsRemoveFromClassFailed"));
      const appError = await toAppError(error);
      dispatch({
        type: TYPES.REMOVE_STUDENTS_FROM_CLASS_FAILURE,
        payload: appError,
      });
    }
  };
