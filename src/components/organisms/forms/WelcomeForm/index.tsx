import { useMemo } from "react";

import CustomTitle from "@/components/atoms/CustomTitle";
import {
  getActiveSteps,
  getStudentSteps,
} from "@/constants/studentSteps.constants";
import { Box, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { RootState } from "@/store/reducers";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  justifyContent: "space-between",
  textAlign: "center",
  width: "100%",
  height: "100%",
  color: theme.palette.text.default,
}));

const Information = styled(Typography)(({ theme }) => ({
  fontSize: "18px !important",
  fontWeight: 400,
  lineHeight: "24px !important",
  letterSpacing: "0.115px",
  color: theme.palette.text.default,
  marginBottom: theme.spacing(1),
  textAlign: "left",
}));

const WelcomeForm = () => {
  const { t } = useTranslation();
  const { data, currentClass } = useSelector(
    (state: RootState) => state.student,
  );

  // Calculate the actual number of steps based on student data and class type
  const stepCount = useMemo(() => {
    const allSteps = getStudentSteps(t);
    const activeSteps = getActiveSteps(allSteps, data, currentClass);
    return activeSteps.length;
  }, [t, data, currentClass]);

  return (
    <Wrapper>
      <CustomTitle
        title={t("onboarding.welcome.title")}
        subTitle={t("onboarding.welcome.subtitle", { count: stepCount })}
      >
        <Information>{t("onboarding.welcome.paragraph1")}</Information>

        <Information>{t("onboarding.welcome.paragraph2")}</Information>

        <Information>{t("onboarding.welcome.paragraph3")}</Information>

        <Typography
          variant="body2"
          sx={{ mt: 2, textAlign: "left", fontStyle: "italic" }}
        >
          {t("onboarding.welcome.requiredFieldsHint")}
        </Typography>
      </CustomTitle>
    </Wrapper>
  );
};

export default WelcomeForm;
