"use client";

import { memo } from "react";

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
import { getStudentSteps } from "@/constants/studentSteps.constants";
import { setCurrentStudentOnboardingStep } from "@/store/actions/studentActions";
import { AppDispatch } from "@/store/store";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { Box, styled } from "@mui/material";
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

const StyledFormBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  width: "100%",
  height: "auto",
}));

const StepForm = () => {
  const { currentStep, data } = useSelector(
    (state: RootState) => state.student,
  );
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();

  const { isMobile, isTabletVertical } = useDeviceTypeDetection();

  const showMobileView = isMobile || isTabletVertical;

  const steps = getStudentSteps(t);
  const currentStepDef = steps[currentStep];

  function renderFormByStep(step: number) {
    switch (step) {
      case 0:
        return <WelcomeForm />;
      case 1:
        return <GeneralForm data={data} />;
      case 2:
        return <OriginForm data={data} />;
      case 3:
        return <AddressForm data={data} />;
      case 4:
        return <ParentsForm data={data} />;
      case 5:
        return <PreEducationForm data={data} />;
      case 6:
        return <TrainingForm data={data} />;
      case 7:
        return <CompanyContactForm data={data} />;
      case 8:
        return <SummaryForm data={data} />;
      case 9:
        return <FormCompletion />;
      default:
        return null;
    }
  }

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === 9;

  const handleNextStep = () => {
    // Handle the logic for the next step
    console.log("Next step");
    dispatch(setCurrentStudentOnboardingStep(currentStep + 1));
  };

  const handlePreviousStep = () => {
    // Handle the logic for the previous step
    console.log("Previous step");
    dispatch(setCurrentStudentOnboardingStep(currentStep - 1));
  };

  const handleConfirm = () => {
    // Handle the logic for the confirm step
    console.log("Confirm step");
  };

  return (
    <Wrapper>
      {!isFirstStep && !showMobileView && (
        <CustomTitle
          title={currentStepDef?.label}
          subTitle={`${t("general.Step")} ${currentStep + 1}`}
        />
      )}
      <StyledFormBox>{renderFormByStep(currentStep)}</StyledFormBox>
      <StyledMenuOptions>
        {!isFirstStep && (
          <GeneralButton
            label={isLastStep ? t("general.Confirm") : t("general.Previous")}
            isPrimary={false}
            fullHeight={false}
            fullWidth={false}
            startIcon={
              isLastStep ? (
                <DoneRoundedIcon />
              ) : (
                <KeyboardArrowLeftRoundedIcon />
              )
            }
            onAction={isLastStep ? handleConfirm : handlePreviousStep}
          />
        )}
        {!isLastStep && (
          <GeneralButton
            label={isFirstStep ? t("general.Start") : t("general.Next")}
            isPrimary={false}
            fullHeight={false}
            fullWidth={false}
            endIcon={<KeyboardArrowRightRoundedIcon />}
            onAction={handleNextStep}
          />
        )}
      </StyledMenuOptions>
    </Wrapper>
  );
};

export default memo(StepForm);
