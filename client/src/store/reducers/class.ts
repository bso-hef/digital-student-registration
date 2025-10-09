import { ClassInterface } from "@/types/class";

import * as TYPES from "../types";
import { AppAction } from "./index";

interface ClassState {
  classes: ClassInterface[];
  currentClass: object;
  byId: { [key: string]: ClassInterface };
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const initialState: ClassState = {
  classes: [],
  currentClass: {
    data: null,
    loading: false,
    requestSent: false,
    error: null,
    success: false,
  },
  byId: {},
  loading: false,
  error: null,
  page: 1,
  limit: 25,
  total: 0,
  pages: 0,
};

const classReducer = (state = initialState, action: AppAction): ClassState => {
  switch (action.type) {
    case TYPES.GET_CLASSES_REQUEST:
    case TYPES.ADD_CLASS_REQUEST:
    case TYPES.DELETE_CLASSES_REQUEST:
    case TYPES.UPDATE_CLASS_REQUEST:
      return { ...state, loading: true, error: null };

    case TYPES.GET_CLASSES_SUCCESS: {
      const { classes, page, limit, total, pages } = action.payload; // <— wichtig!
      const byId = { ...state.byId };
      (classes ?? []).forEach((c: ClassInterface) => {
        byId[c._id] = c;
      });
      return {
        ...state,
        loading: false,
        classes: classes ?? [],
        byId,
        page: page ?? state.page,
        limit: limit ?? state.limit,
        total: total ?? state.total,
        pages: pages ?? state.pages,
      };
    }

    case TYPES.ADD_CLASS_SUCCESS:
      return {
        ...state,
        loading: false,
        classes: [...state.classes, action.payload],
      };

    case TYPES.DELETE_CLASSES_SUCCESS:
      return {
        ...state,
        loading: false,
        classes: state.classes.filter(
          (classItem) => !action.payload.includes(classItem._id),
        ),
      };

    case TYPES.UPDATE_CLASS_SUCCESS:
      const updated = action.payload;
      return {
        ...state,
        loading: false,
        classes: state.classes.map((c) =>
          c._id === updated._id ? { ...c, ...updated } : c,
        ),
        byId: {
          ...state.byId,
          [updated._id]: { ...(state.byId[updated._id] || {}), ...updated },
        },
      };

    case TYPES.GET_CLASSES_FAILURE:
    case TYPES.ADD_CLASS_FAILURE:
    case TYPES.DELETE_CLASSES_FAILURE:
    case TYPES.UPDATE_CLASS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default classReducer;
