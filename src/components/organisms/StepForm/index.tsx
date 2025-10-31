"use client";

import { memo, useMemo, useState } from "react";

import CustomTitle from "@/components/atoms/CustomTitle";
import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import AddressForm from "@/components/organisms/forms/AddressForm";
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
} from "@/constants/studentSteps.constants";
import {
  saveOnboardingProgress,
  setCurrentStudentOnboardingStep,
  submitOnboarding,
} from "@/store/actions/studentActions";
import { AppDispatch } from "@/store/store";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { Box, CircularProgress, styled } from "@mui/material";
import { useDeviceTypeDetection } from "device-type-detection";
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
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.divider,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: theme.palette.text.secondary,
  },
}));

interface StepFormProps {
  studentId: string;
}

const StepForm = ({ studentId }: StepFormProps) => {
  const { currentStep, data, loading, currentClass } = useSelector(
    (state: RootState) => state.student,
  );
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);

  const { isMobile, isTabletVertical } = useDeviceTypeDetection();

  const showMobileView = isMobile || isTabletVertical;

  const allSteps = getStudentSteps(t);

  // Calculate active steps based on student data and class
  const activeSteps = useMemo(() => {
    return getActiveSteps(allSteps, data, currentClass);
  }, [allSteps, data, currentClass]);

  // Find current step definition from all steps (not active steps)
  const currentStepDef = allSteps[currentStep];

  // Find the index of current step in active steps array (for step counter)
  const activeStepIndex = activeSteps.findIndex(
    (step) => step.id === currentStep,
  );

  // Auto-save handler
  const handleAutoSave = async () => {
    if (!studentId || currentStep === 0 || currentStep === 9) {
      // Skip auto-save for welcome and completion screens
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(saveOnboardingProgress(studentId, data));
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

  // Form submit handler passed to forms
  const handleFormSubmit = async () => {
    // Auto-save current data
    await handleAutoSave();
    // Move to next active step
    const nextStepId = getNextActiveStepId();
    dispatch(setCurrentStudentOnboardingStep(nextStepId));
  };

  function renderFormByStep(step: number) {
    switch (step) {
      case 0:
        return <WelcomeForm />;
      case 1:
        return <GeneralForm onSubmit={handleFormSubmit} />;
      case 2:
        return <OriginForm onSubmit={handleFormSubmit} />;
      case 3:
        return <AddressForm onSubmit={handleFormSubmit} />;
      case 4:
        return <ParentsForm onSubmit={handleFormSubmit} />;
      case 5:
        return <PreEducationForm onSubmit={handleFormSubmit} />;
      case 6:
        return <TrainingForm onSubmit={handleFormSubmit} />;
      case 7:
        return <CompanyContactForm onSubmit={handleFormSubmit} />;
      case 8:
        return (
          <SummaryForm
            onGoToStep={(step) =>
              dispatch(setCurrentStudentOnboardingStep(step))
            }
          />
        );
      case 9:
        return <FormCompletion />;
      default:
        return null;
    }
  }

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === 9;
  const isSummaryStep = currentStep === 8;
  const isFormStep = currentStep >= 1 && currentStep <= 7; // Steps with forms

  const handleNextStep = () => {
    // Welcome screen - move to next active step
    const nextStepId = getNextActiveStepId();
    dispatch(setCurrentStudentOnboardingStep(nextStepId));
  };

  const handlePreviousStep = () => {
    // Go back to previous active step without validation
    const prevStepId = getPreviousActiveStepId();
    dispatch(setCurrentStudentOnboardingStep(prevStepId));
  };

  const handleConfirm = async () => {
    // Final submission
    setIsSaving(true);
    try {
      await dispatch(submitOnboarding(studentId, data));
      // Move to completion screen
      dispatch(setCurrentStudentOnboardingStep(9));
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Wrapper>
      {!isFirstStep && !showMobileView && (
        <CustomTitle
          title={currentStepDef?.label}
          subTitle={`${t("general.Step")} ${activeStepIndex + 1} ${t("general.of", "von")} ${activeSteps.length}`}
        />
      )}
      <StyledFormBox>{renderFormByStep(currentStep)}</StyledFormBox>
      {/* Only show navigation for non-form steps */}
      {!isFormStep && !isLastStep && (
        <StyledMenuOptions>
          {!isFirstStep && (
            <GeneralButton
              label={t("general.Previous")}
              isPrimary={false}
              fullHeight={false}
              fullWidth={false}
              startIcon={<KeyboardArrowLeftRoundedIcon />}
              onAction={handlePreviousStep}
              disabled={isSaving || loading}
            />
          )}

          {isFirstStep && (
            <GeneralButton
              label={t("general.Start")}
              isPrimary={true}
              fullHeight={false}
              fullWidth={false}
              endIcon={<KeyboardArrowRightRoundedIcon />}
              onAction={handleNextStep}
            />
          )}
        </StyledMenuOptions>
      )}

      {/* Summary step has its own submit button */}
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
            label={
              isSaving
                ? t("general.Submitting", "Wird übermittelt...")
                : t("general.Submit", "Absenden")
            }
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
            disabled={isSaving || loading}
          />
        </StyledMenuOptions>
      )}

      {/* Show auto-save indicator for form steps */}
      {isFormStep && isSaving && (
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.secondary",
              fontSize: 14,
            }}
          >
            <CircularProgress size={16} />
            {t("general.Saving", "Speichern...")}
          </Box>
        </StyledMenuOptions>
      )}

      {/* Show just back button for form steps when not saving */}
      {isFormStep && !isSaving && (
        <StyledMenuOptions>
          <GeneralButton
            label={t("general.Previous")}
            isPrimary={false}
            fullHeight={false}
            fullWidth={false}
            startIcon={<KeyboardArrowLeftRoundedIcon />}
            onAction={handlePreviousStep}
            disabled={loading}
          />
        </StyledMenuOptions>
      )}
    </Wrapper>
  );
};

export default memo(StepForm);
