"use client";

import React from "react";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Button, Typography, styled } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const CompletionContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: theme.spacing(6),
  maxWidth: "600px",
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
        <CheckCircleOutlineIcon />
      </IconContainer>

      <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
        {t("onboarding.completion.title", "Einschreibung abgeschlossen!")}
      </Typography>

      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        {t(
          "onboarding.completion.subtitle",
          "Ihre Daten wurden erfolgreich übermittelt.",
        )}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t(
          "onboarding.completion.message",
          "Vielen Dank für die Einschreibung. Sie erhalten in Kürze eine Bestätigungsmail mit weiteren Informationen. Bei Fragen können Sie sich jederzeit an das Sekretariat wenden.",
        )}
      </Typography>

      <ActionsContainer>
        <Button
          variant="contained"
          size="large"
          onClick={handleGoHome}
          sx={{ textTransform: "none", fontSize: "16px", padding: "12px 32px" }}
        >
          {t("onboarding.completion.backToHome", "Zur Startseite")}
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          {t(
            "onboarding.completion.footer",
            "Sie können dieses Fenster jetzt schließen.",
          )}
        </Typography>
      </ActionsContainer>
    </CompletionContainer>
  );
};

export default FormCompletion;
