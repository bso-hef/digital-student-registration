import React from "react";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { Box, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

interface AuditStatusProps {
  status: "success" | "failure" | "partial";
}

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const StyledText = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

const AuditStatus: React.FC<AuditStatusProps> = ({ status }) => {
  const { t } = useTranslation();

  let icon: React.ReactNode;
  let text: string;

  switch (status) {
    case "success":
      icon = <CheckCircleRoundedIcon fontSize="small" color="success" />;
      text = t("audit.status.success");
      break;
    case "failure":
      icon = <ErrorRoundedIcon fontSize="small" color="error" />;
      text = t("audit.status.failure");
      break;
    case "partial":
      icon = <WarningRoundedIcon fontSize="small" color="warning" />;
      text = t("audit.status.partial");
      break;
    default:
      icon = <ErrorRoundedIcon fontSize="small" color="disabled" />;
      text = status;
      break;
  }

  return (
    <StyledBox>
      {icon}
      <StyledText>{text}</StyledText>
    </StyledBox>
  );
};

export default AuditStatus;
