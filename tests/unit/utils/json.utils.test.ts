import { describe, expect, it } from "vitest";

import { buildStudentDataJson } from "@/utils/json.utils";
import { Student } from "@/types/db";

/**
 * Tests for JSON utility functions
 * @file tests/unit/utils/json.utils.test.ts
 */

// Helper function to read blob text in jsdom
async function blobToText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(blob);
  });
}

describe("json.utils", () => {
  const createMockStudent = (overrides: Partial<Student> = {}): Student => ({
    _id: "student123",
    firstName: "John",
    lastName: "Doe",
    birthName: null,
    dateOfBirth: new Date("2000-01-15"),
    gender: "male",
    religion: "none",
    email: "john@example.com",
    phone: "123456789",
    address: {
      street: "123 Main St",
      zip: "12345",
      city: "Berlin",
      country: "Germany",
      state: "Berlin",
      timezone: "Europe/Berlin",
    },
    birthplace: "Munich",
    birthCountry: "DE",
    nationality: "German",
    secondNationality: null,
    immigrationYear: null,
    familyLanguage: "German",
    contactPersons: [
      {
        type: "mother",
        firstName: "Jane",
        lastName: "Doe",
        address: {
          street: "123 Main St",
          zip: "12345",
          city: "Berlin",
          country: "Germany",
          state: "Berlin",
          timezone: "Europe/Berlin",
        },
        mobile: "987654321",
        phone: "123456789",
      },
    ],
    previousSchool: "High School",
    previousSchoolType: "gymnasium",
    previousSchoolLevel: "abitur",
    degrees: ["abitur"],
    profession: null,
    trainingStartDate: null,
    employer: null,
    agreements: {
      dataProtection: true,
      classParticipation: true,
      schoolRules: true,
      imageRights: false,
      teamsUsage: true,
    },
    currentClass: "class123",
    currentClassName: "10A",
    status: "invited",
    onboardingStep: 3,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
    ...overrides,
  });

  describe("buildStudentDataJson", () => {
    it("should generate JSON blob with student data", async () => {
      const student = createMockStudent();
      const blob = await buildStudentDataJson(student);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("application/json");
    });

    it("should include personal info fields", async () => {
      const student = createMockStudent();
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      expect(data.personalInfo).toBeDefined();
      expect(data.personalInfo.firstName).toBe("John");
      expect(data.personalInfo.lastName).toBe("Doe");
      expect(data.personalInfo.gender).toBe("male");
    });

    it("should include contact fields", async () => {
      const student = createMockStudent();
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      expect(data.contact).toBeDefined();
      expect(data.contact.email).toBe("john@example.com");
      expect(data.contact.phone).toBe("123456789");
    });

    it("should include address when present", async () => {
      const student = createMockStudent();
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      expect(data.address).toBeDefined();
      expect(data.address.street).toBe("123 Main St");
      expect(data.address.city).toBe("Berlin");
    });

    it("should handle missing address", async () => {
      const student = createMockStudent({ address: undefined });
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      expect(data.address).toBeUndefined();
    });

    it("should include origin data", async () => {
      const student = createMockStudent();
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      expect(data.origin).toBeDefined();
      expect(data.origin.birthplace).toBe("Munich");
      expect(data.origin.nationality).toBe("German");
    });

    it("should include contact persons", async () => {
      const student = createMockStudent();
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      expect(data.contactPersons).toBeDefined();
      expect(data.contactPersons.length).toBe(1);
      expect(data.contactPersons[0].firstName).toBe("Jane");
    });

    it("should handle contact person without address", async () => {
      const student = createMockStudent({
        contactPersons: [
          {
            type: "father",
            firstName: "Bob",
            lastName: "Doe",
            address: undefined,
            mobile: "111222333",
            phone: "444555666",
          },
        ],
      });
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      expect(data.contactPersons[0].address).toBeUndefined();
    });

    it("should include education data", async () => {
      const student = createMockStudent();
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      expect(data.education).toBeDefined();
      expect(data.education.previousSchool).toBe("High School");
    });

    it("should include employer when present", async () => {
      const student = createMockStudent({
        employer: {
          companyName: "Tech Corp",
          contactName: "HR Manager",
          contactPhone: "555-1234",
          contactEmail: "hr@techcorp.com",
          contactSalutation: "Mr.",
          address: "456 Business Ave",
          verified: true,
        },
      });
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      expect(data.employer).toBeDefined();
      expect(data.employer.companyName).toBe("Tech Corp");
    });

    it("should handle missing employer", async () => {
      const student = createMockStudent({ employer: null });
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      expect(data.employer).toBeUndefined();
    });

    it("should include agreements when present", async () => {
      const student = createMockStudent();
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      expect(data.agreements).toBeDefined();
      expect(data.agreements.dataProtection).toBe(true);
    });

    it("should handle missing agreements", async () => {
      const student = createMockStudent({ agreements: undefined });
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      expect(data.agreements).toBeUndefined();
    });

    it("should include class info when present", async () => {
      const student = createMockStudent();
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      expect(data.class).toBeDefined();
      expect(data.class.id).toBe("class123");
      expect(data.class.name).toBe("10A");
    });

    it("should handle missing class", async () => {
      const student = createMockStudent({
        currentClass: undefined,
        currentClassName: undefined,
      });
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      expect(data.class).toBeUndefined();
    });

    it("should include metadata", async () => {
      const student = createMockStudent();
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      expect(data.metadata).toBeDefined();
      expect(data.metadata.status).toBe("invited");
      expect(data.metadata.onboardingStep).toBe(3);
    });

    it("should remove empty fields by default", async () => {
      const student = createMockStudent({
        birthName: null,
        secondNationality: null,
        immigrationYear: null,
      });
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      // Empty fields should be removed
      expect(data.personalInfo.birthName).toBeUndefined();
      expect(data.origin.secondNationality).toBeUndefined();
    });

    it("should include empty fields when includeEmptyFields is true", async () => {
      const student = createMockStudent({
        birthName: "",
        phone: "",
      });
      const blob = await buildStudentDataJson(student, {
        includeEmptyFields: true,
      });
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      // Empty fields should be included
      expect(data.personalInfo.birthName).toBe("");
      expect(data.contact.phone).toBe("");
    });

    it("should handle student with minimal data", async () => {
      const minimalStudent: Student = {
        _id: "min123",
        firstName: "Min",
        lastName: "Student",
        birthName: null,
        dateOfBirth: new Date(),
        gender: "",
        religion: "",
        email: "",
        phone: "",
        address: undefined,
        birthplace: "",
        birthCountry: "",
        nationality: "",
        secondNationality: null,
        immigrationYear: null,
        familyLanguage: "",
        contactPersons: [],
        previousSchool: "",
        previousSchoolType: "",
        previousSchoolLevel: "",
        degrees: [],
        profession: null,
        trainingStartDate: null,
        employer: null,
        agreements: undefined,
        currentClass: undefined,
        currentClassName: undefined,
        status: "imported",
        onboardingStep: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const blob = await buildStudentDataJson(minimalStudent);
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("application/json");
    });

    it("should handle empty contact persons array", async () => {
      const student = createMockStudent({ contactPersons: [] });
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      // Empty arrays should be removed when removeEmptyFields is active
      expect(data.contactPersons).toBeUndefined();
    });

    it("should handle multiple contact persons", async () => {
      const student = createMockStudent({
        contactPersons: [
          {
            type: "mother",
            firstName: "Jane",
            lastName: "Doe",
            address: undefined,
            mobile: "111",
            phone: "222",
          },
          {
            type: "father",
            firstName: "Bob",
            lastName: "Doe",
            address: undefined,
            mobile: "333",
            phone: "444",
          },
        ],
      });
      const blob = await buildStudentDataJson(student);
      const text = await blobToText(blob);
      const data = JSON.parse(text);

      expect(data.contactPersons.length).toBe(2);
    });
  });
});
