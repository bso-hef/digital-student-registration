import * as TYPES from "@/store/types";
import { ClassInterface } from "@/types/class.d";
import { Student } from "@/types/db";
import { StudentData } from "@/types/student";
import { describe, expect, it } from "vitest";

import studentReducer from "@/store/reducers/student";

/**
 * Tests for student reducer
 * @file tests/unit/store/reducers/student.test.ts
 */

describe("studentReducer", () => {
  const initialState = {
    currentStep: 0,
    previousStep: null,
    editingFromSummary: false,
    data: {} as StudentData,
    students: [],
    loading: false,
    error: null,
    currentClass: null,
    studentStatus: null,
    currentStudentId: null,
    currentStudent: null,
    currentStudentLoading: false,
  };

  const mockStudent: Student = {
    _id: "student1",
    onboardingCompleted: true,
    dateOfBirth: new Date("2008-01-01"),
  } as Student;

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

  const mockStudentData: Partial<StudentData> = {
    vorname: "John",
    nachname: "Doe",
    email: "john@example.com",
  };

  it("should return initial state when no action matches", () => {
    const state = studentReducer(undefined, { type: "UNKNOWN_ACTION" });
    expect(state.currentStep).toBe(0);
    expect(state.loading).toBe(false);
  });

  describe("Step navigation", () => {
    it("should handle SET_STUDENT_CURRENT_STEP", () => {
      const action = {
        type: TYPES.SET_STUDENT_CURRENT_STEP,
        payload: 3,
      };
      const state = studentReducer(initialState, action);
      expect(state.currentStep).toBe(3);
      expect(state.previousStep).toBe(0);
    });

    it("should track previous step when changing steps", () => {
      const stateWithStep = { ...initialState, currentStep: 2 };
      const action = {
        type: TYPES.SET_STUDENT_CURRENT_STEP,
        payload: 5,
      };
      const state = studentReducer(stateWithStep, action);
      expect(state.currentStep).toBe(5);
      expect(state.previousStep).toBe(2);
    });
  });

  describe("Student data management", () => {
    it("should handle UPDATE_STUDENT_ONBOARDING_DATA", () => {
      const action = {
        type: TYPES.UPDATE_STUDENT_ONBOARDING_DATA,
        payload: mockStudentData,
      };
      const state = studentReducer(initialState, action);
      expect(state.data).toMatchObject(mockStudentData);
    });

    it("should merge new data with existing data", () => {
      const existingState = {
        ...initialState,
        data: { vorname: "Jane" } as StudentData,
      };
      const action = {
        type: TYPES.UPDATE_STUDENT_ONBOARDING_DATA,
        payload: { nachname: "Smith" },
      };
      const state = studentReducer(existingState, action);
      expect(state.data.vorname).toBe("Jane");
      expect(state.data.nachname).toBe("Smith");
    });

    it("should handle CLEAR_STUDENT_ONBOARDING_DATA", () => {
      const existingState = {
        ...initialState,
        data: mockStudentData as StudentData,
        currentStep: 5,
      };
      const action = { type: TYPES.CLEAR_STUDENT_ONBOARDING_DATA };
      const state = studentReducer(existingState, action);

      // Get the actual initial data from a fresh reducer call
      const freshState = studentReducer(undefined, { type: "INIT" });

      expect(state.data).toEqual(freshState.data);
      expect(state.currentStep).toBe(0);
      expect(state.previousStep).toBe(null);
      expect(state.currentStudentId).toBe(null);
      expect(state.currentStudent).toBe(null);
      expect(state.currentClass).toBe(null);
      expect(state.studentStatus).toBe(null);
    });
  });

  describe("GET_STUDENTS actions", () => {
    it("should handle GET_STUDENTS_REQUEST", () => {
      const action = { type: TYPES.GET_STUDENTS_REQUEST };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(true);
    });

    it("should handle GET_STUDENTS_SUCCESS", () => {
      const students = [mockStudent];
      const action = {
        type: TYPES.GET_STUDENTS_SUCCESS,
        payload: students,
      };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.students).toEqual(students);
    });

    it("should handle GET_STUDENTS_FAILURE", () => {
      const error = new Error("Failed to load students");
      const action = {
        type: TYPES.GET_STUDENTS_FAILURE,
        payload: error,
      };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });
  });

  describe("ADD_STUDENTS actions", () => {
    it("should handle ADD_STUDENTS_REQUEST", () => {
      const action = { type: TYPES.ADD_STUDENTS_REQUEST };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(true);
    });

    it("should handle ADD_STUDENTS_SUCCESS", () => {
      const action = {
        type: TYPES.ADD_STUDENTS_SUCCESS,
        payload: [mockStudent],
      };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.students).toContain(mockStudent);
    });

    it("should handle ADD_STUDENTS_FAILURE", () => {
      const error = new Error("Failed to add student");
      const action = {
        type: TYPES.ADD_STUDENTS_FAILURE,
        payload: error,
      };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });
  });

  describe("DELETE_STUDENTS actions", () => {
    it("should handle DELETE_STUDENTS_REQUEST", () => {
      const action = { type: TYPES.DELETE_STUDENTS_REQUEST };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(true);
    });

    it("should handle DELETE_STUDENTS_SUCCESS", () => {
      const student2 = { ...mockStudent, _id: "student2" };
      const existingState = {
        ...initialState,
        students: [mockStudent, student2],
      };
      const action = {
        type: TYPES.DELETE_STUDENTS_SUCCESS,
        payload: ["student1"],
      };
      const state = studentReducer(existingState, action);
      expect(state.loading).toBe(false);
      expect(state.students.length).toBe(1);
      expect(state.students[0]._id).toBe("student2");
    });

    it("should handle DELETE_STUDENTS_FAILURE", () => {
      const error = new Error("Failed to delete students");
      const action = {
        type: TYPES.DELETE_STUDENTS_FAILURE,
        payload: error,
      };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });
  });

  describe("LOAD_STUDENT_FOR_ONBOARDING actions", () => {
    it("should handle LOAD_STUDENT_FOR_ONBOARDING_REQUEST", () => {
      const action = { type: TYPES.LOAD_STUDENT_FOR_ONBOARDING_REQUEST };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(true);
    });

    it("should handle LOAD_STUDENT_FOR_ONBOARDING_SUCCESS", () => {
      const action = {
        type: TYPES.LOAD_STUDENT_FOR_ONBOARDING_SUCCESS,
        payload: {
          formData: mockStudentData,
          onboardingStep: 2,
          previousStep: 1,
          currentClass: mockClass,
          status: "pending",
          studentId: "student1",
          student: mockStudent,
        },
      };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.data).toMatchObject(mockStudentData);
      expect(state.currentStep).toBe(2);
      expect(state.previousStep).toBe(1);
      expect(state.currentClass).toEqual(mockClass);
      expect(state.studentStatus).toBe("pending");
      expect(state.currentStudentId).toBe("student1");
      expect(state.currentStudent).toEqual(mockStudent);
    });

    it("should handle LOAD_STUDENT_FOR_ONBOARDING_SUCCESS with null/undefined values", () => {
      const action = {
        type: TYPES.LOAD_STUDENT_FOR_ONBOARDING_SUCCESS,
        payload: {
          formData: mockStudentData,
          onboardingStep: null,
          previousStep: null,
          currentClass: null,
          status: null,
          studentId: null,
          student: null,
        },
      };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.data).toMatchObject(mockStudentData);
      expect(state.currentStep).toBe(0);
      expect(state.previousStep).toBe(null);
      expect(state.currentClass).toBe(null);
      expect(state.studentStatus).toBe(null);
      expect(state.currentStudentId).toBe(null);
      expect(state.currentStudent).toBe(null);
    });

    it("should handle LOAD_STUDENT_FOR_ONBOARDING_SUCCESS with missing onboardingStep", () => {
      const action = {
        type: TYPES.LOAD_STUDENT_FOR_ONBOARDING_SUCCESS,
        payload: {
          formData: mockStudentData,
          previousStep: undefined,
          currentClass: undefined,
          status: undefined,
          studentId: undefined,
          student: undefined,
        },
      };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.currentStep).toBe(0);
      expect(state.previousStep).toBe(null);
      expect(state.currentClass).toBe(null);
      expect(state.studentStatus).toBe(null);
      expect(state.currentStudentId).toBe(null);
      expect(state.currentStudent).toBe(null);
    });

    it("should handle LOAD_STUDENT_FOR_ONBOARDING_FAILURE", () => {
      const error = new Error("Failed to load data");
      const action = {
        type: TYPES.LOAD_STUDENT_FOR_ONBOARDING_FAILURE,
        payload: error,
      };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });
  });

  describe("SAVE_ONBOARDING_PROGRESS actions", () => {
    it("should handle SAVE_ONBOARDING_PROGRESS_REQUEST", () => {
      const action = { type: TYPES.SAVE_ONBOARDING_PROGRESS_REQUEST };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle SAVE_ONBOARDING_PROGRESS_SUCCESS", () => {
      const action = { type: TYPES.SAVE_ONBOARDING_PROGRESS_SUCCESS };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(false);
    });

    it("should handle SAVE_ONBOARDING_PROGRESS_FAILURE", () => {
      const error = new Error("Save failed");
      const action = {
        type: TYPES.SAVE_ONBOARDING_PROGRESS_FAILURE,
        payload: error,
      };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });
  });

  describe("SUBMIT_ONBOARDING actions", () => {
    it("should handle SUBMIT_ONBOARDING_REQUEST", () => {
      const action = { type: TYPES.SUBMIT_ONBOARDING_REQUEST };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(true);
    });

    it("should handle SUBMIT_ONBOARDING_SUCCESS", () => {
      const existingState = {
        ...initialState,
        data: mockStudentData as StudentData,
        currentStep: 8,
      };
      const action = { type: TYPES.SUBMIT_ONBOARDING_SUCCESS };
      const state = studentReducer(existingState, action);
      expect(state.loading).toBe(false);
      expect(state.currentStep).toBe(0);
      expect(state.previousStep).toBe(null);
    });

    it("should handle SUBMIT_ONBOARDING_FAILURE", () => {
      const error = new Error("Submission failed");
      const action = {
        type: TYPES.SUBMIT_ONBOARDING_FAILURE,
        payload: error,
      };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });
  });

  describe("CLEAR_STUDENT_ERROR action", () => {
    it("should clear student error", () => {
      const existingState = {
        ...initialState,
        error: new Error("Some error"),
      };
      const action = { type: TYPES.CLEAR_STUDENT_ERROR };
      const state = studentReducer(existingState, action);
      expect(state.error).toBe(null);
    });
  });

  describe("SET_EDITING_FROM_SUMMARY action", () => {
    it("should handle SET_EDITING_FROM_SUMMARY true", () => {
      const action = {
        type: TYPES.SET_EDITING_FROM_SUMMARY,
        payload: true,
      };
      const state = studentReducer(initialState, action);
      expect(state.editingFromSummary).toBe(true);
    });

    it("should handle SET_EDITING_FROM_SUMMARY false", () => {
      const existingState = {
        ...initialState,
        editingFromSummary: true,
      };
      const action = {
        type: TYPES.SET_EDITING_FROM_SUMMARY,
        payload: false,
      };
      const state = studentReducer(existingState, action);
      expect(state.editingFromSummary).toBe(false);
    });
  });

  describe("UPDATE_STUDENT_CLASS actions", () => {
    it("should handle UPDATE_STUDENT_CLASS_REQUEST", () => {
      const action = { type: TYPES.UPDATE_STUDENT_CLASS_REQUEST };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle UPDATE_STUDENT_CLASS_SUCCESS", () => {
      const existingState = { ...initialState, loading: true };
      const action = { type: TYPES.UPDATE_STUDENT_CLASS_SUCCESS };
      const state = studentReducer(existingState, action);
      expect(state.loading).toBe(false);
    });

    it("should handle UPDATE_STUDENT_CLASS_FAILURE", () => {
      const error = new Error("Failed to update student class");
      const action = {
        type: TYPES.UPDATE_STUDENT_CLASS_FAILURE,
        payload: error,
      };
      const state = studentReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(error);
    });
  });

  describe("Admin student detail actions", () => {
    it("should handle GET_STUDENT_REQUEST", () => {
      const action = { type: TYPES.GET_STUDENT_REQUEST };
      const state = studentReducer(initialState, action);
      expect(state.currentStudentLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle GET_STUDENT_SUCCESS", () => {
      const action = {
        type: TYPES.GET_STUDENT_SUCCESS,
        payload: mockStudent,
      };
      const state = studentReducer(initialState, action);
      expect(state.currentStudentLoading).toBe(false);
      expect(state.currentStudent).toEqual(mockStudent);
    });

    it("should handle GET_STUDENT_FAILURE", () => {
      const error = new Error("Failed to get student");
      const action = {
        type: TYPES.GET_STUDENT_FAILURE,
        payload: error,
      };
      const state = studentReducer(initialState, action);
      expect(state.currentStudentLoading).toBe(false);
      expect(state.error).toEqual(error);
    });

    it("should handle UPDATE_STUDENT_REQUEST", () => {
      const action = { type: TYPES.UPDATE_STUDENT_REQUEST };
      const state = studentReducer(initialState, action);
      expect(state.currentStudentLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it("should handle UPDATE_STUDENT_SUCCESS", () => {
      const updatedStudent = {
        ...mockStudent,
        firstName: "Updated",
      } as Student;
      const action = {
        type: TYPES.UPDATE_STUDENT_SUCCESS,
        payload: updatedStudent,
      };
      const state = studentReducer(initialState, action);
      expect(state.currentStudentLoading).toBe(false);
      expect(state.currentStudent).toEqual(updatedStudent);
    });

    it("should handle UPDATE_STUDENT_FAILURE", () => {
      const error = new Error("Failed to update student");
      const action = {
        type: TYPES.UPDATE_STUDENT_FAILURE,
        payload: error,
      };
      const state = studentReducer(initialState, action);
      expect(state.currentStudentLoading).toBe(false);
      expect(state.error).toEqual(error);
    });

    it("should handle CLEAR_CURRENT_STUDENT", () => {
      const existingState = {
        ...initialState,
        currentStudent: mockStudent,
        currentStudentLoading: true,
      };
      const action = { type: TYPES.CLEAR_CURRENT_STUDENT };
      const state = studentReducer(existingState, action);
      expect(state.currentStudent).toBe(null);
      expect(state.currentStudentLoading).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should handle multiple student additions", () => {
      const student2 = { ...mockStudent, _id: "student2" };
      const student3 = { ...mockStudent, _id: "student3" };
      const action = {
        type: TYPES.ADD_STUDENTS_SUCCESS,
        payload: [mockStudent, student2, student3],
      };
      const state = studentReducer(initialState, action);
      expect(state.students.length).toBe(3);
    });

    it("should handle multiple student deletions", () => {
      const student2 = { ...mockStudent, _id: "student2" };
      const student3 = { ...mockStudent, _id: "student3" };
      const existingState = {
        ...initialState,
        students: [mockStudent, student2, student3],
      };
      const action = {
        type: TYPES.DELETE_STUDENTS_SUCCESS,
        payload: ["student1", "student3"],
      };
      const state = studentReducer(existingState, action);
      expect(state.students.length).toBe(1);
      expect(state.students[0]._id).toBe("student2");
    });

    it("should preserve data when loading fails", () => {
      const existingState = {
        ...initialState,
        data: mockStudentData as StudentData,
      };
      const error = new Error("Load failed");
      const action = {
        type: TYPES.GET_STUDENTS_FAILURE,
        payload: error,
      };
      const state = studentReducer(existingState, action);
      expect(state.data).toEqual(mockStudentData);
    });
  });
});
