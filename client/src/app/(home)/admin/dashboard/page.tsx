"use client";

import React from "react";

import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import { Box, Typography, styled } from "@mui/material";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  textAlign: "center",
  width: "100%",
  height: "100%",
  color: theme.palette.text.default,
}));

const DashboardPage = () => {
  return (
    <Wrapper>
      <AdminSettingsHeader title="Dashboard" />
      <Typography>Dashboard</Typography>
    </Wrapper>
  );
};

export default DashboardPage;
