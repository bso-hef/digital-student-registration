"use client";

import React from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { Box, Typography, styled } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const CompletionContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: theme.spacing(6),
  margin: "0 auto",
}));

const IconContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  "& svg": {
    fontSize: "120px",
    color: theme.palette.success.main,
  },
}));

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
  width: "100%",
  maxWidth: "400px",
}));

const FormCompletion = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <CompletionContainer>
      <IconContainer>
        <CheckCircleOutlineRoundedIcon />
      </IconContainer>

      <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
        {t("onboarding.completion.title")}
      </Typography>

      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        {t("onboarding.completion.subtitle")}
      </Typography>

      <Typography variant="body1" color="text.information" sx={{ mb: 4 }}>
        {t("onboarding.completion.message")}
      </Typography>

      <ActionsContainer>
        <GeneralButton
          onAction={handleGoHome}
          startIcon={<HomeRoundedIcon />}
          label={t("onboarding.completion.backToHome")}
          fullHeight={false}
          fullWidth={false}
        />
      </ActionsContainer>
    </CompletionContainer>
  );
};

export default FormCompletion;
