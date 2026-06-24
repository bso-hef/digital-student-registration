import type { Student } from "@/types/db";
import type { StudentData } from "@/types/student.d";
import {
  mapFormDataToModel,
  mapModelToFormData,
  validateOnboardingData,
} from "@/utils/studentDataMapper";
import { describe, expect, it, vi } from "vitest";

// Mock date utils
vi.mock("@/utils/date.utils", () => ({
  parseDate: vi.fn((dateStr: string) => {
    if (!dateStr) return null;
    // Simple date parsing for tests
    const [day, month, year] = dateStr.split(".");
    if (day && month && year) {
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    return new Date(dateStr);
  }),
  formatGermanDate: vi.fn((date: Date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getFullYear()}`;
  }),
}));

/**
 * Tests for student data mapper utility functions
 * @file tests/unit/utils/studentDataMapper.test.ts
 */

describe("studentDataMapper", () => {
  describe("mapFormDataToModel", () => {
    it("should map basic personal info fields", () => {
      const formData: Partial<StudentData> = {
        vorname: "Max",
        nachname: "Mustermann",
        geburtsname: "Schmidt",
      };

      const result = mapFormDataToModel(formData);

      expect(result.firstName).toBe("Max");
      expect(result.lastName).toBe("Mustermann");
      expect(result.birthName).toBe("Schmidt");
    });

    it("should map date of birth", () => {
      const formData: Partial<StudentData> = {
        geburtsdatum: "15.01.2000",
      };

      const result = mapFormDataToModel(formData);

      expect(result.dateOfBirth).toBeDefined();
    });

    it("should map gender from German to English", () => {
      const maleData = mapFormDataToModel({ geschlecht: "männlich" });
      const femaleData = mapFormDataToModel({ geschlecht: "weiblich" });
      const diverseData = mapFormDataToModel({ geschlecht: "divers" });

      expect(maleData.gender).toBe("male");
      expect(femaleData.gender).toBe("female");
      expect(diverseData.gender).toBe("diverse");
    });

    it("should pass through English gender values", () => {
      const maleData = mapFormDataToModel({ geschlecht: "male" });
      const femaleData = mapFormDataToModel({ geschlecht: "female" });
      const diverseData = mapFormDataToModel({ geschlecht: "diverse" });

      expect(maleData.gender).toBe("male");
      expect(femaleData.gender).toBe("female");
      expect(diverseData.gender).toBe("diverse");
    });

    it("should handle unknown gender values", () => {
      const result = mapFormDataToModel({ geschlecht: "unknown" });
      expect(result.gender).toBeUndefined();
    });

    it("should map origin fields", () => {
      const formData: Partial<StudentData> = {
        geburtsort: "Berlin",
        geburtsland: "DE",
        religion: "none",
        staatsangehoerigkeit1: "German",
        staatsangehoerigkeit2: "French",
        familiensprache: "German",
      };

      const result = mapFormDataToModel(formData);

      expect(result.birthplace).toBe("Berlin");
      expect(result.birthCountry).toBe("DE");
      expect(result.religion).toBe("none");
      expect(result.nationality).toBe("German");
      expect(result.secondNationality).toBe("French");
      expect(result.familyLanguage).toBe("German");
    });

    it("should map immigration year as string", () => {
      const result = mapFormDataToModel({ zuzugsjahr: "2015" });
      expect(result.immigrationYear).toBe(2015);
    });

    it("should map immigration year as number", () => {
      const result = mapFormDataToModel({
        zuzugsjahr: 2015 as unknown as string,
      });
      expect(result.immigrationYear).toBe(2015);
    });

    it("should map contact fields", () => {
      const formData: Partial<StudentData> = {
        email: "max@example.com",
        mobil: "0171234567",
      };

      const result = mapFormDataToModel(formData);

      expect(result.email).toBe("max@example.com");
      expect(result.phone).toBe("0171234567");
    });

    it("should map address with street and house number", () => {
      const formData: Partial<StudentData> = {
        straße: "Hauptstraße",
        hausNr: "123",
        postleitzahl: "12345",
        ort: "Berlin",
      };

      const result = mapFormDataToModel(formData);

      expect(result.address).toBeDefined();
      expect(result.address?.street).toBe("Hauptstraße 123");
      expect(result.address?.zip).toBe("12345");
      expect(result.address?.city).toBe("Berlin");
      expect(result.address?.country).toBe("DE");
      expect(result.address?.timezone).toBe("Europe/Berlin");
    });

    it("should map address with only street", () => {
      const formData: Partial<StudentData> = {
        straße: "Hauptstraße",
      };

      const result = mapFormDataToModel(formData);

      expect(result.address?.street).toBe("Hauptstraße");
    });

    it("should map address with only city", () => {
      const formData: Partial<StudentData> = {
        ort: "Berlin",
      };

      const result = mapFormDataToModel(formData);

      expect(result.address?.city).toBe("Berlin");
    });

    it("should map education fields", () => {
      const formData: Partial<StudentData> = {
        eintrittschule: "01.09.2020",
        klassenname: "10A",
        vorhergehendeSchule: "High School",
        vorhergehendeSchulform: "gymnasium",
        vorhergehendeStufe: "10",
        abschluesse: ["abitur"],
      };

      const result = mapFormDataToModel(formData);

      expect(result.schoolEntryDate).toBeDefined();
      expect(result.currentClassName).toBe("10A");
      expect(result.previousSchool).toBe("High School");
      expect(result.previousSchoolType).toBe("gymnasium");
      expect(result.previousSchoolLevel).toBe("10");
      expect(result.degrees).toEqual(["abitur"]);
    });

    it("should map profession and training fields", () => {
      const formData: Partial<StudentData> = {
        beruf: "Developer",
        betriebEintritt: "01.08.2023",
      };

      const result = mapFormDataToModel(formData);

      expect(result.profession).toBe("Developer");
      expect(result.trainingStartDate).toBeDefined();
    });

    it("should map employer information", () => {
      const formData: Partial<StudentData> = {
        betriebName: "Tech Corp",
        betriebStraße: "Business",
        betriebHausNr: "1",
        betriebPlz: "10115",
        betriebOrt: "Berlin",
        betriebApName: "HR Manager",
        betriebEmail: "hr@techcorp.com",
        betriebTelefon1: "030123456",
        betriebApAnrede: "Herr",
        betriebAp2Name: "Second Contact",
        betriebAp2Email: "second@techcorp.com",
        betriebAp2Telefon1: "030789012",
        betriebAp2Anrede: "Frau",
      };

      const result = mapFormDataToModel(formData);

      expect(result.employer).toBeDefined();
      expect(result.employer?.companyName).toBe("Tech Corp");
      expect(result.employer?.address).toContain("Business");
      expect(result.employer?.contactName).toBe("HR Manager");
      expect(result.employer?.contactEmail).toBe("hr@techcorp.com");
      expect(result.employer?.contactPhone).toBe("030123456");
      expect(result.employer?.contactSalutation).toBe("Herr");
      expect(result.employer?.contact2Name).toBe("Second Contact");
      expect(result.employer?.contact2Email).toBe("second@techcorp.com");
      expect(result.employer?.verified).toBe(false);
    });

    it("should use betriebApEmail as fallback for contact email", () => {
      const formData: Partial<StudentData> = {
        betriebName: "Company",
        betriebApEmail: "contact@company.com",
      };

      const result = mapFormDataToModel(formData);

      expect(result.employer?.contactEmail).toBe("contact@company.com");
    });

    it("should map contact persons", () => {
      const formData: Partial<StudentData> = {
        ansprechpartner1Art: "mother",
        ansprechpartner1Vorname: "Maria",
        ansprechpartner1Nachname: "Mustermann",
        ansprechpartner1Mobil: "0171111111",
        ansprechpartner1Straße: "Elternstr",
        ansprechpartner1HausNr: "5",
        ansprechpartner1Plz: "12345",
        ansprechpartner1Ort: "Berlin",
        ansprechpartner2Art: "father",
        ansprechpartner2Vorname: "Peter",
        ansprechpartner2Nachname: "Mustermann",
        ansprechpartner2Telefon1: "0302222222",
      };

      const result = mapFormDataToModel(formData);

      expect(result.contactPersons).toHaveLength(2);
      expect(result.contactPersons?.[0].type).toBe("mother");
      expect(result.contactPersons?.[0].firstName).toBe("Maria");
      expect(result.contactPersons?.[0].lastName).toBe("Mustermann");
      expect(result.contactPersons?.[0].mobile).toBe("0171111111");
      expect(result.contactPersons?.[0].address.street).toBe("Elternstr 5");
      expect(result.contactPersons?.[1].type).toBe("father");
      expect(result.contactPersons?.[1].firstName).toBe("Peter");
    });

    it("should handle contact person with only first name", () => {
      const formData: Partial<StudentData> = {
        ansprechpartner1Vorname: "Maria",
      };

      const result = mapFormDataToModel(formData);

      expect(result.contactPersons).toHaveLength(1);
      expect(result.contactPersons?.[0].type).toBe("parent");
      expect(result.contactPersons?.[0].firstName).toBe("Maria");
    });

    it("should handle contact person with only last name", () => {
      const formData: Partial<StudentData> = {
        ansprechpartner1Nachname: "Mustermann",
      };

      const result = mapFormDataToModel(formData);

      expect(result.contactPersons).toHaveLength(1);
      expect(result.contactPersons?.[0].lastName).toBe("Mustermann");
    });

    it("should use phone from Telefon1 if Mobil not provided", () => {
      const formData: Partial<StudentData> = {
        ansprechpartner1Vorname: "Maria",
        ansprechpartner1Telefon1: "030123456",
      };

      const result = mapFormDataToModel(formData);

      expect(result.contactPersons?.[0].phone).toBe("030123456");
    });

    it("should respect maxContactPersons parameter", () => {
      const formData: Partial<StudentData> = {
        ansprechpartner1Vorname: "Maria",
        ansprechpartner2Vorname: "Peter",
        ansprechpartner3Vorname: "Anna",
      };

      const result = mapFormDataToModel(formData, 2);

      expect(result.contactPersons).toHaveLength(2);
    });

    it("should map agreements", () => {
      const formData: Partial<StudentData> = {
        datenschutz: true,
        teilnahmeunterricht: true,
        schulordnung: false,
        personenabbildung: true,
        teamsnutzung: true,
      };

      const result = mapFormDataToModel(formData);

      expect(result.agreements).toBeDefined();
      expect(result.agreements?.dataProtection).toBe(true);
      expect(result.agreements?.classParticipation).toBe(true);
      expect(result.agreements?.schoolRules).toBe(false);
      expect(result.agreements?.imageRights).toBe(true);
      expect(result.agreements?.teamsUsage).toBe(true);
    });

    it("should not include agreements if none provided", () => {
      const formData: Partial<StudentData> = {
        vorname: "Max",
      };

      const result = mapFormDataToModel(formData);

      expect(result.agreements).toBeUndefined();
    });

    it("should handle empty form data", () => {
      const result = mapFormDataToModel({});
      expect(result).toEqual({});
    });
  });

  describe("mapModelToFormData", () => {
    const createMockStudent = (
      overrides: Partial<Student> = {},
    ): Partial<Student> => ({
      firstName: "Max",
      lastName: "Mustermann",
      birthName: "Schmidt",
      dateOfBirth: new Date("2000-01-15"),
      gender: "male",
      birthplace: "Berlin",
      birthCountry: "DE",
      religion: "none",
      nationality: "German",
      secondNationality: "French",
      familyLanguage: "German",
      immigrationYear: 2015,
      email: "max@example.com",
      phone: "0171234567",
      address: {
        street: "Hauptstraße 123",
        city: "Berlin",
        zip: "12345",
        state: "Berlin",
        country: "DE",
        timezone: "Europe/Berlin",
      },
      ...overrides,
    });

    it("should map basic personal info", () => {
      const student = createMockStudent();
      const result = mapModelToFormData(student);

      expect(result.vorname).toBe("Max");
      expect(result.nachname).toBe("Mustermann");
      expect(result.geburtsname).toBe("Schmidt");
    });

    it("should map date of birth to German format", () => {
      const student = createMockStudent();
      const result = mapModelToFormData(student);

      expect(result.geburtsdatum).toBeDefined();
    });

    it("should map gender from English to German", () => {
      const maleStudent = createMockStudent({ gender: "male" });
      const femaleStudent = createMockStudent({ gender: "female" });
      const diverseStudent = createMockStudent({ gender: "diverse" });

      expect(mapModelToFormData(maleStudent).geschlecht).toBe("männlich");
      expect(mapModelToFormData(femaleStudent).geschlecht).toBe("weiblich");
      expect(mapModelToFormData(diverseStudent).geschlecht).toBe("divers");
    });

    it("should pass through unknown gender values", () => {
      const student = createMockStudent({ gender: "other" as "male" });
      const result = mapModelToFormData(student);

      expect(result.geschlecht).toBe("other");
    });

    it("should map origin fields", () => {
      const student = createMockStudent();
      const result = mapModelToFormData(student);

      expect(result.geburtsort).toBe("Berlin");
      expect(result.geburtsland).toBe("DE");
      expect(result.religion).toBe("none");
      expect(result.staatsangehoerigkeit1).toBe("German");
      expect(result.staatsangehoerigkeit2).toBe("French");
      expect(result.familiensprache).toBe("German");
      expect(result.zuzugsjahr).toBe("2015");
    });

    it("should map contact fields", () => {
      const student = createMockStudent();
      const result = mapModelToFormData(student);

      expect(result.email).toBe("max@example.com");
      expect(result.mobil).toBe("0171234567");
    });

    it("should parse address into separate fields", () => {
      const student = createMockStudent();
      const result = mapModelToFormData(student);

      expect(result.straße).toBe("Hauptstraße");
      expect(result.hausNr).toBe("123");
      expect(result.postleitzahl).toBe("12345");
      expect(result.ort).toBe("Berlin");
    });

    it("should handle address with empty street parts", () => {
      const student = createMockStudent({
        address: {
          street: "",
          city: "Berlin",
          zip: "12345",
          state: "",
          country: "DE",
          timezone: "Europe/Berlin",
        },
      });

      const result = mapModelToFormData(student);

      expect(result.straße).toBe("");
      expect(result.hausNr).toBe("");
    });

    it("should map education fields", () => {
      const student = createMockStudent({
        schoolEntryDate: new Date("2020-09-01"),
        currentClassName: "10A",
        previousSchool: "High School",
        previousSchoolType: "gymnasium",
        previousSchoolLevel: "10",
        degrees: ["abitur"],
      });

      const result = mapModelToFormData(student);

      expect(result.eintrittschule).toBeDefined();
      expect(result.klassenname).toBe("10A");
      expect(result.vorhergehendeSchule).toBe("High School");
      expect(result.vorhergehendeSchulform).toBe("gymnasium");
      expect(result.vorhergehendeStufe).toBe("10");
      expect(result.abschluesse).toEqual(["abitur"]);
    });

    it("should map profession and training fields", () => {
      const student = createMockStudent({
        profession: "Developer",
        trainingStartDate: new Date("2023-08-01"),
      });

      const result = mapModelToFormData(student);

      expect(result.beruf).toBe("Developer");
      expect(result.betriebEintritt).toBeDefined();
    });

    it("should map employer with parseable address", () => {
      const student = createMockStudent({
        employer: {
          companyName: "Tech Corp",
          address: "Business 1 10115 Berlin",
          contactName: "HR Manager",
          contactEmail: "hr@techcorp.com",
          contactPhone: "030123456",
          contactSalutation: "Herr",
          contact2Name: "Second Contact",
          contact2Email: "second@techcorp.com",
          contact2Phone: "030789012",
          contact2Salutation: "Frau",
          verified: true,
        },
      });

      const result = mapModelToFormData(student);

      expect(result.betriebName).toBe("Tech Corp");
      expect(result.betriebStraße).toBe("Business");
      expect(result.betriebHausNr).toBe("1");
      expect(result.betriebPlz).toBe("10115");
      expect(result.betriebOrt).toBe("Berlin");
      expect(result.betriebApName).toBe("HR Manager");
      expect(result.betriebEmail).toBe("hr@techcorp.com");
      expect(result.betriebTelefon1).toBe("030123456");
    });

    it("should handle employer with unparseable address", () => {
      const student = createMockStudent({
        employer: {
          companyName: "Tech Corp",
          address: "Some Address",
          contactName: "",
          contactEmail: "",
          contactPhone: "",
          contactSalutation: "",
          verified: false,
        },
      });

      const result = mapModelToFormData(student);

      expect(result.betriebStraße).toBe("Some Address");
      expect(result.betriebHausNr).toBe("");
      expect(result.betriebPlz).toBe("");
      expect(result.betriebOrt).toBe("");
    });

    it("should handle employer with no address", () => {
      const student = createMockStudent({
        employer: {
          companyName: "Tech Corp",
          address: "",
          contactName: "Manager",
          contactEmail: "manager@corp.com",
          contactPhone: "123456",
          contactSalutation: "Mr",
          verified: false,
        },
      });

      const result = mapModelToFormData(student);

      expect(result.betriebName).toBe("Tech Corp");
      expect(result.betriebApName).toBe("Manager");
    });

    it("should handle employer address with zip at start", () => {
      const student = createMockStudent({
        employer: {
          companyName: "Tech Corp",
          address: "12345 Some Street",
          contactName: "",
          contactEmail: "",
          contactPhone: "",
          contactSalutation: "",
          verified: false,
        },
      });

      const result = mapModelToFormData(student);

      // Zip at index 0 - falls back to putting all in street
      expect(result.betriebStraße).toBe("12345 Some Street");
    });

    it("should handle employer address with short parts", () => {
      const student = createMockStudent({
        employer: {
          companyName: "Tech Corp",
          address: "12345 Berlin",
          contactName: "",
          contactEmail: "",
          contactPhone: "",
          contactSalutation: "",
          verified: false,
        },
      });

      const result = mapModelToFormData(student);

      // Less than 4 parts - falls back to putting all in street
      expect(result.betriebStraße).toBe("12345 Berlin");
    });

    it("should map contact persons", () => {
      const student = createMockStudent({
        contactPersons: [
          {
            type: "mother",
            firstName: "Maria",
            lastName: "Mustermann",
            phone: "030123456",
            mobile: "0171111111",
            address: {
              street: "Elternstr 5",
              city: "Berlin",
              zip: "12345",
              state: "",
              country: "DE",
              timezone: "Europe/Berlin",
            },
          },
          {
            type: "father",
            firstName: "Peter",
            lastName: "Mustermann",
            phone: "030654321",
            mobile: "",
            address: undefined,
          },
        ],
      });

      const result = mapModelToFormData(student);

      expect(result.ansprechpartner1Art).toBe("mother");
      expect(result.ansprechpartner1Vorname).toBe("Maria");
      expect(result.ansprechpartner1Nachname).toBe("Mustermann");
      expect(result.ansprechpartner1Mobil).toBe("0171111111");
      expect(result.ansprechpartner1Telefon1).toBe("030123456");
      expect(result.ansprechpartner1Straße).toBe("Elternstr");
      expect(result.ansprechpartner1HausNr).toBe("5");
      expect(result.ansprechpartner2Art).toBe("father");
      expect(result.ansprechpartner2Vorname).toBe("Peter");
    });

    it("should respect maxContactPersons parameter", () => {
      const student = createMockStudent({
        contactPersons: [
          {
            type: "mother",
            firstName: "Maria",
            lastName: "M",
            phone: "",
            mobile: "",
          },
          {
            type: "father",
            firstName: "Peter",
            lastName: "M",
            phone: "",
            mobile: "",
          },
          {
            type: "guardian",
            firstName: "Anna",
            lastName: "M",
            phone: "",
            mobile: "",
          },
        ],
      });

      const result = mapModelToFormData(student, 2);

      expect(result.ansprechpartner1Vorname).toBe("Maria");
      expect(result.ansprechpartner2Vorname).toBe("Peter");
      expect(result.ansprechpartner3Vorname).toBeUndefined();
    });

    it("should map agreements", () => {
      const student = createMockStudent({
        agreements: {
          dataProtection: true,
          classParticipation: true,
          schoolRules: false,
          imageRights: true,
          teamsUsage: true,
        },
      });

      const result = mapModelToFormData(student);

      expect(result.datenschutz).toBe(true);
      expect(result.teilnahmeunterricht).toBe(true);
      expect(result.schulordnung).toBe(false);
      expect(result.personenabbildung).toBe(true);
      expect(result.teamsnutzung).toBe(true);
    });

    it("should map agreements with undefined values to false", () => {
      const student = createMockStudent({
        agreements: {
          dataProtection: undefined,
          classParticipation: undefined,
          schoolRules: undefined,
          imageRights: undefined,
          teamsUsage: undefined,
        } as Student["agreements"],
      });

      const result = mapModelToFormData(student);

      expect(result.datenschutz).toBe(false);
      expect(result.teilnahmeunterricht).toBe(false);
      expect(result.schulordnung).toBe(false);
      expect(result.personenabbildung).toBe(false);
      expect(result.teamsnutzung).toBe(false);
    });

    it("should handle empty student data", () => {
      const result = mapModelToFormData({});
      expect(result).toEqual({});
    });

    it("should handle contact person with empty address street", () => {
      const student = createMockStudent({
        contactPersons: [
          {
            type: "mother",
            firstName: "Maria",
            lastName: "M",
            phone: "",
            mobile: "",
            address: {
              street: "",
              city: "",
              zip: "",
              state: "",
              country: "DE",
              timezone: "Europe/Berlin",
            },
          },
        ],
      });

      const result = mapModelToFormData(student);

      expect(result.ansprechpartner1Straße).toBe("");
      expect(result.ansprechpartner1HausNr).toBe("");
    });
  });

  describe("validateOnboardingData", () => {
    const createValidStudent = (): Partial<Student> => ({
      firstName: "Max",
      lastName: "Mustermann",
      dateOfBirth: new Date("2000-01-15"),
      gender: "male",
      birthplace: "Berlin",
      birthCountry: "DE",
      nationality: "German",
      email: "max@example.com",
      address: {
        street: "Hauptstraße 123",
        city: "Berlin",
        zip: "12345",
        state: "Berlin",
        country: "DE",
        timezone: "Europe/Berlin",
      },
    });

    it("should return empty array for valid student", () => {
      const student = createValidStudent();
      const result = validateOnboardingData(student);

      expect(result).toEqual([]);
    });

    it("should detect missing firstName", () => {
      const student = createValidStudent();
      delete student.firstName;

      const result = validateOnboardingData(student);

      expect(result).toContain("firstName");
    });

    it("should detect missing lastName", () => {
      const student = createValidStudent();
      delete student.lastName;

      const result = validateOnboardingData(student);

      expect(result).toContain("lastName");
    });

    it("should detect missing dateOfBirth", () => {
      const student = createValidStudent();
      delete student.dateOfBirth;

      const result = validateOnboardingData(student);

      expect(result).toContain("dateOfBirth");
    });

    it("should detect missing gender", () => {
      const student = createValidStudent();
      delete student.gender;

      const result = validateOnboardingData(student);

      expect(result).toContain("gender");
    });

    it("should detect missing birthplace", () => {
      const student = createValidStudent();
      delete student.birthplace;

      const result = validateOnboardingData(student);

      expect(result).toContain("birthplace");
    });

    it("should detect missing birthCountry", () => {
      const student = createValidStudent();
      delete student.birthCountry;

      const result = validateOnboardingData(student);

      expect(result).toContain("birthCountry");
    });

    it("should detect missing nationality", () => {
      const student = createValidStudent();
      delete student.nationality;

      const result = validateOnboardingData(student);

      expect(result).toContain("nationality");
    });

    it("should detect missing email", () => {
      const student = createValidStudent();
      delete student.email;

      const result = validateOnboardingData(student);

      expect(result).toContain("email");
    });

    it("should detect missing address", () => {
      const student = createValidStudent();
      delete student.address;

      const result = validateOnboardingData(student);

      expect(result).toContain("address");
    });

    it("should detect missing address.street", () => {
      const student = createValidStudent();
      if (student.address) {
        student.address.street = "";
      }

      const result = validateOnboardingData(student);

      expect(result).toContain("address.street");
    });

    it("should detect missing address.city", () => {
      const student = createValidStudent();
      if (student.address) {
        student.address.city = "";
      }

      const result = validateOnboardingData(student);

      expect(result).toContain("address.city");
    });

    it("should detect missing address.zip", () => {
      const student = createValidStudent();
      if (student.address) {
        student.address.zip = "";
      }

      const result = validateOnboardingData(student);

      expect(result).toContain("address.zip");
    });

    it("should detect multiple missing fields", () => {
      const student: Partial<Student> = {};
      const result = validateOnboardingData(student);

      expect(result).toContain("firstName");
      expect(result).toContain("lastName");
      expect(result).toContain("dateOfBirth");
      expect(result).toContain("gender");
      expect(result).toContain("birthplace");
      expect(result).toContain("birthCountry");
      expect(result).toContain("nationality");
      expect(result).toContain("email");
      expect(result).toContain("address");
    });
  });
});
