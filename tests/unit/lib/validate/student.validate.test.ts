import {
  createCountryValidation,
  createGenderValidation,
  createReligionValidation,
  createValidateGeneralStudentData,
  validateGeneralStudentData,
  validateVerificationForm,
} from "@/lib/validate/student.validate";
import { describe, expect, it } from "vitest";

/**
 * Tests for student validation schemas
 * @file tests/unit/lib/validate/student.validate.test.ts
 */

describe("student.validate", () => {
  describe("validateVerificationForm", () => {
    it("should validate correct verification data", async () => {
      const validData = {
        firstName: "John",
        lastName: "Doe",
        uniqueIdentifier: "ABC123",
      };

      await expect(
        validateVerificationForm.validate(validData),
      ).resolves.toBeTruthy();
    });

    it("should reject missing firstName", async () => {
      const invalidData = {
        lastName: "Doe",
        uniqueIdentifier: "ABC123",
      };

      await expect(
        validateVerificationForm.validate(invalidData),
      ).rejects.toThrow("Vorname ist erforderlich");
    });

    it("should reject missing lastName", async () => {
      const invalidData = {
        firstName: "John",
        uniqueIdentifier: "ABC123",
      };

      await expect(
        validateVerificationForm.validate(invalidData),
      ).rejects.toThrow("Nachname ist erforderlich");
    });

    it("should reject missing uniqueIdentifier", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
      };

      await expect(
        validateVerificationForm.validate(invalidData),
      ).rejects.toThrow("Eindeutiger Bezeichner ist erforderlich");
    });

    it("should reject uniqueIdentifier with wrong length", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        uniqueIdentifier: "ABC12",
      };

      await expect(
        validateVerificationForm.validate(invalidData),
      ).rejects.toThrow("Der Code muss genau 6 Zeichen enthalten");
    });

    it("should reject uniqueIdentifier with invalid characters", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        uniqueIdentifier: "ABC@12",
      };

      await expect(
        validateVerificationForm.validate(invalidData),
      ).rejects.toThrow();
    });

    it("should transform uniqueIdentifier to uppercase", async () => {
      const data = {
        firstName: "John",
        lastName: "Doe",
        uniqueIdentifier: "abc123",
      };

      const result = await validateVerificationForm.validate(data);
      expect(result.uniqueIdentifier).toBe("ABC123");
    });

    it("should trim whitespace from firstName", async () => {
      const data = {
        firstName: "  John  ",
        lastName: "Doe",
        uniqueIdentifier: "ABC123",
      };

      const result = await validateVerificationForm.validate(data);
      expect(result.firstName).toBe("John");
    });

    it("should trim whitespace from lastName", async () => {
      const data = {
        firstName: "John",
        lastName: "  Doe  ",
        uniqueIdentifier: "ABC123",
      };

      const result = await validateVerificationForm.validate(data);
      expect(result.lastName).toBe("Doe");
    });
  });

  describe("createGenderValidation", () => {
    it("should create validation for allowed genders (required)", async () => {
      const validation = createGenderValidation(
        ["männlich", "weiblich", "divers"],
        true,
      );
      await expect(validation.validate("männlich")).resolves.toBe("männlich");
    });

    it("should reject invalid gender (required)", async () => {
      const validation = createGenderValidation(
        ["männlich", "weiblich", "divers"],
        true,
      );
      await expect(validation.validate("invalid")).rejects.toThrow(
        "Ungültiges Geschlecht",
      );
    });

    it("should reject missing gender when required", async () => {
      const validation = createGenderValidation(
        ["männlich", "weiblich", "divers"],
        true,
      );
      await expect(validation.validate(undefined)).rejects.toThrow(
        "Geschlecht ist erforderlich",
      );
    });

    it("should allow null when not required", async () => {
      const validation = createGenderValidation(
        ["männlich", "weiblich", "divers"],
        false,
      );
      await expect(validation.validate(null)).resolves.toBeNull();
    });
  });

  describe("createReligionValidation", () => {
    it("should allow any string when allowCustom is true", async () => {
      const validation = createReligionValidation(
        ["katholisch", "evangelisch"],
        false,
        true,
      );
      await expect(validation.validate("buddhist")).resolves.toBe("buddhist");
    });

    it("should reject invalid religion when allowCustom is false", async () => {
      const validation = createReligionValidation(
        ["katholisch", "evangelisch"],
        false,
        false,
      );
      await expect(validation.validate("buddhist")).rejects.toThrow(
        "Ungültige Religion",
      );
    });

    it("should allow valid religion from list", async () => {
      const validation = createReligionValidation(
        ["katholisch", "evangelisch"],
        false,
        false,
      );
      await expect(validation.validate("katholisch")).resolves.toBe(
        "katholisch",
      );
    });

    it("should require religion when required is true", async () => {
      const validation = createReligionValidation(
        ["katholisch", "evangelisch"],
        true,
        true,
      );
      await expect(validation.validate(undefined)).rejects.toThrow(
        "Religion ist erforderlich",
      );
    });

    it("should allow null when not required", async () => {
      const validation = createReligionValidation(
        ["katholisch", "evangelisch"],
        false,
        false,
      );
      await expect(validation.validate(null)).resolves.toBeNull();
    });

    it("should require value when required is true and allowCustom is false", async () => {
      const validation = createReligionValidation(
        ["katholisch", "evangelisch"],
        true,
        false,
      );
      await expect(validation.validate(undefined)).rejects.toThrow(
        "Religion ist erforderlich",
      );
    });
  });

  describe("createCountryValidation", () => {
    it("should validate allowed country", async () => {
      const validation = createCountryValidation(["Deutschland", "Österreich"]);
      await expect(validation.validate("Deutschland")).resolves.toBe(
        "Deutschland",
      );
    });

    it("should reject invalid country", async () => {
      const validation = createCountryValidation(["Deutschland", "Österreich"]);
      await expect(validation.validate("France")).rejects.toThrow(
        "Ungültiges Land",
      );
    });

    it("should require country when required is true", async () => {
      const validation = createCountryValidation(
        ["Deutschland", "Österreich"],
        true,
      );
      await expect(validation.validate(undefined)).rejects.toThrow(
        "Geburtsland ist erforderlich",
      );
    });

    it("should allow null when not required", async () => {
      const validation = createCountryValidation(
        ["Deutschland", "Österreich"],
        false,
      );
      await expect(validation.validate(null)).resolves.toBeNull();
    });
  });

  describe("validateGeneralStudentData", () => {
    const validData = {
      eintrittschule: "2023-09-01",
      klassenname: "10A",
      vorname: "Max",
      nachname: "Mustermann",
      geburtsname: null,
      geschlecht: "männlich",
      geburtsdatum: new Date("2008-05-15"),
      geburtsland: "Deutschland",
      geburtsort: "Berlin",
      religion: "katholisch",
      staatsangehoerigkeit1: "Deutschland",
      staatsangehoerigkeit2: null,
    };

    it("should validate complete student data", async () => {
      await expect(
        validateGeneralStudentData.validate(validData),
      ).resolves.toBeTruthy();
    });

    it("should reject missing vorname", async () => {
      const { vorname, ...invalidData } = validData;
      await expect(
        validateGeneralStudentData.validate(invalidData),
      ).rejects.toThrow("Vorname ist erforderlich");
    });

    it("should reject missing nachname", async () => {
      const { nachname, ...invalidData } = validData;
      await expect(
        validateGeneralStudentData.validate(invalidData),
      ).rejects.toThrow("Nachname ist erforderlich");
    });

    it("should reject invalid geschlecht", async () => {
      const invalidData = { ...validData, geschlecht: "invalid" };
      await expect(
        validateGeneralStudentData.validate(invalidData),
      ).rejects.toThrow("Ungültiges Geschlecht");
    });

    it("should reject missing geschlecht", async () => {
      const { geschlecht, ...invalidData } = validData;
      await expect(
        validateGeneralStudentData.validate(invalidData),
      ).rejects.toThrow("Geschlecht ist erforderlich");
    });

    it("should reject invalid geburtsdatum", async () => {
      const invalidData = { ...validData, geburtsdatum: "not-a-date" };
      await expect(
        validateGeneralStudentData.validate(invalidData),
      ).rejects.toThrow("Ungültiges Datum");
    });

    it("should reject missing geburtsdatum", async () => {
      const { geburtsdatum, ...invalidData } = validData;
      await expect(
        validateGeneralStudentData.validate(invalidData),
      ).rejects.toThrow("Geburtsdatum ist erforderlich");
    });

    it("should reject missing geburtsland", async () => {
      const { geburtsland, ...invalidData } = validData;
      await expect(
        validateGeneralStudentData.validate(invalidData),
      ).rejects.toThrow("Geburtsland ist erforderlich");
    });

    it("should reject missing geburtsort", async () => {
      const { geburtsort, ...invalidData } = validData;
      await expect(
        validateGeneralStudentData.validate(invalidData),
      ).rejects.toThrow("Geburtsort ist erforderlich");
    });

    it("should reject missing staatsangehoerigkeit1", async () => {
      const { staatsangehoerigkeit1, ...invalidData } = validData;
      await expect(
        validateGeneralStudentData.validate(invalidData),
      ).rejects.toThrow("Staatsangehörigkeit ist erforderlich");
    });

    it("should allow nullable optional fields", async () => {
      const minimalData = {
        vorname: "Max",
        nachname: "Mustermann",
        geschlecht: "männlich",
        geburtsdatum: new Date("2008-05-15"),
        geburtsland: "Deutschland",
        geburtsort: "Berlin",
        staatsangehoerigkeit1: "Deutschland",
        eintrittschule: null,
        klassenname: null,
        geburtsname: null,
        religion: null,
        staatsangehoerigkeit2: null,
      };
      await expect(
        validateGeneralStudentData.validate(minimalData),
      ).resolves.toBeTruthy();
    });
  });

  describe("createValidateGeneralStudentData", () => {
    it("should create validation schema with custom gender options", async () => {
      const schema = createValidateGeneralStudentData(
        ["male", "female"],
        ["Germany"],
      );
      const data = {
        vorname: "John",
        nachname: "Doe",
        geschlecht: "male",
        geburtsdatum: new Date("2000-01-01"),
        geburtsland: "Germany",
        geburtsort: "Berlin",
        staatsangehoerigkeit1: "Germany",
      };
      await expect(schema.validate(data)).resolves.toBeTruthy();
    });

    it("should reject gender not in custom options", async () => {
      const schema = createValidateGeneralStudentData(
        ["male", "female"],
        ["Germany"],
      );
      const data = {
        vorname: "John",
        nachname: "Doe",
        geschlecht: "divers",
        geburtsdatum: new Date("2000-01-01"),
        geburtsland: "Germany",
        geburtsort: "Berlin",
        staatsangehoerigkeit1: "Germany",
      };
      await expect(schema.validate(data)).rejects.toThrow();
    });

    it("should accept any country when countryOptions is empty", async () => {
      const schema = createValidateGeneralStudentData(["male", "female"], []);
      const data = {
        vorname: "John",
        nachname: "Doe",
        geschlecht: "male",
        geburtsdatum: new Date("2000-01-01"),
        geburtsland: "Any Country",
        geburtsort: "Berlin",
        staatsangehoerigkeit1: "Any Country",
      };
      await expect(schema.validate(data)).resolves.toBeTruthy();
    });
  });
});
