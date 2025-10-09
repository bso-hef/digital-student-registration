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
