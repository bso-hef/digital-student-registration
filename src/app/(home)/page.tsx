"use client";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import StartRoundedIcon from "@mui/icons-material/StartRounded";
import { Box, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100%",
  textAlign: "center",
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleVisitDocs = () => {
    if (typeof window !== "undefined") {
      window.open(
        "https://github.com/bso-hef/digital-student-registration/",
        "_blank",
      );
    }
  };

  const handleVisitAdmin = () => {
    router.push("/admin");
  };

  const handleVisitOnboarding = () => {
    router.push("/student");
  };

  return (
    <Wrapper>
      <SchoolRoundedIcon sx={{ fontSize: 120, color: "primary.main", mb: 2 }} />
      <Typography variant="h3" component="h1" color="text.default">
        {t("student.home.Title")}
      </Typography>
      <Typography variant="body1" color="text.information" maxWidth="sm">
        {t("student.home.Description")}
      </Typography>

      <Stack direction="row" spacing={2} mt={4}>
        <GeneralButton
          label={t("student.home.Administration")}
          isPrimary={false}
          onAction={handleVisitAdmin}
          startIcon={<AdminPanelSettingsRoundedIcon />}
        />
        <GeneralButton
          label={t("student.home.Documentation")}
          isPrimary={false}
          onAction={handleVisitDocs}
          startIcon={<ArticleRoundedIcon />}
        />
        <GeneralButton
          label={t("student.home.Onboarding")}
          isPrimary={false}
          onAction={handleVisitOnboarding}
          startIcon={<StartRoundedIcon />}
        />
      </Stack>
    </Wrapper>
  );
}
