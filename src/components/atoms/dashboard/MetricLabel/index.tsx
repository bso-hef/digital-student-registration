import React from "react";

import { Box, Typography, styled } from "@mui/material";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
}));

const Label = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 500,
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
}));

const Value = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 600,
  color: theme.palette.text.default,
}));

interface MetricLabelProps {
  label: string;
  value: string | number;
}

const MetricLabel: React.FC<MetricLabelProps> = ({ label, value }) => {
  return (
    <Container>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Container>
  );
};

export default MetricLabel;
