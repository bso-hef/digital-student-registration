import StudentModel from "@/models/Student";
import { describe, expect, it } from "vitest";

import { mapFormDataToModel, mapModelToFormData } from "./studentDataMapper";

describe("student contact data mapping", () => {
  it("maps mobile and landline to separate model fields", () => {
    expect(
      mapFormDataToModel({
        mobil: "+49 170 1234567",
        telefon1: "+49 30 123456",
      }),
    ).toMatchObject({
      mobile: "+49 170 1234567",
      phone: "+49 30 123456",
    });
  });

  it("maps separate model fields back to the onboarding form", () => {
    expect(
      mapModelToFormData({
        mobile: "+49 170 1234567",
        phone: "+49 30 123456",
      }),
    ).toMatchObject({
      mobil: "+49 170 1234567",
      telefon1: "+49 30 123456",
    });
  });

  it("does not display a landline as a mobile number after reload", () => {
    expect(
      mapModelToFormData({
        phone: "+49 30 123456",
      }),
    ).toMatchObject({
      telefon1: "+49 30 123456",
    });

    expect(
      mapModelToFormData({
        phone: "+49 30 123456",
      }).mobil,
    ).toBeUndefined();
  });

  it("includes mobile in the compiled Mongoose schema", () => {
    expect(StudentModel.schema.path("mobile")).toBeDefined();

    const student = new StudentModel({
      firstName: "Max",
      lastName: "Muster",
      dateOfBirth: new Date("2000-01-01"),
      firstNameNorm: "max",
      lastNameNorm: "muster",
      mobile: "+49 170 1234567",
    });

    expect(student.toObject().mobile).toBe("+49 170 1234567");
  });
});
