import { ClassInterface } from "@/types/class";
import { Student } from "@/types/db";

import * as TYPES from "../types";
import { AppAction } from "./index";

interface CurrentClassState {
  data: ClassInterface | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface ClassState {
  classes: ClassInterface[];
  currentClass: CurrentClassState;
  currentClassStudents: {
    students: Student[];
    loading: boolean;
    error: string | null;
  };
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
    error: null,
    success: false,
  },
  currentClassStudents: {
    students: [] as Student[],
    loading: false,
    error: null,
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

    case TYPES.GET_CLASS_REQUEST:
      return {
        ...state,
        currentClass: {
          ...state.currentClass,
          loading: true,
        },
      };

    case TYPES.GET_CLASS_SUCCESS:
      return {
        ...state,
        currentClass: {
          ...state.currentClass,
          loading: false,
          data: action.payload,
          success: true,
        },
      };

    case TYPES.GET_CLASS_FAILURE:
      return {
        ...state,
        currentClass: {
          ...state.currentClass,
          loading: false,
          error: action.payload,
        },
      };

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

    case TYPES.ADD_CLASS_SUCCESS: {
      const newClasses = action.payload;
      const updatedById = { ...state.byId };
      newClasses.forEach((c: ClassInterface) => {
        updatedById[c._id] = c;
      });
      return {
        ...state,
        loading: false,
        classes: [...state.classes, ...newClasses],
        byId: updatedById,
      };
    }

    case TYPES.DELETE_CLASSES_SUCCESS:
      return {
        ...state,
        loading: false,
        classes: state.classes.filter(
          (classItem) => !action.payload.includes(classItem._id),
        ),
      };

    case TYPES.UPDATE_CLASS_SUCCESS: {
      const updated = action.payload;
      const isCurrentClass = state.currentClass.data?._id === updated._id;
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
        currentClass: isCurrentClass
          ? {
              ...state.currentClass,
              data: { ...state.currentClass.data, ...updated } as ClassInterface,
            }
          : state.currentClass,
      };
    }

    case TYPES.GET_CLASSES_FAILURE:
    case TYPES.ADD_CLASS_FAILURE:
    case TYPES.DELETE_CLASSES_FAILURE:
    case TYPES.UPDATE_CLASS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case TYPES.SET_CURRENT_CLASS:
      return {
        ...state,
        currentClass: {
          ...state.currentClass,
          data: action.payload,
        },
      };

    case TYPES.CLEAR_CURRENT_CLASS:
      return {
        ...state,
        currentClass: initialState.currentClass,
        currentClassStudents: initialState.currentClassStudents,
      };

    case TYPES.GET_CLASS_STUDENTS_REQUEST:
      return {
        ...state,
        currentClassStudents: {
          ...state.currentClassStudents,
          loading: true,
          error: null,
        },
      };

    case TYPES.GET_CLASS_STUDENTS_SUCCESS:
      return {
        ...state,
        currentClassStudents: {
          students: action.payload,
          loading: false,
          error: null,
        },
      };

    case TYPES.GET_CLASS_STUDENTS_FAILURE:
      return {
        ...state,
        currentClassStudents: {
          ...state.currentClassStudents,
          loading: false,
          error: action.payload,
        },
      };

    case TYPES.ADD_STUDENTS_TO_CLASS_REQUEST:
    case TYPES.REMOVE_STUDENTS_FROM_CLASS_REQUEST:
      return {
        ...state,
        currentClassStudents: {
          ...state.currentClassStudents,
          loading: true,
        },
      };

    case TYPES.ADD_STUDENTS_TO_CLASS_SUCCESS:
    case TYPES.REMOVE_STUDENTS_FROM_CLASS_SUCCESS:
      return {
        ...state,
        currentClassStudents: {
          ...state.currentClassStudents,
          loading: false,
        },
      };

    case TYPES.ADD_STUDENTS_TO_CLASS_FAILURE:
    case TYPES.REMOVE_STUDENTS_FROM_CLASS_FAILURE:
      return {
        ...state,
        currentClassStudents: {
          ...state.currentClassStudents,
          loading: false,
          error: action.payload,
        },
      };

    default:
      return state;
  }
};

export default classReducer;
