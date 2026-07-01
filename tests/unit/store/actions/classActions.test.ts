import classService from "@/lib/services/classService";
import {
  addClass,
  addStudentsToClass,
  clearCurrentClass,
  deleteClasses,
  getClass,
  getClassStudents,
  getClasses,
  removeStudentsFromClass,
  setCurrentClass,
  updateClass,
} from "@/store/actions/classActions";
import * as TYPES from "@/store/types";
import * as notificationUtils from "@/utils/notification.utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("@/lib/services/classService", () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    get: vi.fn(),
    getStudentsInClass: vi.fn(),
    addStudentsToClass: vi.fn(),
    removeStudentsFromClass: vi.fn(),
  },
}));

vi.mock("@/utils/notification.utils", () => ({
  errorNotification: vi.fn(),
  successNotification: vi.fn(),
}));

vi.mock("i18next", () => ({
  default: {
    t: vi.fn((key: string) => key),
  },
}));

// Mock studentActions import
vi.mock("@/store/actions/studentActions", () => ({
  getStudents: vi.fn(() => () => {}),
}));

/**
 * Tests for class actions
 * @file tests/unit/store/actions/classActions.test.ts
 */

describe("classActions", () => {
  let dispatch: ReturnType<typeof vi.fn>;
  let getState: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dispatch = vi.fn();
    getState = vi.fn(() => ({
      class: {
        classes: [
          { _id: "1", name: "Class 1A" },
          { _id: "2", name: "Class 2B" },
        ],
      },
    }));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getClasses", () => {
    it("should dispatch success on successful fetch", async () => {
      const mockData = {
        classes: [{ _id: "1", name: "Class 1A" }],
        total: 1,
      };
      vi.mocked(classService.getAll).mockResolvedValue({ data: mockData });

      await getClasses()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_CLASSES_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_CLASSES_SUCCESS,
        payload: mockData,
      });
    });

    it("should dispatch failure on error", async () => {
      vi.mocked(classService.getAll).mockRejectedValue(
        new Error("Fetch failed"),
      );

      await getClasses()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_CLASSES_FAILURE,
        payload: expect.any(Object),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("addClass", () => {
    it("should dispatch success on successful creation", async () => {
      const newClasses = [
        { name: "Class 3C", schoolYearFrom: 2024, schoolYearTo: 2025 },
      ];
      const mockData = { classes: [{ _id: "3", name: "Class 3C" }] };
      vi.mocked(classService.create).mockResolvedValue({ data: mockData });

      await addClass(newClasses)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.ADD_CLASS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.ADD_CLASS_SUCCESS,
        payload: mockData.classes,
      });
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should dispatch failure on creation error", async () => {
      vi.mocked(classService.create).mockRejectedValue(
        new Error("Create failed"),
      );

      await addClass([{ name: "Test" }])(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.ADD_CLASS_FAILURE,
        payload: expect.any(Object),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("deleteClasses", () => {
    it("should dispatch success on successful deletion", async () => {
      vi.mocked(classService.delete).mockResolvedValue({});

      await deleteClasses(["1", "2"])(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.DELETE_CLASSES_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.DELETE_CLASSES_SUCCESS,
        payload: ["1", "2"],
      });
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should dispatch failure on deletion error", async () => {
      vi.mocked(classService.delete).mockRejectedValue(
        new Error("Delete failed"),
      );

      await deleteClasses(["1"])(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.DELETE_CLASSES_FAILURE,
        payload: expect.any(Object),
      });
    });
  });

  describe("updateClass", () => {
    it("should dispatch success on successful update", async () => {
      const mockData = { _id: "1", name: "Updated Class" };
      vi.mocked(classService.patch).mockResolvedValue({ data: mockData });

      await updateClass("1", { name: "Updated Class" })(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_CLASS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_CLASS_SUCCESS,
        payload: mockData,
      });
    });

    it("should dispatch failure on update error", async () => {
      vi.mocked(classService.patch).mockRejectedValue(
        new Error("Update failed"),
      );

      await updateClass("1", { name: "Test" })(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.UPDATE_CLASS_FAILURE,
        payload: expect.any(Object),
      });
    });

    it("should strip undefined values from patch", async () => {
      vi.mocked(classService.patch).mockResolvedValue({ data: {} });

      await updateClass("1", { name: "Test", grade: undefined })(
        dispatch,
        getState,
        undefined,
      );

      expect(classService.patch).toHaveBeenCalledWith("1", { name: "Test" });
    });
  });

  describe("setCurrentClass", () => {
    it("should dispatch current class from state", () => {
      setCurrentClass("1")(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SET_CURRENT_CLASS,
        payload: { _id: "1", name: "Class 1A" },
      });
    });

    it("should dispatch undefined for non-existent class", () => {
      setCurrentClass("999")(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SET_CURRENT_CLASS,
        payload: undefined,
      });
    });
  });

  describe("clearCurrentClass", () => {
    it("should dispatch clear action", () => {
      clearCurrentClass()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.CLEAR_CURRENT_CLASS,
      });
    });
  });

  describe("getClass", () => {
    it("should dispatch success on successful fetch", async () => {
      const mockData = { _id: "1", name: "Class 1A" };
      vi.mocked(classService.get).mockResolvedValue({ data: mockData });

      await getClass("1")(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_CLASS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_CLASS_SUCCESS,
        payload: mockData,
      });
    });

    it("should dispatch failure on fetch error", async () => {
      vi.mocked(classService.get).mockRejectedValue(new Error("Fetch failed"));

      await getClass("1")(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_CLASS_FAILURE,
        payload: expect.any(Object),
      });
    });
  });

  describe("getClassStudents", () => {
    it("should dispatch success on successful fetch", async () => {
      const mockStudents = [{ _id: "s1", firstName: "John" }];
      vi.mocked(classService.getStudentsInClass).mockResolvedValue({
        data: { students: mockStudents },
      });

      await getClassStudents("1")(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_CLASS_STUDENTS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_CLASS_STUDENTS_SUCCESS,
        payload: mockStudents,
      });
    });

    it("should dispatch failure on fetch error", async () => {
      vi.mocked(classService.getStudentsInClass).mockRejectedValue(
        new Error("Fetch failed"),
      );

      await getClassStudents("1")(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.GET_CLASS_STUDENTS_FAILURE,
        payload: expect.any(Object),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("addStudentsToClass", () => {
    it("should dispatch success on successful addition", async () => {
      vi.mocked(classService.addStudentsToClass).mockResolvedValue({});
      vi.mocked(classService.getStudentsInClass).mockResolvedValue({
        data: { students: [] },
      });

      await addStudentsToClass("1", ["s1", "s2"])(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.ADD_STUDENTS_TO_CLASS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.ADD_STUDENTS_TO_CLASS_SUCCESS,
      });
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should dispatch failure on addition error", async () => {
      vi.mocked(classService.addStudentsToClass).mockRejectedValue(
        new Error("Add failed"),
      );

      await addStudentsToClass("1", ["s1"])(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.ADD_STUDENTS_TO_CLASS_FAILURE,
        payload: expect.any(Object),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });

  describe("removeStudentsFromClass", () => {
    it("should dispatch success on successful removal", async () => {
      vi.mocked(classService.removeStudentsFromClass).mockResolvedValue({});
      vi.mocked(classService.getStudentsInClass).mockResolvedValue({
        data: { students: [] },
      });

      await removeStudentsFromClass("1", ["s1", "s2"])(
        dispatch,
        getState,
        undefined,
      );

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.REMOVE_STUDENTS_FROM_CLASS_REQUEST,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.REMOVE_STUDENTS_FROM_CLASS_SUCCESS,
      });
      expect(notificationUtils.successNotification).toHaveBeenCalled();
    });

    it("should dispatch failure on removal error", async () => {
      vi.mocked(classService.removeStudentsFromClass).mockRejectedValue(
        new Error("Remove failed"),
      );

      await removeStudentsFromClass("1", ["s1"])(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.REMOVE_STUDENTS_FROM_CLASS_FAILURE,
        payload: expect.any(Object),
      });
      expect(notificationUtils.errorNotification).toHaveBeenCalled();
    });
  });
});
