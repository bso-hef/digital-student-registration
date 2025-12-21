import { describe, expect, it } from "vitest";

import classReducer from "@/store/reducers/class";
import * as TYPES from "@/store/types";
import { ClassInterface } from "@/types/class";
import { Student } from "@/types/db";

/**
 * Tests for class reducer
 * @file tests/unit/store/reducers/class.test.ts
 */

describe("classReducer", () => {
  const initialState = {
    classes: [],
    currentClass: {
      data: null,
      loading: false,
      error: null,
      success: false,
    },
    currentClassStudents: {
      students: [],
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

  const mockClass: ClassInterface = {
    _id: "class1",
    name: "Class A",
    schoolYearFrom: 2024,
    schoolYearTo: 2025,
    grade: 10,
    isActive: true,
    isVocational: false,
    students: [],
    studentCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStudent: Student = {
    _id: "student1",
    onboardingCompleted: true,
    dateOfBirth: new Date("2008-01-01"),
  } as Student;

  it("should return initial state when no action matches", () => {
    const state = classReducer(undefined, { type: "UNKNOWN_ACTION" });
    expect(state).toEqual(initialState);
  });

  describe("GET_CLASSES actions", () => {
    it("should handle GET_CLASSES_REQUEST", () => {
      const action = { type: TYPES.GET_CLASSES_REQUEST };
      const state = classReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle GET_CLASSES_SUCCESS", () => {
      const classes = [mockClass];
      const action = {
        type: TYPES.GET_CLASSES_SUCCESS,
        payload: { classes, total: 1, page: 1, pages: 1 },
      };
      const state = classReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.classes).toEqual(classes);
      expect(state.total).toBe(1);
      expect(state.page).toBe(1);
      expect(state.pages).toBe(1);
      expect(state.byId["class1"]).toEqual(mockClass);
    });

    it("should handle GET_CLASSES_FAILURE", () => {
      const action = {
        type: TYPES.GET_CLASSES_FAILURE,
        payload: "Error loading classes",
      };
      const state = classReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe("Error loading classes");
    });
  });

  describe("GET_CLASS actions", () => {
    it("should handle GET_CLASS_REQUEST", () => {
      const action = { type: TYPES.GET_CLASS_REQUEST };
      const state = classReducer(initialState, action);
      expect(state.currentClass.loading).toBe(true);
    });

    it("should handle GET_CLASS_SUCCESS", () => {
      const action = {
        type: TYPES.GET_CLASS_SUCCESS,
        payload: mockClass,
      };
      const state = classReducer(initialState, action);
      expect(state.currentClass.loading).toBe(false);
      expect(state.currentClass.data).toEqual(mockClass);
      expect(state.currentClass.success).toBe(true);
    });

    it("should handle GET_CLASS_FAILURE", () => {
      const action = {
        type: TYPES.GET_CLASS_FAILURE,
        payload: "Class not found",
      };
      const state = classReducer(initialState, action);
      expect(state.currentClass.loading).toBe(false);
      expect(state.currentClass.error).toBe("Class not found");
    });
  });

  describe("ADD_CLASS actions", () => {
    it("should handle ADD_CLASS_REQUEST", () => {
      const action = { type: TYPES.ADD_CLASS_REQUEST };
      const state = classReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle ADD_CLASS_SUCCESS", () => {
      const newClass: ClassInterface = { ...mockClass, _id: "class2" };
      const action = {
        type: TYPES.ADD_CLASS_SUCCESS,
        payload: [newClass],
      };
      const state = classReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.classes).toContain(newClass);
      expect(state.byId["class2"]).toEqual(newClass);
    });

    it("should handle ADD_CLASS_FAILURE", () => {
      const action = {
        type: TYPES.ADD_CLASS_FAILURE,
        payload: "Failed to add class",
      };
      const state = classReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe("Failed to add class");
    });
  });

  describe("UPDATE_CLASS actions", () => {
    it("should handle UPDATE_CLASS_REQUEST", () => {
      const action = { type: TYPES.UPDATE_CLASS_REQUEST };
      const state = classReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle UPDATE_CLASS_SUCCESS", () => {
      const existingState = {
        ...initialState,
        classes: [mockClass],
        byId: { class1: mockClass },
      };
      const updatedClass = { ...mockClass, name: "Updated Class" };
      const action = {
        type: TYPES.UPDATE_CLASS_SUCCESS,
        payload: updatedClass,
      };
      const state = classReducer(existingState, action);
      expect(state.loading).toBe(false);
      expect(state.classes[0].name).toBe("Updated Class");
      expect(state.byId["class1"].name).toBe("Updated Class");
    });

    it("should handle UPDATE_CLASS_FAILURE", () => {
      const action = {
        type: TYPES.UPDATE_CLASS_FAILURE,
        payload: "Failed to update class",
      };
      const state = classReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe("Failed to update class");
    });
  });

  describe("DELETE_CLASSES actions", () => {
    it("should handle DELETE_CLASSES_REQUEST", () => {
      const action = { type: TYPES.DELETE_CLASSES_REQUEST };
      const state = classReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle DELETE_CLASSES_SUCCESS", () => {
      const class2: ClassInterface = { ...mockClass, _id: "class2" };
      const existingState = {
        ...initialState,
        classes: [mockClass, class2],
        byId: { class1: mockClass, class2: class2 },
      };
      const action = {
        type: TYPES.DELETE_CLASSES_SUCCESS,
        payload: ["class1"],
      };
      const state = classReducer(existingState, action);
      expect(state.loading).toBe(false);
      expect(state.classes.length).toBe(1);
      expect(state.classes[0]._id).toBe("class2");
      expect(state.byId["class1"]).toBeUndefined();
    });

    it("should handle DELETE_CLASSES_FAILURE", () => {
      const action = {
        type: TYPES.DELETE_CLASSES_FAILURE,
        payload: "Failed to delete classes",
      };
      const state = classReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe("Failed to delete classes");
    });
  });

  describe("GET_CLASS actions", () => {
    it("should handle GET_CLASS_REQUEST", () => {
      const action = { type: TYPES.GET_CLASS_REQUEST };
      const state = classReducer(initialState, action);
      expect(state.currentClass.loading).toBe(true);
    });

    it("should handle GET_CLASS_SUCCESS", () => {
      const action = {
        type: TYPES.GET_CLASS_SUCCESS,
        payload: mockClass,
      };
      const state = classReducer(initialState, action);
      expect(state.currentClass.loading).toBe(false);
      expect(state.currentClass.data).toEqual(mockClass);
      expect(state.currentClass.success).toBe(true);
    });

    it("should handle GET_CLASS_FAILURE", () => {
      const error = "Failed to load class";
      const action = {
        type: TYPES.GET_CLASS_FAILURE,
        payload: error,
      };
      const state = classReducer(initialState, action);
      expect(state.currentClass.loading).toBe(false);
      expect(state.currentClass.error).toBe(error);
    });
  });

  describe("SET_CURRENT_CLASS and CLEAR_CURRENT_CLASS actions", () => {
    it("should handle SET_CURRENT_CLASS", () => {
      const action = {
        type: TYPES.SET_CURRENT_CLASS,
        payload: mockClass,
      };
      const state = classReducer(initialState, action);
      expect(state.currentClass.data).toEqual(mockClass);
    });

    it("should handle CLEAR_CURRENT_CLASS", () => {
      const existingState = {
        ...initialState,
        currentClass: {
          data: mockClass,
          loading: false,
          error: null,
          success: true,
        },
      };
      const action = { type: TYPES.CLEAR_CURRENT_CLASS };
      const state = classReducer(existingState, action);
      expect(state.currentClass.data).toBe(null);
      expect(state.currentClass.success).toBe(false);
    });
  });

  describe("GET_CLASS_STUDENTS actions", () => {
    it("should handle GET_CLASS_STUDENTS_REQUEST", () => {
      const action = { type: TYPES.GET_CLASS_STUDENTS_REQUEST };
      const state = classReducer(initialState, action);
      expect(state.currentClassStudents.loading).toBe(true);
      expect(state.currentClassStudents.error).toBe(null);
    });

    it("should handle GET_CLASS_STUDENTS_SUCCESS", () => {
      const students = [mockStudent];
      const action = {
        type: TYPES.GET_CLASS_STUDENTS_SUCCESS,
        payload: students,
      };
      const state = classReducer(initialState, action);
      expect(state.currentClassStudents.loading).toBe(false);
      expect(state.currentClassStudents.students).toEqual(students);
    });

    it("should handle GET_CLASS_STUDENTS_FAILURE", () => {
      const action = {
        type: TYPES.GET_CLASS_STUDENTS_FAILURE,
        payload: "Failed to load students",
      };
      const state = classReducer(initialState, action);
      expect(state.currentClassStudents.loading).toBe(false);
      expect(state.currentClassStudents.error).toBe("Failed to load students");
    });
  });

  describe("CLEAR_CURRENT_CLASS", () => {
    it("should clear current class data", () => {
      const existingState = {
        ...initialState,
        currentClass: {
          data: mockClass,
          loading: false,
          error: null,
          success: true,
        },
      };
      const action = { type: TYPES.CLEAR_CURRENT_CLASS };
      const state = classReducer(existingState, action);
      expect(state.currentClass).toEqual(initialState.currentClass);
    });
  });

  describe("ADD_STUDENTS_TO_CLASS actions", () => {
    it("should handle ADD_STUDENTS_TO_CLASS_REQUEST", () => {
      const action = { type: TYPES.ADD_STUDENTS_TO_CLASS_REQUEST };
      const state = classReducer(initialState, action);
      expect(state.currentClassStudents.loading).toBe(true);
    });

    it("should handle ADD_STUDENTS_TO_CLASS_SUCCESS", () => {
      const existingState = {
        ...initialState,
        currentClassStudents: {
          ...initialState.currentClassStudents,
          loading: true,
        },
      };
      const action = { type: TYPES.ADD_STUDENTS_TO_CLASS_SUCCESS };
      const state = classReducer(existingState, action);
      expect(state.currentClassStudents.loading).toBe(false);
    });

    it("should handle ADD_STUDENTS_TO_CLASS_FAILURE", () => {
      const error = "Failed to add students to class";
      const action = {
        type: TYPES.ADD_STUDENTS_TO_CLASS_FAILURE,
        payload: error,
      };
      const state = classReducer(initialState, action);
      expect(state.currentClassStudents.loading).toBe(false);
      expect(state.currentClassStudents.error).toBe(error);
    });
  });

  describe("REMOVE_STUDENTS_FROM_CLASS actions", () => {
    it("should handle REMOVE_STUDENTS_FROM_CLASS_REQUEST", () => {
      const action = { type: TYPES.REMOVE_STUDENTS_FROM_CLASS_REQUEST };
      const state = classReducer(initialState, action);
      expect(state.currentClassStudents.loading).toBe(true);
    });

    it("should handle REMOVE_STUDENTS_FROM_CLASS_SUCCESS", () => {
      const existingState = {
        ...initialState,
        currentClassStudents: {
          ...initialState.currentClassStudents,
          loading: true,
        },
      };
      const action = { type: TYPES.REMOVE_STUDENTS_FROM_CLASS_SUCCESS };
      const state = classReducer(existingState, action);
      expect(state.currentClassStudents.loading).toBe(false);
    });

    it("should handle REMOVE_STUDENTS_FROM_CLASS_FAILURE", () => {
      const error = "Failed to remove students from class";
      const action = {
        type: TYPES.REMOVE_STUDENTS_FROM_CLASS_FAILURE,
        payload: error,
      };
      const state = classReducer(initialState, action);
      expect(state.currentClassStudents.loading).toBe(false);
      expect(state.currentClassStudents.error).toBe(error);
    });
  });

  describe("UPDATE_CLASS_SUCCESS with current class", () => {
    it("should update currentClass when updated class matches current class", () => {
      const existingState = {
        ...initialState,
        classes: [mockClass],
        byId: { class1: mockClass },
        currentClass: {
          data: mockClass,
          loading: false,
          error: null,
          success: true,
        },
      };
      const updatedClass = { ...mockClass, name: "Updated Current Class" };
      const action = {
        type: TYPES.UPDATE_CLASS_SUCCESS,
        payload: updatedClass,
      };
      const state = classReducer(existingState, action);
      expect(state.currentClass.data?.name).toBe("Updated Current Class");
    });

    it("should not update currentClass when updated class does not match", () => {
      const otherClass = { ...mockClass, _id: "class2" };
      const existingState = {
        ...initialState,
        classes: [mockClass, otherClass],
        byId: { class1: mockClass, class2: otherClass },
        currentClass: {
          data: mockClass,
          loading: false,
          error: null,
          success: true,
        },
      };
      const updatedClass = { ...otherClass, name: "Updated Other Class" };
      const action = {
        type: TYPES.UPDATE_CLASS_SUCCESS,
        payload: updatedClass,
      };
      const state = classReducer(existingState, action);
      expect(state.currentClass.data?.name).toBe("Class A"); // unchanged
      expect(state.byId["class2"].name).toBe("Updated Other Class");
    });

    it("should handle UPDATE_CLASS_SUCCESS when currentClass.data is null", () => {
      const existingState = {
        ...initialState,
        classes: [mockClass],
        byId: { class1: mockClass },
      };
      const updatedClass = { ...mockClass, name: "Updated Class" };
      const action = {
        type: TYPES.UPDATE_CLASS_SUCCESS,
        payload: updatedClass,
      };
      const state = classReducer(existingState, action);
      expect(state.currentClass.data).toBe(null);
      expect(state.classes[0].name).toBe("Updated Class");
    });
  });

  describe("GET_CLASSES_SUCCESS edge cases", () => {
    it("should handle GET_CLASSES_SUCCESS with null classes", () => {
      const action = {
        type: TYPES.GET_CLASSES_SUCCESS,
        payload: { classes: null, total: 0, page: 1, pages: 0 },
      };
      const state = classReducer(initialState, action);
      expect(state.classes).toEqual([]);
    });

    it("should handle GET_CLASSES_SUCCESS with undefined pagination values", () => {
      const existingState = {
        ...initialState,
        page: 5,
        limit: 50,
        total: 100,
        pages: 2,
      };
      const action = {
        type: TYPES.GET_CLASSES_SUCCESS,
        payload: { classes: [mockClass] },
      };
      const state = classReducer(existingState, action);
      expect(state.page).toBe(5); // preserved
      expect(state.limit).toBe(50); // preserved
      expect(state.total).toBe(100); // preserved
      expect(state.pages).toBe(2); // preserved
    });

    it("should merge existing byId with new classes", () => {
      const existingClass = { ...mockClass, _id: "existing1" };
      const existingState = {
        ...initialState,
        byId: { existing1: existingClass },
      };
      const newClass = { ...mockClass, _id: "new1" };
      const action = {
        type: TYPES.GET_CLASSES_SUCCESS,
        payload: { classes: [newClass], page: 1, total: 1, pages: 1 },
      };
      const state = classReducer(existingState, action);
      expect(state.byId["existing1"]).toEqual(existingClass);
      expect(state.byId["new1"]).toEqual(newClass);
    });
  });

  describe("edge cases", () => {
    it("should handle multiple classes in GET_CLASSES_SUCCESS", () => {
      const class2 = { ...mockClass, _id: "class2", name: "Class B" };
      const class3 = { ...mockClass, _id: "class3", name: "Class C" };
      const action = {
        type: TYPES.GET_CLASSES_SUCCESS,
        payload: {
          classes: [mockClass, class2, class3],
          total: 3,
          page: 1,
          pages: 1,
        },
      };
      const state = classReducer(initialState, action);
      expect(state.classes.length).toBe(3);
      expect(Object.keys(state.byId).length).toBe(3);
    });

    it("should handle DELETE_CLASSES_SUCCESS with multiple deletions", () => {
      const class2 = { ...mockClass, _id: "class2" };
      const class3 = { ...mockClass, _id: "class3" };
      const existingState = {
        ...initialState,
        classes: [mockClass, class2, class3],
        byId: { class1: mockClass, class2: class2, class3: class3 },
      };
      const action = {
        type: TYPES.DELETE_CLASSES_SUCCESS,
        payload: ["class1", "class3"],
      };
      const state = classReducer(existingState, action);
      expect(state.classes.length).toBe(1);
      expect(state.classes[0]._id).toBe("class2");
    });

    it("should maintain other state when updating a class", () => {
      const existingState = {
        ...initialState,
        classes: [mockClass],
        byId: { class1: mockClass },
        page: 2,
        total: 50,
      };
      const updatedClass = { ...mockClass, name: "New Name" };
      const action = {
        type: TYPES.UPDATE_CLASS_SUCCESS,
        payload: updatedClass,
      };
      const state = classReducer(existingState, action);
      expect(state.page).toBe(2);
      expect(state.total).toBe(50);
    });
  });
});
