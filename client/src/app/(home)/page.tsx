"use client";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { Box, Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Link from "next/link";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  textAlign: "center",
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

export default function Home() {
  const handleVisitDocs = () => {
    window.open("https://github.com", "_blank");
  };

  return (
    <Wrapper>
      <SchoolRoundedIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
      <Typography variant="h3" component="h1" color="text.default">
        Digital Student Onboarding
      </Typography>
      <Typography variant="body1" color="text.information" maxWidth="sm">
        Simple description
      </Typography>

      <Stack direction="row" spacing={2} mt={4}>
        <GeneralButton
          label="Visit Admin UI"
          isPrimary={false}
          onAction={handleVisitDocs}
        />
        <GeneralButton
          label="View Docs"
          isPrimary={false}
          onAction={handleVisitDocs}
        />
        <GeneralButton label="Visit Student UI" onAction={handleVisitDocs} />
      </Stack>
    </Wrapper>
  );
}
