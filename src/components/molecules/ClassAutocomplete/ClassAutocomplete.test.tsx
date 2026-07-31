import type { ClassInterface } from "@/types/class";
import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../../../../tests/utils/test-utils";
import ClassAutocomplete from "./index";

const createClass = (id: string, name: string): ClassInterface => ({
  _id: id,
  name,
  schoolYearFrom: null,
  schoolYearTo: null,
  grade: null,
  isVocational: false,
  requiresEmployerInfo: false,
  active: true,
  incomplete: false,
  students: [],
});

describe("ClassAutocomplete", () => {
  it("shows a populated current class even when it is not in the loaded options", () => {
    renderWithProviders(
      <ClassAutocomplete
        studentId="student-1"
        currentClass={{ _id: "class-1", name: "10 A" }}
        availableClasses={[]}
      />,
    );

    expect(screen.getByRole("combobox")).toHaveValue("10 A");
  });

  it("updates the class name when the class options finish loading", async () => {
    const currentClass = createClass("class-2", "11 B");
    const { rerender } = renderWithProviders(
      <ClassAutocomplete
        studentId="student-2"
        currentClass={currentClass._id}
        availableClasses={[]}
      />,
    );

    expect(screen.getByRole("combobox")).toHaveValue("");

    rerender(
      <ClassAutocomplete
        studentId="student-2"
        currentClass={currentClass._id}
        availableClasses={[currentClass]}
      />,
    );

    await waitFor(() =>
      expect(screen.getByRole("combobox")).toHaveValue("11 B"),
    );
  });

  it("uses the stored class name when no class reference exists", () => {
    renderWithProviders(
      <ClassAutocomplete
        studentId="student-3"
        currentClass={null}
        currentClassName="Importklasse"
        availableClasses={[]}
      />,
    );

    expect(screen.getByRole("combobox")).toHaveValue("Importklasse");
  });
});
