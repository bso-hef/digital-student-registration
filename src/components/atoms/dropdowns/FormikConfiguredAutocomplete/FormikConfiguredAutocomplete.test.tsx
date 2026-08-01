import React from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form, Formik } from "formik";
import { beforeEach, describe, expect, it, vi } from "vitest";

import FormikConfiguredAutocomplete from "./index";

const mocks = vi.hoisted(() => ({
  fieldConfig: {
    required: false,
    visible: true,
    allowCustom: true,
  },
}));

vi.mock("@/hooks/useOnboardingSettings", () => ({
  useOnboardingSettings: () => ({
    fieldConfigs: { abschluesse: mocks.fieldConfig },
  }),
}));

const options = [
  { value: "second", label: "Second", enabled: true, order: 1 },
  { value: "first", label: "First", enabled: true, order: 0 },
  { value: "disabled", label: "Disabled", enabled: false, order: 2 },
];

const renderField = () =>
  render(
    <Formik initialValues={{ testField: "" }} onSubmit={() => undefined}>
      {({ values }) => (
        <Form>
          <FormikConfiguredAutocomplete
            name="testField"
            fieldConfigKey="abschluesse"
            label="Configured field"
            options={options}
            emptyValue="None"
          />
          <output data-testid="value">{values.testField}</output>
        </Form>
      )}
    </Formik>,
  );

describe("FormikConfiguredAutocomplete", () => {
  beforeEach(() => {
    Object.assign(mocks.fieldConfig, {
      required: false,
      visible: true,
      allowCustom: true,
    });
  });

  it("commits custom input on blur", async () => {
    const user = userEvent.setup();
    renderField();

    const input = screen.getByRole("combobox", { name: "Configured field" });
    await user.type(input, "Custom qualification");
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByTestId("value")).toHaveTextContent(
        "Custom qualification",
      );
    });
  });

  it("offers custom input as a selectable option", async () => {
    const user = userEvent.setup();
    renderField();

    const input = screen.getByRole("combobox", { name: "Configured field" });
    await user.type(input, "Custom gender");

    expect(
      await screen.findByRole("option", { name: "Custom gender" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: "Custom gender" }));

    await waitFor(() => {
      expect(screen.getByTestId("value")).toHaveTextContent("Custom gender");
    });
  });

  it("uses the configured value when an option is selected", async () => {
    const user = userEvent.setup();
    renderField();

    const input = screen.getByRole("combobox", { name: "Configured field" });
    await user.click(input);
    await user.click(await screen.findByRole("option", { name: "First" }));

    await waitFor(() => {
      expect(screen.getByTestId("value")).toHaveTextContent("first");
    });
  });

  it("does not offer disabled backend options", async () => {
    const user = userEvent.setup();
    renderField();

    await user.click(
      screen.getByRole("combobox", { name: "Configured field" }),
    );

    expect(
      screen.queryByRole("option", { name: "Disabled" }),
    ).not.toBeInTheDocument();
  });

  it("reads visibility and required state from the field configuration", () => {
    mocks.fieldConfig.required = true;
    const { rerender } = renderField();

    expect(
      screen.getByRole("combobox", { name: /Configured field/ }),
    ).toBeRequired();

    mocks.fieldConfig.visible = false;
    rerender(
      <Formik initialValues={{ testField: "" }} onSubmit={() => undefined}>
        <Form>
          <FormikConfiguredAutocomplete
            name="testField"
            fieldConfigKey="abschluesse"
            label="Configured field"
            options={options}
          />
        </Form>
      </Formik>,
    );

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});
