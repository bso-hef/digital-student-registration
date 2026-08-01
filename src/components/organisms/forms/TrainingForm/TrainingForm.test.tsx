import { createRef } from "react";

import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import type { ClassInterface } from "@/types/class";
import { act, screen, waitFor } from "@testing-library/react";
import type { FormikProps } from "formik";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createMockStore,
  renderWithProviders,
} from "../../../../../tests/utils/test-utils";
import TrainingForm from "./index";

vi.mock("@/hooks/useOnboardingSettings", () => ({
  useOnboardingSettings: vi.fn(),
}));

vi.mock("@/components/atoms/dropdowns/FormikDropdown", () => ({
  default: ({ required }: { required?: boolean }) => (
    <input
      data-testid="profession-dropdown"
      aria-label="onboarding.training.profession"
      required={required}
    />
  ),
}));

vi.mock("@mui/x-date-pickers/DatePicker", () => ({
  DatePicker: () => <div data-testid="company-start-date" />,
}));

const mockUseOnboardingSettings = vi.mocked(useOnboardingSettings);

const createClass = (isVocational: boolean): ClassInterface => ({
  _id: isVocational ? "vocational-class" : "general-class",
  schoolYearFrom: null,
  schoolYearTo: null,
  name: isVocational ? "Berufliche Klasse" : "Allgemeine Klasse",
  grade: null,
  isVocational,
  requiresEmployerInfo: false,
  active: true,
  incomplete: false,
  students: [],
});

const createStoreWithClass = (isVocational: boolean) => {
  const initialState = createMockStore().getState();

  return createMockStore({
    student: {
      ...initialState.student,
      currentClass: createClass(isVocational),
    },
  });
};

const mockSettings = (allowCustom: boolean) => {
  const professionOptions = allowCustom
    ? []
    : [
        {
          value: "Fachinformatiker",
          label: "Fachinformatiker",
          enabled: true,
          order: 1,
        },
      ];

  mockUseOnboardingSettings.mockReturnValue({
    professionOptions,
    fieldConfigs: {
      beruf: {
        allowCustom,
        required: false,
        visible: true,
      },
    },
    getOptionValues: vi.fn((options) => options.map((option) => option.value)),
    getEnabledOptions: vi.fn((options) => options),
    loading: false,
  } as ReturnType<typeof useOnboardingSettings>);
};

describe("TrainingForm", () => {
  beforeEach(() => {
    mockSettings(true);
  });

  it("should require the text profession field for vocational classes", () => {
    renderWithProviders(<TrainingForm />, {
      store: createStoreWithClass(true),
    });

    expect(
      screen.getByRole("textbox", {
        name: /onboarding\.training\.profession/,
      }),
    ).toBeRequired();
  });

  it("should not require the text profession field for non-vocational classes", () => {
    renderWithProviders(<TrainingForm />, {
      store: createStoreWithClass(false),
    });

    expect(
      screen.getByRole("textbox", {
        name: /onboarding\.training\.profession/,
      }),
    ).not.toBeRequired();
  });

  it("should use currentClassData when no class exists in Redux", () => {
    renderWithProviders(
      <TrainingForm data={{ currentClassData: createClass(true) }} />,
    );

    expect(
      screen.getByRole("textbox", {
        name: /onboarding\.training\.profession/,
      }),
    ).toBeRequired();
  });

  it("should require the profession dropdown for vocational classes", () => {
    mockSettings(false);

    renderWithProviders(<TrainingForm />, {
      store: createStoreWithClass(true),
    });

    expect(screen.getByTestId("profession-dropdown")).toBeRequired();
  });

  it("should not require the profession dropdown for non-vocational classes", () => {
    mockSettings(false);

    renderWithProviders(<TrainingForm />, {
      store: createStoreWithClass(false),
    });

    expect(screen.getByTestId("profession-dropdown")).not.toBeRequired();
  });

  it("should render the loading state", () => {
    mockUseOnboardingSettings.mockReturnValue({
      ...mockUseOnboardingSettings(),
      loading: true,
    });

    renderWithProviders(<TrainingForm />);

    expect(screen.getByText("Loading settings...")).toBeInTheDocument();
  });

  it("should report the current Formik validation state", async () => {
    const formikRef = createRef<FormikProps<never>>();
    const onValidationChange = vi.fn();

    renderWithProviders(
      <TrainingForm
        formikRef={formikRef}
        onValidationChange={onValidationChange}
      />,
      { store: createStoreWithClass(true) },
    );

    await waitFor(() => {
      expect(onValidationChange).toHaveBeenCalledWith(
        formikRef.current?.isValid,
      );
    });
  });

  it("should expose validation errors after all fields are touched", async () => {
    const formikRef = createRef<FormikProps<never>>();

    renderWithProviders(<TrainingForm formikRef={formikRef} />, {
      store: createStoreWithClass(true),
    });

    await act(async () => {
      await formikRef.current?.setTouched({
        beruf: true,
        betriebEintritt: true,
        betriebName: true,
        betriebStraße: true,
        betriebHausNr: true,
        betriebPlz: true,
        betriebOrt: true,
        betriebTelefon1: true,
        betriebEmail: true,
      });
    });

    expect(await screen.findByText("Beruf ist erforderlich")).toBeVisible();
    expect(
      screen.getByText("Name des Betriebs ist erforderlich"),
    ).toBeVisible();
  });

  it("should format and forward valid form values on submit", async () => {
    const formikRef = createRef<FormikProps<never>>();
    const onSubmit = vi.fn();

    renderWithProviders(
      <TrainingForm
        data={{
          beruf: "Fachinformatiker",
          betriebEintritt: "2026-08-01",
          betriebName: "Ausbildungsbetrieb GmbH",
          betriebStraße: "Musterstraße",
          betriebHausNr: "1",
          betriebPlz: "12345",
          betriebOrt: "Musterstadt",
          betriebTelefon1: "0123456789",
          betriebEmail: "ausbildung@example.com",
        }}
        formikRef={formikRef}
        onSubmit={onSubmit}
      />,
      { store: createStoreWithClass(true) },
    );

    await act(async () => {
      await formikRef.current?.submitForm();
    });

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          beruf: "Fachinformatiker",
          betriebEintritt: "2026-08-01",
        }),
      );
    });
  });
});
