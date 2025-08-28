"use client";

import { useEffect } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import Logger from "@/lib/client-logger";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Box, Stack, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: theme.spacing(6),
  height: "100vh",
  minWidth: "100vw",
  width: "100%",
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.surface.interface.background,
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: "2rem !important",
  fontWeight: 600,
  lineHeight: 1.2,
  textAlign: "center",
  fontFamily: "Inter",
  color: theme.palette.text.default,
}));

const StyledSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem !important",
  fontWeight: 600,
  lineHeight: 1.2,
  textAlign: "center",
  fontFamily: "Inter",
  color: theme.palette.text.information,
}));

export default function GlobalError({ error, reset }: ErrorProps) {
  const { t } = useTranslation();

  useEffect(() => {
    Logger.error("Global error occurred:", error);
  }, [error]);

  return (
    <ErrorContainer>
      <Stack
        spacing={3}
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <ReportProblemIcon
          sx={{ fontSize: 80, color: "warning.main", mb: 2 }}
        />
        <StyledTitle>{t("error.An unexpected error occurred")}</StyledTitle>
        <StyledSubtitle>{error.message}</StyledSubtitle>
        <Box>
          <GeneralButton
            onAction={reset}
            label={t("error.Please try again later")}
            fullHeight={false}
            fullWidth={false}
            maxWidth="350px"
          />
        </Box>
      </Stack>
    </ErrorContainer>
  );
}
