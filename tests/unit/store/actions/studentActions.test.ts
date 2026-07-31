import studentService from "@/lib/services/studentService";
import {
  addStudents,
  clearCurrentStudent,
  clearStudentError,
  clearStudentOnboardingData,
  deleteStudents,
  getStudent,
  getStudents,
  loadStudentForOnboarding,
  saveOnboardingProgress,
  setCurrentStudentOnboardingStep,
  setEditingFromSummary,
  submitOnboarding,
  updateStudent,
  updateStudentClass,
  updateStudentOnboardingData,
  verifyStudent,
} from "@/store/actions/studentActions";
import * as TYPES from "@/store/types";
import * as notificationUtils from "@/utils/notification.utils";
import * as studentDataMapper from "@/utils/studentDataMapper";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("@/lib/services/studentService", () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    verify: vi.fn(),
    getById: vi.fn(),
    updateOnboarding: vi.fn(),
    submitOnboarding: vi.fn(),
    updateClass: vi.fn(),
    patch: vi.fn(),
  },
}));

vi.mock("@/utils/notification.utils", () => ({
  errorNotification: vi.fn(),
  successNotification: vi.fn(),
}));

vi.mock("@/utils/studentDataMapper", () => ({
  mapFormDataToModel: vi.fn((data) => data),
  mapModelToFormData: vi.fn((data) => data),
}));

vi.mock("i18next", () => ({
  default: {
    t: vi.fn((key: string) => key),
  },
}));

/**
 * Tests for student actions
 * @file tests/unit/store/actions/studentActions.test.ts
 */

describe("studentActions", () => {
  let dispatch: ReturnType<typeof vi.fn>;
  let getState: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dispatch = vi.fn();
    getState = vi.fn(() => ({
      student: {
        previousStep: null,
        pagination: {
          page: 1,
          limit: 25,
          total: 0,
          pages: 0,
        },
        filters: {},
      },
    }));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("setCurrentStudentOnboardingStep", () => {
    it("should dispatch step change", () => {
      setCurrentStudentOnboardingStep(3)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SET_STUDENT_CURRENT_STEP,
        payload: 3,
      });
    });
  });

  describe("setEditingFromSummary", () => {
    it("should dispatch editing state", () => {
      setEditingFromSummary(true)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SET_EDITING_FROM_SUMMARY,
        payload: true,
      });
    });
  });

  describe("getStudents", () => {
    it("should dispatch success on successful fetch", async () => {
      const mockStudents = [{ _id: "1", firstName: "John" }];
      vi.mocked(studentService.getAll).mockResolvedValue({
        data: {
          students: mockStudents,
          page: 2,
          limit: 50,
          total: 1,
          pages: 1,
        },
      });

      const filters = {
        classId: "507f1f77bcf86cd799439011",
        status: "onboarded" as const,
      };
      await getStudents(2, 50, filters)(dispatch, getState, undefined);

      expect(studentService.getAll).toHaveBeenCalledWith({
        page: 2,
        limit: 50,
        ...filters,
      });

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_STUDENTS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_STUDENTS_SUCCESS,
        payload: {
          students: mockStudents,
          pagination: {
            page: 2,
            limit: 50,
            total: 1,
            pages: 1,
          },
          filters,
        },
      });
    });

    it("should dispatch failure on error", async () => {
      vi.mocked(studentService.getAll).mockRejectedValue(
        new Error("Fetch failed"),
      );

      await getStudents()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_STUDENTS_FAILURE,
        payload: expect.any(Error),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("addStudents", () => {
    it("should dispatch success on successful creation", async () => {
      const mockCreated = [{ _id: "1", firstName: "John" }];
      vi.mocked(studentService.create).mockResolvedValue({
        data: { created: mockCreated },
      });
      vi.mocked(studentService.getAll).mockResolvedValue({
        data: { students: [] },
      });

      await addStudents([{ firstName: "John", lastName: "Doe" }])(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.ADD_STUDENTS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.ADD_STUDENTS_SUCCESS,
        payload: mockCreated,
      });
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should dispatch failure on creation error", async () => {
      vi.mocked(studentService.create).mockRejectedValue(
        new Error("Create failed"),
      );

      await addStudents([{ firstName: "John", lastName: "Doe" }])(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.ADD_STUDENTS_FAILURE,
        payload: expect.any(Error),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("deleteStudents", () => {
    it("should dispatch success on successful deletion", async () => {
      vi.mocked(studentService.delete).mockResolvedValue({});
      vi.mocked(studentService.getAll).mockResolvedValue({
        data: { students: [] },
      });

      await deleteStudents(["1", "2"])(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.DELETE_STUDENTS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.DELETE_STUDENTS_SUCCESS,
        payload: ["1", "2"],
      });
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should dispatch failure on deletion error", async () => {
      vi.mocked(studentService.delete).mockRejectedValue(
        new Error("Delete failed"),
      );

      await deleteStudents(["1"])(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.DELETE_STUDENTS_FAILURE,
        payload: expect.any(Error),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("verifyStudent", () => {
    it("should dispatch success on successful verification", async () => {
      const mockData = { studentId: "123" };
      vi.mocked(studentService.verify).mockResolvedValue({ data: mockData });

      const result = await verifyStudent("John", "Doe", "ABC123")(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.VERIFY_STUDENT_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.VERIFY_STUDENT_SUCCESS,
        payload: mockData,
      });
      expect(result).toBe("123");
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should dispatch failure on verification error", async () => {
      const mockError = {
        response: { data: { error: "Invalid code" } },
      };
      vi.mocked(studentService.verify).mockRejectedValue(mockError);

      await expect(
        verifyStudent("John", "Doe", "WRONG")(dispatch, getState, undefined),
      ).rejects.toEqual(mockError);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.VERIFY_STUDENT_FAILURE,
        payload: mockError,
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalledWith(
        "Invalid code",
      );
    });
  });

  describe("updateStudentOnboardingData", () => {
    it("should dispatch update with data", () => {
      const data = { firstName: "John" };

      updateStudentOnboardingData(data)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_STUDENT_ONBOARDING_DATA,
        payload: data,
      });
    });
  });

  describe("clearStudentOnboardingData", () => {
    it("should dispatch clear action", () => {
      clearStudentOnboardingData()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.CLEAR_STUDENT_ONBOARDING_DATA,
      });
    });
  });

  describe("clearStudentError", () => {
    it("should dispatch clear error action", () => {
      clearStudentError()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.CLEAR_STUDENT_ERROR,
      });
    });
  });

  describe("loadStudentForOnboarding", () => {
    it("should dispatch success on successful load", async () => {
      const mockStudent = {
        _id: "507f1f77bcf86cd799439011",
        firstName: "John",
        lastName: "Doe",
        status: "invited",
        currentClass: { _id: "c1", name: "Class 1" },
        onboardingStep: 2,
        previousStep: 1,
      };
      vi.mocked(studentService.getById).mockResolvedValue({
        data: { data: mockStudent },
      });

      await loadStudentForOnboarding("507f1f77bcf86cd799439011")(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.LOAD_STUDENT_FOR_ONBOARDING_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.LOAD_STUDENT_FOR_ONBOARDING_SUCCESS,
        payload: expect.objectContaining({
          student: mockStudent,
          studentId: "507f1f77bcf86cd799439011",
        }),
      });
    });

    it("should dispatch failure for invalid student ID format", async () => {
      await loadStudentForOnboarding("invalid-id")(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.LOAD_STUDENT_FOR_ONBOARDING_FAILURE,
        payload: expect.any(Error),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });

    it("should dispatch failure when student not found", async () => {
      vi.mocked(studentService.getById).mockResolvedValue({
        data: { data: null },
      });

      await loadStudentForOnboarding("507f1f77bcf86cd799439011")(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.LOAD_STUDENT_FOR_ONBOARDING_FAILURE,
        payload: expect.any(Error),
      });
    });

    it("should dispatch failure when student already onboarded", async () => {
      vi.mocked(studentService.getById).mockResolvedValue({
        data: { data: { status: "onboarded" } },
      });

      await loadStudentForOnboarding("507f1f77bcf86cd799439011")(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.LOAD_STUDENT_FOR_ONBOARDING_FAILURE,
        payload: expect.any(Error),
      });
    });
  });

  describe("saveOnboardingProgress", () => {
    it("should dispatch success on successful save", async () => {
      vi.mocked(studentService.updateOnboarding).mockResolvedValue({
        data: { success: true },
      });

      await saveOnboardingProgress("123", { firstName: "John" }, 3)(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SAVE_ONBOARDING_PROGRESS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SAVE_ONBOARDING_PROGRESS_SUCCESS,
        payload: { success: true },
      });
      expect(studentDataMapper.mapFormDataToModel).toHaveBeenCalled();
    });

    it("should dispatch failure on save error", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      vi.mocked(studentService.updateOnboarding).mockRejectedValue(
        new Error("Save failed"),
      );

      await saveOnboardingProgress("123", { firstName: "John" })(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SAVE_ONBOARDING_PROGRESS_FAILURE,
        payload: expect.any(Error),
      });
      consoleSpy.mockRestore();
    });
  });

  describe("submitOnboarding", () => {
    it("should dispatch success on successful submit", async () => {
      vi.mocked(studentService.submitOnboarding).mockResolvedValue({
        data: { success: true },
      });

      await submitOnboarding("123", { firstName: "John" } as any)(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SUBMIT_ONBOARDING_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SUBMIT_ONBOARDING_SUCCESS,
        payload: { success: true },
      });
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should dispatch failure on submit error", async () => {
      vi.mocked(studentService.submitOnboarding).mockRejectedValue(
        new Error("Submit failed"),
      );

      await submitOnboarding("123", { firstName: "John" } as any)(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SUBMIT_ONBOARDING_FAILURE,
        payload: expect.any(Error),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("updateStudentClass", () => {
    it("should dispatch success on successful class update", async () => {
      vi.mocked(studentService.updateClass).mockResolvedValue({});
      vi.mocked(studentService.getAll).mockResolvedValue({
        data: { students: [] },
      });

      await updateStudentClass("123", "class1")(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_STUDENT_CLASS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_STUDENT_CLASS_SUCCESS,
      });
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should dispatch failure on class update error", async () => {
      vi.mocked(studentService.updateClass).mockRejectedValue(
        new Error("Update failed"),
      );

      await expect(
        updateStudentClass("123", "class1")(dispatch, getState, undefined),
      ).rejects.toThrow();

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_STUDENT_CLASS_FAILURE,
        payload: expect.any(Error),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("getStudent", () => {
    it("should dispatch success on successful fetch", async () => {
      const mockStudent = { _id: "1", firstName: "John" };
      vi.mocked(studentService.getById).mockResolvedValue({
        data: { data: mockStudent },
      });

      await getStudent("1")(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_STUDENT_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_STUDENT_SUCCESS,
        payload: mockStudent,
      });
    });

    it("should dispatch failure on fetch error", async () => {
      vi.mocked(studentService.getById).mockRejectedValue(
        new Error("Fetch failed"),
      );

      await getStudent("1")(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_STUDENT_FAILURE,
        payload: expect.any(Error),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("updateStudent", () => {
    it("should dispatch success on successful update", async () => {
      const mockStudent = { _id: "1", firstName: "Updated" };
      vi.mocked(studentService.patch).mockResolvedValue({
        data: { data: mockStudent },
      });
      vi.mocked(studentService.getAll).mockResolvedValue({
        data: { students: [] },
      });

      await updateStudent("1", { firstName: "Updated" })(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_STUDENT_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_STUDENT_SUCCESS,
        payload: mockStudent,
      });
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should dispatch failure on update error", async () => {
      vi.mocked(studentService.patch).mockRejectedValue(
        new Error("Update failed"),
      );

      await updateStudent("1", { firstName: "Test" })(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_STUDENT_FAILURE,
        payload: expect.any(Error),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("clearCurrentStudent", () => {
    it("should dispatch clear action", () => {
      clearCurrentStudent()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.CLEAR_CURRENT_STUDENT,
      });
    });
  });
});
