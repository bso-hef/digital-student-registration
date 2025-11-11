import CustomTitle from "@/components/atoms/CustomTitle";
import { Box, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

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
}));

const WelcomeForm = () => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <CustomTitle
        title={t("onboarding.welcome.title")}
        subTitle={t("onboarding.welcome.subtitle")}
      >
        <Information>{t("onboarding.welcome.paragraph1")}</Information>

        <Information>{t("onboarding.welcome.paragraph2")}</Information>

        <Information>{t("onboarding.welcome.paragraph3")}</Information>

        <Information>{t("onboarding.welcome.paragraph4")}</Information>
      </CustomTitle>
    </Wrapper>
  );
};

export default WelcomeForm;
