"use client";

import { memo, useMemo, useRef, useState } from "react";

import CustomTitle from "@/components/atoms/CustomTitle";
import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import AddressForm from "@/components/organisms/forms/AddressForm";
import AgreementsForm from "@/components/organisms/forms/AgreementsForm";
import CompanyContactForm from "@/components/organisms/forms/CompanyContactForm";
import FormCompletion from "@/components/organisms/forms/FormCompletion";
import GeneralForm from "@/components/organisms/forms/GeneralForm";
import OriginForm from "@/components/organisms/forms/OriginForm";
import ParentsForm from "@/components/organisms/forms/ParentsForm";
import PreEducationForm from "@/components/organisms/forms/PreEducationForm";
import SummaryForm from "@/components/organisms/forms/SummaryForm";
import TrainingForm from "@/components/organisms/forms/TrainingForm";
import WelcomeForm from "@/components/organisms/forms/WelcomeForm";
import {
  getActiveSteps,
  getStudentSteps,
  isStepActive,
} from "@/constants/studentSteps.constants";
import {
  saveOnboardingProgress,
  setCurrentStudentOnboardingStep,
  submitOnboarding,
} from "@/store/actions/studentActions";
import { AppDispatch } from "@/store/store";
import { applicationScrollbar } from "@/utils/styling.utils";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { Box, CircularProgress, styled } from "@mui/material";
import { FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/reducers";

const Wrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
  gap: "32px",
}));

const StyledMenuOptions = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  maxWidth: "1200px",
  gap: theme.spacing(2),
}));

const StyledFormBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
  height: "auto",
  maxHeight: "calc(100vh - 400px)",
  overflowY: "auto",
  overflowX: "hidden",
  padding: theme.spacing(2, 1),
  ...applicationScrollbar(theme),
}));

interface StepFormProps {
  studentId: string;
}

const StepForm = ({ studentId }: StepFormProps) => {
  const { currentStep, previousStep, data, loading, currentClass } =
    useSelector((state: RootState) => state.student);
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmationChecked, setIsConfirmationChecked] = useState(false);

  // Ref to access Formik instance of current form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formikRef = useRef<FormikProps<any> | null>(null);

  const allSteps = getStudentSteps(t);

  // Calculate active steps based on student data and class
  // This will recalculate in real-time when data.geburtsland or currentClass.isVocational changes
  const activeSteps = useMemo(() => {
    return getActiveSteps(allSteps, data, currentClass);
  }, [allSteps, data, currentClass]);

  // Find current step definition from all steps (not active steps)
  const currentStepDef = allSteps[currentStep];

  // Find the index of current step in active steps array (for step counter)
  const activeStepIndex = activeSteps.findIndex(
    (step) => step.id === currentStep,
  );

  // Helper to save just the step number (called during navigation)
  const saveStepOnly = async (step: number) => {
    if (studentId && step > 0 && step < 9) {
      try {
        await dispatch(saveOnboardingProgress(studentId, {}, step));
      } catch (error) {
        console.error("Failed to save step:", error);
      }
    }
  };

  // Auto-save handler
  const handleAutoSave = async (formValues?: unknown) => {
    if (!studentId || currentStep === 0 || currentStep === 9) {
      // Skip auto-save for welcome and completion screens
      return;
    }

    setIsSaving(true);
    try {
      // Merge form values with current Redux data to ensure latest values are saved
      // This prevents race conditions where Redux state hasn't updated yet
      const dataToSave = formValues ? { ...data, ...formValues } : data;

      // Save form data and current step to database
      await dispatch(
        saveOnboardingProgress(studentId, dataToSave, currentStep),
      );
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Get next active step ID
  const getNextActiveStepId = () => {
    const currentIndex = activeSteps.findIndex(
      (step) => step.id === currentStep,
    );
    if (currentIndex < activeSteps.length - 1) {
      return activeSteps[currentIndex + 1].id;
    }
    return currentStep; // Stay on current if no next
  };

  // Get previous active step ID
  const getPreviousActiveStepId = () => {
    const currentIndex = activeSteps.findIndex(
      (step) => step.id === currentStep,
    );
    if (currentIndex > 0) {
      return activeSteps[currentIndex - 1].id;
    }
    return currentStep; // Stay on current if no previous
  };

  // Validate that user can navigate to target step
  // User can only navigate to next step or previous steps
  const canNavigateToStep = (targetStep: number): boolean => {
    // Can always go back to previous steps
    if (targetStep <= currentStep) {
      return true;
    }

    // Can only advance one step at a time
    // This ensures sequential completion
    const nextStepId = getNextActiveStepId();
    return targetStep === nextStepId;
  };

  /**
   * Safe navigation function that validates step is active before navigating
   * Used by SummaryForm edit buttons to prevent navigation to hidden steps
   * @param targetStepId - The step ID to navigate to
   */
  const navigateToStepSafely = (targetStepId: number) => {
    // Check if the target step is in the active steps array
    if (!isStepActive(targetStepId, activeSteps)) {
      console.warn(
        `Cannot navigate to step ${targetStepId}: step is not active`,
      );
      return;
    }

    // Additional validation: can only go to previous steps or next step
    if (!canNavigateToStep(targetStepId)) {
      console.warn(
        `Cannot navigate to step ${targetStepId}: navigation validation failed`,
      );
      return;
    }

    // Navigation is valid, dispatch the action
    dispatch(setCurrentStudentOnboardingStep(targetStepId));
    // Save step to database for page reload persistence
    saveStepOnly(targetStepId);
  };

  // Form submit handler passed to forms
  const handleFormSubmit = async (formValues?: unknown) => {
    setIsSubmitting(true);
    try {
      // Auto-save current data, passing form values to avoid race condition
      await handleAutoSave(formValues);
      // Move to next active step
      const nextStepId = getNextActiveStepId();

      // Validate navigation
      if (!canNavigateToStep(nextStepId)) {
        console.error("Cannot skip to step", nextStepId);
        return;
      }

      dispatch(setCurrentStudentOnboardingStep(nextStepId));
      // Save step to database for page reload persistence
      saveStepOnly(nextStepId);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Next button click for form steps
  const handleNextClick = async () => {
    if (formikRef.current) {
      // Trigger Formik validation and submission
      await formikRef.current.submitForm();
    }
  };

  // Callback to receive validation state from forms
  const handleValidationChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

  // Callback to receive confirmation state from SummaryForm
  const handleConfirmationChange = (isConfirmed: boolean) => {
    setIsConfirmationChecked(isConfirmed);
  };

  function renderFormByStep(step: number) {
    switch (step) {
      case 0:
        return <WelcomeForm />;
      case 1:
        return (
          <GeneralForm
            onSubmit={handleFormSubmit}
            formikRef={formikRef}
            onValidationChange={handleValidationChange}
          />
        );
      case 2:
        return (
          <OriginForm
            onSubmit={handleFormSubmit}
            formikRef={formikRef}
            onValidationChange={handleValidationChange}
          />
        );
      case 3:
        return (
          <AddressForm
            onSubmit={handleFormSubmit}
            formikRef={formikRef}
            onValidationChange={handleValidationChange}
          />
        );
      case 4:
        return (
          <ParentsForm
            onSubmit={handleFormSubmit}
            formikRef={formikRef}
            onValidationChange={handleValidationChange}
          />
        );
      case 5:
        return (
          <PreEducationForm
            onSubmit={handleFormSubmit}
            formikRef={formikRef}
            onValidationChange={handleValidationChange}
            currentClass={currentClass}
          />
        );
      case 6:
        return (
          <TrainingForm
            onSubmit={handleFormSubmit}
            formikRef={formikRef}
            onValidationChange={handleValidationChange}
          />
        );
      case 7:
        return (
          <CompanyContactForm
            onSubmit={handleFormSubmit}
            formikRef={formikRef}
            onValidationChange={handleValidationChange}
          />
        );
      case 8:
        return (
          <AgreementsForm
            onSubmit={handleFormSubmit}
            formikRef={formikRef}
            onValidationChange={handleValidationChange}
          />
        );
      case 9:
        return (
          <SummaryForm
            onGoToStep={navigateToStepSafely}
            activeSteps={activeSteps}
            onConfirmationChange={handleConfirmationChange}
          />
        );
      case 10:
        return <FormCompletion />;
      default:
        return null;
    }
  }

  const isFirstStep = currentStep === 0;
  const isSummaryStep = currentStep === 9;
  const isFormStep = currentStep >= 1 && currentStep <= 8; // Steps with forms

  const handleNextStep = () => {
    // Welcome screen - move to next active step
    const nextStepId = getNextActiveStepId();
    dispatch(setCurrentStudentOnboardingStep(nextStepId));
    // Save step to database for page reload persistence
    saveStepOnly(nextStepId);
  };

  const handlePreviousStep = () => {
    // Browser-like history: Use previousStep from Redux state if available
    // This ensures we go back to the actual previous step the user was on,
    // even if conditional steps were hidden/shown
    let targetStep: number;
    if (previousStep !== null && previousStep !== undefined) {
      // Validate that previousStep is an active step
      if (isStepActive(previousStep, activeSteps)) {
        targetStep = previousStep;
      } else {
        // Fallback: If previousStep is not active, use calculated previous active step
        targetStep = getPreviousActiveStepId();
      }
    } else {
      // Fallback: No history available, use calculated previous active step
      targetStep = getPreviousActiveStepId();
    }
    dispatch(setCurrentStudentOnboardingStep(targetStep));
    // Save step to database for page reload persistence
    saveStepOnly(targetStep);
  };

  const handleConfirm = async () => {
    // Final submission
    setIsSaving(true);
    try {
      await dispatch(submitOnboarding(studentId, data));
      // Move to completion screen
      dispatch(setCurrentStudentOnboardingStep(10));
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Wrapper>
      {!isFirstStep && (
        <CustomTitle
          title={currentStepDef?.label}
          subTitle={`${t("general.Step")} ${activeStepIndex + 1} ${t("general.of")} ${activeSteps.length}`}
        />
      )}
      <StyledFormBox>{renderFormByStep(currentStep)}</StyledFormBox>
      {/* Welcome step (Step 0) - Start button only */}
      {isFirstStep && (
        <GeneralButton
          label={t("general.Start")}
          isPrimary={true}
          endIcon={<KeyboardArrowRightRoundedIcon />}
          onAction={handleNextStep}
        />
      )}

      {/* Form steps (1-7) - Previous and Next buttons */}
      {isFormStep && (
        <StyledMenuOptions>
          <GeneralButton
            label={t("general.Previous")}
            isPrimary={false}
            fullHeight={false}
            fullWidth={false}
            startIcon={<KeyboardArrowLeftRoundedIcon />}
            onAction={handlePreviousStep}
            disabled={isSaving || loading || isSubmitting}
          />

          <GeneralButton
            label={
              isSubmitting || isSaving
                ? t("general.Submitting")
                : t("general.Next")
            }
            isPrimary={true}
            fullHeight={false}
            fullWidth={false}
            endIcon={
              isSubmitting || isSaving ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <KeyboardArrowRightRoundedIcon />
              )
            }
            onAction={handleNextClick}
            disabled={!isFormValid || isSaving || loading || isSubmitting}
          />
        </StyledMenuOptions>
      )}

      {/* Summary step (Step 8) - Previous and Submit buttons */}
      {isSummaryStep && (
        <StyledMenuOptions>
          <GeneralButton
            label={t("general.Previous")}
            isPrimary={false}
            fullHeight={false}
            fullWidth={false}
            startIcon={<KeyboardArrowLeftRoundedIcon />}
            onAction={handlePreviousStep}
            disabled={isSaving || loading}
          />

          <GeneralButton
            label={isSaving ? t("general.Submitting") : t("general.Submit")}
            isPrimary={true}
            fullHeight={false}
            fullWidth={false}
            startIcon={
              isSaving ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DoneRoundedIcon />
              )
            }
            onAction={handleConfirm}
            disabled={!isConfirmationChecked || isSaving || loading}
          />
        </StyledMenuOptions>
      )}
    </Wrapper>
  );
};

export default memo(StepForm);
