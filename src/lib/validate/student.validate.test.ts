import { describe, expect, it } from "vitest";

import {
  createValidateGeneralStudentData,
  validateGeneralStudentData,
} from "./student.validate";

describe("general student data class validation", () => {
  it("requires a class in the static schema", async () => {
    await expect(
      validateGeneralStudentData.validateAt("currentClass", {
        currentClass: "",
      }),
    ).rejects.toThrow("Klasse ist erforderlich");
  });

  it("requires a class in the dynamic onboarding schema", async () => {
    const schema = createValidateGeneralStudentData([], [], []);

    await expect(
      schema.validateAt("currentClass", { currentClass: "" }),
    ).rejects.toThrow("Klasse ist erforderlich");
    await expect(
      schema.validateAt("currentClass", { currentClass: "class-id" }),
    ).resolves.toBe("class-id");
  });
});
