import {
  StepDef,
  getActiveSteps,
  getStudentSteps,
} from "@/constants/studentSteps.constants";
import { ClassInterface } from "@/types/class.d";
import { describe, expect, it } from "vitest";

// Mock translation function
const mockT = (key: string) => key;

describe("getActiveSteps", () => {
  const allSteps: StepDef[] = getStudentSteps(mockT);

  describe("German students", () => {
    it("should hide OriginForm for German students (ISO code: DE)", () => {
      const studentData = { geburtsland: "DE" };
      const currentClass: ClassInterface = {
        _id: "class1",
        name: "Class 1A",
        schoolYearFrom: 2024,
        schoolYearTo: 2025,
        grade: 10,
        isVocational: false,
        active: true,
        studentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const activeSteps = getActiveSteps(allSteps, studentData, currentClass);

      // OriginForm (step 2) should not be in active steps
      const originStepExists = activeSteps.some((step) => step.id === 2);
      expect(originStepExists).toBe(false);
    });

    it("should hide OriginForm for German students (full name: Deutschland)", () => {
      const studentData = { geburtsland: "Deutschland" };
      const currentClass: ClassInterface = {
        _id: "class1",
        name: "Class 1A",
        schoolYearFrom: 2024,
        schoolYearTo: 2025,
        grade: 10,
        isVocational: false,
        active: true,
        studentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const activeSteps = getActiveSteps(allSteps, studentData, currentClass);

      const originStepExists = activeSteps.some((step) => step.id === 2);
      expect(originStepExists).toBe(false);
    });

    it("should hide OriginForm for German students (English: Germany)", () => {
      const studentData = { geburtsland: "Germany" };
      const currentClass: ClassInterface = {
        _id: "class1",
        name: "Class 1A",
        schoolYearFrom: 2024,
        schoolYearTo: 2025,
        grade: 10,
        isVocational: false,
        active: true,
        studentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const activeSteps = getActiveSteps(allSteps, studentData, currentClass);

      const originStepExists = activeSteps.some((step) => step.id === 2);
      expect(originStepExists).toBe(false);
    });

    it("should handle case-insensitive country names", () => {
      const studentDataLower = { geburtsland: "deutschland" };
      const studentDataUpper = { geburtsland: "GERMANY" };
      const currentClass: ClassInterface = {
        _id: "class1",
        name: "Class 1A",
        schoolYearFrom: 2024,
        schoolYearTo: 2025,
        grade: 10,
        isVocational: false,
        active: true,
        studentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const activeStepsLower = getActiveSteps(
        allSteps,
        studentDataLower,
        currentClass,
      );
      const activeStepsUpper = getActiveSteps(
        allSteps,
        studentDataUpper,
        currentClass,
      );

      expect(activeStepsLower.some((step) => step.id === 2)).toBe(false);
      expect(activeStepsUpper.some((step) => step.id === 2)).toBe(false);
    });
  });

  describe("Non-German students", () => {
    it("should show OriginForm for Turkish students", () => {
      const studentData = { geburtsland: "TR" };
      const currentClass: ClassInterface = {
        _id: "class1",
        name: "Class 1A",
        schoolYearFrom: 2024,
        schoolYearTo: 2025,
        grade: 10,
        isVocational: false,
        active: true,
        studentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const activeSteps = getActiveSteps(allSteps, studentData, currentClass);

      // OriginForm (step 2) should be in active steps
      const originStepExists = activeSteps.some((step) => step.id === 2);
      expect(originStepExists).toBe(true);
    });

    it("should show OriginForm for students from any non-German country", () => {
      const countries = ["US", "FR", "ES", "IT", "PL", "UA"];
      const currentClass: ClassInterface = {
        _id: "class1",
        name: "Class 1A",
        schoolYearFrom: 2024,
        schoolYearTo: 2025,
        grade: 10,
        isVocational: false,
        active: true,
        studentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      countries.forEach((country) => {
        const studentData = { geburtsland: country };
        const activeSteps = getActiveSteps(allSteps, studentData, currentClass);
        const originStepExists = activeSteps.some((step) => step.id === 2);
        expect(originStepExists).toBe(true);
      });
    });
  });

  describe("Vocational students", () => {
    it("should show TrainingForm and CompanyContactForm for vocational class", () => {
      const studentData = { geburtsland: "DE" };
      const currentClass: ClassInterface = {
        _id: "class1",
        name: "Vocational Class",
        schoolYearFrom: 2024,
        schoolYearTo: 2025,
        grade: 10,
        isVocational: true,
        active: true,
        studentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const activeSteps = getActiveSteps(allSteps, studentData, currentClass);

      // TrainingForm (step 6) should be in active steps
      const trainingStepExists = activeSteps.some((step) => step.id === 6);
      expect(trainingStepExists).toBe(true);

      // CompanyContactForm (step 7) should be in active steps
      const companyContactStepExists = activeSteps.some(
        (step) => step.id === 7,
      );
      expect(companyContactStepExists).toBe(true);
    });

    it("should hide TrainingForm and CompanyContactForm for non-vocational class", () => {
      const studentData = { geburtsland: "DE" };
      const currentClass: ClassInterface = {
        _id: "class1",
        name: "Regular Class",
        schoolYearFrom: 2024,
        schoolYearTo: 2025,
        grade: 10,
        isVocational: false,
        active: true,
        studentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const activeSteps = getActiveSteps(allSteps, studentData, currentClass);

      // TrainingForm (step 6) should NOT be in active steps
      const trainingStepExists = activeSteps.some((step) => step.id === 6);
      expect(trainingStepExists).toBe(false);

      // CompanyContactForm (step 7) should NOT be in active steps
      const companyContactStepExists = activeSteps.some(
        (step) => step.id === 7,
      );
      expect(companyContactStepExists).toBe(false);
    });

    it("should handle null or undefined isVocational as false", () => {
      const studentData = { geburtsland: "DE" };
      const currentClass: ClassInterface = {
        _id: "class1",
        name: "Class 1A",
        schoolYearFrom: 2024,
        schoolYearTo: 2025,
        grade: 10,
        isVocational: undefined as unknown as boolean,
        active: true,
        studentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const activeSteps = getActiveSteps(allSteps, studentData, currentClass);

      const trainingStepExists = activeSteps.some((step) => step.id === 6);
      const companyContactStepExists = activeSteps.some(
        (step) => step.id === 7,
      );

      expect(trainingStepExists).toBe(false);
      expect(companyContactStepExists).toBe(false);
    });
  });

  describe("Combined scenarios", () => {
    it("should show only OriginForm for non-German student in non-vocational class", () => {
      const studentData = { geburtsland: "TR" };
      const currentClass: ClassInterface = {
        _id: "class1",
        name: "Class 1A",
        schoolYearFrom: 2024,
        schoolYearTo: 2025,
        grade: 10,
        isVocational: false,
        active: true,
        studentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const activeSteps = getActiveSteps(allSteps, studentData, currentClass);

      // Should show OriginForm
      expect(activeSteps.some((step) => step.id === 2)).toBe(true);

      // Should NOT show vocational forms
      expect(activeSteps.some((step) => step.id === 6)).toBe(false);
      expect(activeSteps.some((step) => step.id === 7)).toBe(false);
    });

    it("should show only vocational forms for German student in vocational class", () => {
      const studentData = { geburtsland: "DE" };
      const currentClass: ClassInterface = {
        _id: "class1",
        name: "Vocational Class",
        schoolYearFrom: 2024,
        schoolYearTo: 2025,
        grade: 10,
        isVocational: true,
        active: true,
        studentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const activeSteps = getActiveSteps(allSteps, studentData, currentClass);

      // Should NOT show OriginForm
      expect(activeSteps.some((step) => step.id === 2)).toBe(false);

      // Should show vocational forms
      expect(activeSteps.some((step) => step.id === 6)).toBe(true);
      expect(activeSteps.some((step) => step.id === 7)).toBe(true);
    });

    it("should show both OriginForm and vocational forms for non-German student in vocational class", () => {
      const studentData = { geburtsland: "PL" };
      const currentClass: ClassInterface = {
        _id: "class1",
        name: "Vocational Class",
        schoolYearFrom: 2024,
        schoolYearTo: 2025,
        grade: 10,
        isVocational: true,
        active: true,
        studentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const activeSteps = getActiveSteps(allSteps, studentData, currentClass);

      // Should show OriginForm
      expect(activeSteps.some((step) => step.id === 2)).toBe(true);

      // Should show vocational forms
      expect(activeSteps.some((step) => step.id === 6)).toBe(true);
      expect(activeSteps.some((step) => step.id === 7)).toBe(true);
    });

    it("should show minimal steps for German student in non-vocational class", () => {
      const studentData = { geburtsland: "DE" };
      const currentClass: ClassInterface = {
        _id: "class1",
        name: "Regular Class",
        schoolYearFrom: 2024,
        schoolYearTo: 2025,
        grade: 10,
        isVocational: false,
        active: true,
        studentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const activeSteps = getActiveSteps(allSteps, studentData, currentClass);

      // Should NOT show conditional steps
      expect(activeSteps.some((step) => step.id === 2)).toBe(false); // OriginForm
      expect(activeSteps.some((step) => step.id === 6)).toBe(false); // TrainingForm
      expect(activeSteps.some((step) => step.id === 7)).toBe(false); // CompanyContactForm

      // Should show all non-conditional steps (0, 1, 3, 4, 5, 8, 9)
      expect(activeSteps.some((step) => step.id === 0)).toBe(true); // WelcomeForm
      expect(activeSteps.some((step) => step.id === 1)).toBe(true); // GeneralForm
      expect(activeSteps.some((step) => step.id === 3)).toBe(true); // AddressForm
      expect(activeSteps.some((step) => step.id === 4)).toBe(true); // ParentsForm
      expect(activeSteps.some((step) => step.id === 5)).toBe(true); // PreEducationForm
      expect(activeSteps.some((step) => step.id === 8)).toBe(true); // SummaryForm
      expect(activeSteps.some((step) => step.id === 9)).toBe(true); // CompletionForm
    });
  });

  describe("Edge cases", () => {
    it("should handle null currentClass gracefully", () => {
      const studentData = { geburtsland: "DE" };
      const currentClass = null;

      const activeSteps = getActiveSteps(allSteps, studentData, currentClass);

      // Should not show vocational forms when class is null
      expect(activeSteps.some((step) => step.id === 6)).toBe(false);
      expect(activeSteps.some((step) => step.id === 7)).toBe(false);
    });

    it("should handle empty geburtsland", () => {
      const studentData = { geburtsland: "" };
      const currentClass: ClassInterface = {
        _id: "class1",
        name: "Class 1A",
        schoolYearFrom: 2024,
        schoolYearTo: 2025,
        grade: 10,
        isVocational: false,
        active: true,
        studentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const activeSteps = getActiveSteps(allSteps, studentData, currentClass);

      // Empty string means country not yet selected, so OriginForm should be hidden
      expect(activeSteps.some((step) => step.id === 2)).toBe(false);
    });

    it("should handle undefined geburtsland", () => {
      const studentData = {};
      const currentClass: ClassInterface = {
        _id: "class1",
        name: "Class 1A",
        schoolYearFrom: 2024,
        schoolYearTo: 2025,
        grade: 10,
        isVocational: false,
        active: true,
        studentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const activeSteps = getActiveSteps(allSteps, studentData, currentClass);

      // Undefined means country not yet selected, so OriginForm should be hidden
      expect(activeSteps.some((step) => step.id === 2)).toBe(false);
    });

    it("should handle whitespace in country name", () => {
      const studentData = { geburtsland: "  DE  " };
      const currentClass: ClassInterface = {
        _id: "class1",
        name: "Class 1A",
        schoolYearFrom: 2024,
        schoolYearTo: 2025,
        grade: 10,
        isVocational: false,
        active: true,
        studentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const activeSteps = getActiveSteps(allSteps, studentData, currentClass);

      // Should trim whitespace and recognize as Germany
      expect(activeSteps.some((step) => step.id === 2)).toBe(false);
    });
  });
});
