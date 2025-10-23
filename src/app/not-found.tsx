"use client";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Container, Stack, Typography, styled } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const NotFoundContainer = styled(Container)(({ theme }) => ({
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

export default function NotFound() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <NotFoundContainer>
      <Stack
        spacing={3}
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main" }} />
        <StyledTitle>{`404 - ${t("error.Page not found")}`}</StyledTitle>
        <StyledSubtitle>
          {t("error.Sorry we couldn't find that page")}
        </StyledSubtitle>
        <Box>
          <GeneralButton
            onAction={handleBackToHome}
            label={t("error.Back Home")}
            fullHeight={false}
            fullWidth={false}
            maxWidth="250px"
          />
        </Box>
      </Stack>
    </NotFoundContainer>
  );
}
