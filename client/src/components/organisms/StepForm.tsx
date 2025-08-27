"use client";

import { Fragment, memo } from "react";

import { setCurrentStudentOnboardingStep } from "@/store/actions/studentActions";
import { AppDispatch } from "@/store/store";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { Box, styled } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/reducers";

import GeneralButton from "../atoms/buttons/GeneralButton";
import AddressForm from "./forms/AddressForm";
import CompanyContactForm from "./forms/CompanyContactForm";
import FormCompletion from "./forms/FormCompletion";
import GeneralForm from "./forms/GeneralForm";
import OriginForm from "./forms/OriginForm";
import ParentsForm from "./forms/ParentsForm";
import PreEducationForm from "./forms/PreEducationForm";
import SummaryForm from "./forms/SummaryForm";
import TrainingForm from "./forms/TrainingForm";
import WelcomeForm from "./forms/WelcomeForm";

const StyledMenuOptions = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  position: "absolute",
  bottom: 32,
  width: "100%",
  maxWidth: "1200px",
  padding: theme.spacing(0, 4),
  gap: theme.spacing(2),
}));

const StepForm = () => {
  const { currentStep } = useSelector((state: RootState) => state.student);
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();

  function renderFormByStep(step: number) {
    switch (step) {
      case 0:
        return <WelcomeForm />;
      case 1:
        return <GeneralForm />;
      case 2:
        return <OriginForm />;
      case 3:
        return <AddressForm />;
      case 4:
        return <ParentsForm />;
      case 5:
        return <PreEducationForm />;
      case 6:
        return <TrainingForm />;
      case 7:
        return <CompanyContactForm />;
      case 8:
        return <SummaryForm />;
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
    <Fragment>
      <Box>{renderFormByStep(currentStep)}</Box>
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
    </Fragment>
  );
};

export default memo(StepForm);
