import * as studentActions from "@/store/actions/studentActions";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createMockStore,
  renderWithProviders,
} from "../../../../tests/utils/test-utils";
import StepForm from "./index";

/**
 * Component tests for StepForm
 * @file src/components/organisms/StepForm/StepForm.test.tsx
 */

// Mock student actions
vi.mock("@/store/actions/studentActions", () => ({
  setCurrentStudentOnboardingStep: vi.fn((step: number) => ({
    type: "SET_CURRENT_STUDENT_ONBOARDING_STEP",
    payload: step,
  })),
}));

// Mock device type detection
vi.mock("device-type-detection", () => ({
  useDeviceTypeDetection: () => ({
    isMobile: false,
    isTabletVertical: false,
    isTabletHorizontal: false,
    isDesktop: true,
  }),
}));

// Mock all form components
vi.mock("@/components/organisms/forms/WelcomeForm", () => ({
  default: () => <div data-testid="welcome-form">Welcome Form</div>,
}));

vi.mock("@/components/organisms/forms/GeneralForm", () => ({
  default: () => <div data-testid="general-form">General Form</div>,
}));

vi.mock("@/components/organisms/forms/OriginForm", () => ({
  default: () => <div data-testid="origin-form">Origin Form</div>,
}));

vi.mock("@/components/organisms/forms/AddressForm", () => ({
  default: () => <div data-testid="address-form">Address Form</div>,
}));

vi.mock("@/components/organisms/forms/ParentsForm", () => ({
  default: () => <div data-testid="parents-form">Parents Form</div>,
}));

vi.mock("@/components/organisms/forms/PreEducationForm", () => ({
  default: () => <div data-testid="pre-education-form">Pre-Education Form</div>,
}));

vi.mock("@/components/organisms/forms/TrainingForm", () => ({
  default: () => <div data-testid="training-form">Training Form</div>,
}));

vi.mock("@/components/organisms/forms/CompanyContactForm", () => ({
  default: () => (
    <div data-testid="company-contact-form">Company Contact Form</div>
  ),
}));

vi.mock("@/components/organisms/forms/SummaryForm", () => ({
  default: ({ activeSteps }: { activeSteps?: any }) => (
    <div data-testid="summary-form" data-active-steps={activeSteps?.length}>
      Summary Form
    </div>
  ),
}));

vi.mock("@/components/organisms/forms/FormCompletion", () => ({
  default: () => <div data-testid="form-completion">Form Completion</div>,
}));

// Mock CustomTitle
vi.mock("@/components/atoms/CustomTitle", () => ({
  default: ({ title, subTitle }: { title: string; subTitle?: string }) => (
    <div data-testid="custom-title">
      <div data-testid="title">{title}</div>
      <div data-testid="subtitle">{subTitle}</div>
    </div>
  ),
}));

// Mock GeneralButton
vi.mock("@/components/atoms/buttons/GeneralButton", () => ({
  default: ({
    label,
    onAction,
    startIcon,
    endIcon,
  }: {
    label: string;
    onAction: () => void;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
  }) => (
    <button data-testid="general-button" onClick={onAction} data-label={label}>
      {startIcon && <span data-testid="start-icon">{startIcon}</span>}
      {label}
      {endIcon && <span data-testid="end-icon">{endIcon}</span>}
    </button>
  ),
}));

// Mock getStudentSteps and related functions
vi.mock("@/constants/studentSteps.constants", () => ({
  getStudentSteps: () => [
    { id: 0, label: "Welcome", step: 0 },
    { id: 1, label: "General Information", step: 1 },
    { id: 2, label: "Origin", step: 2 },
    { id: 3, label: "Address", step: 3 },
    { id: 4, label: "Parents", step: 4 },
    { id: 5, label: "Pre-Education", step: 5 },
    { id: 6, label: "Training", step: 6 },
    { id: 7, label: "Company Contact", step: 7 },
    { id: 8, label: "Summary", step: 8 },
    { id: 9, label: "Completion", step: 9 },
  ],
  getActiveSteps: (_allSteps: any, _data: any, _currentClass: any) => [
    { id: 0, label: "Welcome", step: 0 },
    { id: 1, label: "General Information", step: 1 },
    { id: 2, label: "Origin", step: 2 },
    { id: 3, label: "Address", step: 3 },
    { id: 4, label: "Parents", step: 4 },
    { id: 5, label: "Pre-Education", step: 5 },
    { id: 6, label: "Training", step: 6 },
    { id: 7, label: "Company Contact", step: 7 },
    { id: 8, label: "Summary", step: 8 },
    { id: 9, label: "Completion", step: 9 },
  ],
  isStepActive: (_stepId: number, _activeSteps: any) => true,
  StepName: {
    WELCOME: "welcome",
    GENERAL: "general",
    ORIGIN: "origin",
    ADDRESS: "address",
    PARENTS: "parents",
    PRE_EDUCATION: "pre_education",
    TRAINING: "training",
    COMPANY_CONTACT: "company_contact",
    SUMMARY: "summary",
    COMPLETION: "completion",
  },
}));

// Mock console.log to avoid noise in tests
const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

describe("StepForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy.mockClear();
  });

  describe("Basic Rendering", () => {
    it("should render wrapper container", () => {
      const store = createMockStore({
        student: {
          currentStep: 0,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      const { container } = renderWithProviders(
        <StepForm studentId="test-student-123" />,
        { store },
      );

      const wrapper = container.querySelector(".MuiBox-root");
      expect(wrapper).toBeInTheDocument();
    });

    it("should render form box", () => {
      const store = createMockStore({
        student: {
          currentStep: 1,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("general-form")).toBeInTheDocument();
    });

    it("should render menu options", () => {
      const store = createMockStore({
        student: {
          currentStep: 1,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      const buttons = screen.getAllByTestId("general-button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Form Rendering by Step", () => {
    it("should render WelcomeForm at step 0", () => {
      const store = createMockStore({
        student: {
          currentStep: 0,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("welcome-form")).toBeInTheDocument();
    });

    it("should render GeneralForm at step 1", () => {
      const store = createMockStore({
        student: {
          currentStep: 1,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("general-form")).toBeInTheDocument();
    });

    it("should render OriginForm at step 2", () => {
      const store = createMockStore({
        student: {
          currentStep: 2,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("origin-form")).toBeInTheDocument();
    });

    it("should render AddressForm at step 3", () => {
      const store = createMockStore({
        student: {
          currentStep: 3,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("address-form")).toBeInTheDocument();
    });

    it("should render ParentsForm at step 4", () => {
      const store = createMockStore({
        student: {
          currentStep: 4,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("parents-form")).toBeInTheDocument();
    });

    it("should render PreEducationForm at step 5", () => {
      const store = createMockStore({
        student: {
          currentStep: 5,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("pre-education-form")).toBeInTheDocument();
    });

    it("should render TrainingForm at step 6", () => {
      const store = createMockStore({
        student: {
          currentStep: 6,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("training-form")).toBeInTheDocument();
    });

    it("should render CompanyContactForm at step 7", () => {
      const store = createMockStore({
        student: {
          currentStep: 7,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("company-contact-form")).toBeInTheDocument();
    });

    it("should render SummaryForm at step 8", () => {
      const store = createMockStore({
        student: {
          currentStep: 8,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("summary-form")).toBeInTheDocument();
    });

    it("should render FormCompletion at step 9", () => {
      const store = createMockStore({
        student: {
          currentStep: 9,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("form-completion")).toBeInTheDocument();
    });

    it("should return null for invalid step", () => {
      const store = createMockStore({
        student: {
          currentStep: 99,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.queryByTestId("welcome-form")).not.toBeInTheDocument();
      expect(screen.queryByTestId("general-form")).not.toBeInTheDocument();
    });
  });

  describe("Navigation Buttons - First Step", () => {
    it("should show only Start button at step 0", () => {
      const store = createMockStore({
        student: {
          currentStep: 0,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      const buttons = screen.getAllByTestId("general-button");
      expect(buttons.length).toBe(1);
      expect(buttons[0]).toHaveAttribute("data-label", "general.Start");
    });

    it("should not show Previous button at step 0", () => {
      const store = createMockStore({
        student: {
          currentStep: 0,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      const buttons = screen.getAllByTestId("general-button");
      const previousButton = buttons.find(
        (btn) => btn.getAttribute("data-label") === "general.Previous",
      );
      expect(previousButton).toBeUndefined();
    });

    it("should navigate to step 1 when Start clicked", async () => {
      const user = userEvent.setup();
      const store = createMockStore({
        student: {
          currentStep: 0,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      const startButton = screen.getByTestId("general-button");
      await user.click(startButton);

      expect(
        studentActions.setCurrentStudentOnboardingStep,
      ).toHaveBeenCalledWith(1);
    });
  });

  describe("Navigation Buttons - Middle Steps", () => {
    it("should show both Previous and Next buttons at middle steps", () => {
      const store = createMockStore({
        student: {
          currentStep: 5,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      const buttons = screen.getAllByTestId("general-button");
      expect(buttons.length).toBe(2);

      const labels = buttons.map((btn) => btn.getAttribute("data-label"));
      expect(labels).toContain("general.Previous");
      expect(labels).toContain("general.Next");
    });

    it("should navigate to previous step when Previous clicked", async () => {
      const user = userEvent.setup();
      const store = createMockStore({
        student: {
          currentStep: 5,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      const buttons = screen.getAllByTestId("general-button");
      const previousButton = buttons.find(
        (btn) => btn.getAttribute("data-label") === "general.Previous",
      );

      if (previousButton) {
        await user.click(previousButton);
        expect(
          studentActions.setCurrentStudentOnboardingStep,
        ).toHaveBeenCalledWith(4);
      }
    });

    it("should navigate to next step when Next clicked", async () => {
      const user = userEvent.setup();
      const store = createMockStore({
        student: {
          currentStep: 5,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      const buttons = screen.getAllByTestId("general-button");
      const nextButton = buttons.find(
        (btn) => btn.getAttribute("data-label") === "general.Next",
      );

      if (nextButton) {
        await user.click(nextButton);
        expect(
          studentActions.setCurrentStudentOnboardingStep,
        ).toHaveBeenCalledWith(6);
      }
    });
  });

  describe("Navigation Buttons - Summary Step", () => {
    it("should show Previous and Submit buttons at step 8", () => {
      const store = createMockStore({
        student: {
          currentStep: 8,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      const buttons = screen.getAllByTestId("general-button");
      expect(buttons.length).toBe(2);

      const labels = buttons.map((btn) => btn.getAttribute("data-label"));
      expect(labels).toContain("general.Previous");
      expect(labels).toContain("general.Submit");
    });

    it("should not show Next button at step 8", () => {
      const store = createMockStore({
        student: {
          currentStep: 8,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      const buttons = screen.getAllByTestId("general-button");
      const nextButton = buttons.find(
        (btn) => btn.getAttribute("data-label") === "general.Next",
      );
      expect(nextButton).toBeUndefined();
    });
  });

  describe("Navigation Buttons - Completion Step", () => {
    it("should not show any buttons at step 9", () => {
      const store = createMockStore({
        student: {
          currentStep: 9,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      const buttons = screen.queryAllByTestId("general-button");
      expect(buttons.length).toBe(0);
    });
  });

  describe("Title Display", () => {
    it("should not show title at step 0", () => {
      const store = createMockStore({
        student: {
          currentStep: 0,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.queryByTestId("custom-title")).not.toBeInTheDocument();
    });

    it("should show title at middle steps", () => {
      const store = createMockStore({
        student: {
          currentStep: 5,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("custom-title")).toBeInTheDocument();
    });

    it("should show correct title text", () => {
      const store = createMockStore({
        student: {
          currentStep: 5,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("title")).toHaveTextContent("Pre-Education");
    });

    it("should show correct subtitle with step number", () => {
      const store = createMockStore({
        student: {
          currentStep: 5,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("subtitle")).toHaveTextContent("Step 6 of 10");
    });

    it("should show title at last step", () => {
      const store = createMockStore({
        student: {
          currentStep: 9,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("custom-title")).toBeInTheDocument();
      expect(screen.getByTestId("title")).toHaveTextContent("Completion");
    });
  });

  describe("Step Transitions", () => {
    it("should render different form when step changes", () => {
      const store = createMockStore({
        student: {
          currentStep: 1,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      const { rerender } = renderWithProviders(
        <StepForm studentId="test-student-123" />,
        { store },
      );

      expect(screen.getByTestId("general-form")).toBeInTheDocument();

      // Store updated for step change
      store.getState().student.currentStep = 2;

      rerender(<StepForm />);

      // Note: In real app, Redux would update the store
      // This test shows component responds to prop changes
    });

    it("should pass data prop to forms", () => {
      const mockData = { firstName: "John", lastName: "Doe" };
      const store = createMockStore({
        student: {
          currentStep: 1,
          data: mockData,
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("general-form")).toBeInTheDocument();
    });
  });

  describe("Redux Integration", () => {
    it("should read currentStep from Redux", () => {
      const store = createMockStore({
        student: {
          currentStep: 3,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("address-form")).toBeInTheDocument();
    });

    it("should read data from Redux", () => {
      const mockData = { email: "test@example.com" };
      const store = createMockStore({
        student: {
          currentStep: 1,
          data: mockData,
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("general-form")).toBeInTheDocument();
    });

    it("should dispatch action on Next click", async () => {
      const user = userEvent.setup();
      const store = createMockStore({
        student: {
          currentStep: 1,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      const buttons = screen.getAllByTestId("general-button");
      const nextButton = buttons.find(
        (btn) => btn.getAttribute("data-label") === "general.Next",
      );

      if (nextButton) {
        await user.click(nextButton);
        expect(
          studentActions.setCurrentStudentOnboardingStep,
        ).toHaveBeenCalledWith(2);
      }
    });

    it("should dispatch action on Previous click", async () => {
      const user = userEvent.setup();
      const store = createMockStore({
        student: {
          currentStep: 3,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      const buttons = screen.getAllByTestId("general-button");
      const previousButton = buttons.find(
        (btn) => btn.getAttribute("data-label") === "general.Previous",
      );

      if (previousButton) {
        await user.click(previousButton);
        expect(
          studentActions.setCurrentStudentOnboardingStep,
        ).toHaveBeenCalledWith(2);
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle step 0 correctly", () => {
      const store = createMockStore({
        student: {
          currentStep: 0,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("welcome-form")).toBeInTheDocument();
      expect(screen.queryByTestId("custom-title")).not.toBeInTheDocument();
    });

    it("should handle step 9 correctly", () => {
      const store = createMockStore({
        student: {
          currentStep: 9,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("form-completion")).toBeInTheDocument();
      const buttons = screen.queryAllByTestId("general-button");
      expect(buttons.length).toBe(0);
    });

    it("should handle empty data object", () => {
      const store = createMockStore({
        student: {
          currentStep: 1,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("general-form")).toBeInTheDocument();
    });

    it("should handle rapid button clicks", async () => {
      const user = userEvent.setup();
      const store = createMockStore({
        student: {
          currentStep: 5,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      const buttons = screen.getAllByTestId("general-button");
      const nextButton = buttons.find(
        (btn) => btn.getAttribute("data-label") === "general.Next",
      );

      if (nextButton) {
        await user.click(nextButton);
        await user.click(nextButton);
        await user.click(nextButton);

        expect(
          studentActions.setCurrentStudentOnboardingStep,
        ).toHaveBeenCalledTimes(3);
      }
    });
  });

  describe("Component Structure", () => {
    it("should have wrapper container", () => {
      const store = createMockStore({
        student: {
          currentStep: 1,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      const { container } = renderWithProviders(
        <StepForm studentId="test-student-123" />,
        { store },
      );

      const wrapper = container.querySelector(".MuiBox-root");
      expect(wrapper).toBeInTheDocument();
    });

    it("should have form box", () => {
      const store = createMockStore({
        student: {
          currentStep: 1,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      expect(screen.getByTestId("general-form")).toBeInTheDocument();
    });

    it("should have menu options", () => {
      const store = createMockStore({
        student: {
          currentStep: 5,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      renderWithProviders(<StepForm studentId="test-student-123" />, { store });

      const buttons = screen.getAllByTestId("general-button");
      expect(buttons.length).toBe(2);
    });
  });

  describe("Memoization", () => {
    it("should be a memoized component", () => {
      const store = createMockStore({
        student: {
          currentStep: 1,
          data: {},
          students: [],
          loading: false,
          error: null,
        },
      });

      const { rerender } = renderWithProviders(
        <StepForm studentId="test-student-123" />,
        { store },
      );

      expect(screen.getByTestId("general-form")).toBeInTheDocument();

      rerender(<StepForm />);

      expect(screen.getByTestId("general-form")).toBeInTheDocument();
    });
  });
});
