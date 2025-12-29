import React from "react";

import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Box, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  width: "100%",
  maxWidth: "max-content",
}));

const StyledText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.default,
  fontSize: "16px !important",
  lineHeight: "24px",
}));

type ClassStatusProps = {
  active: boolean;
  incomplete?: boolean;
  showLabel?: boolean;
};

const ClassStatus: React.FC<ClassStatusProps> = ({
  active,
  incomplete = false,
  showLabel = true,
}) => {
  const { t } = useTranslation();

  // Priority: incomplete status takes precedence over active/inactive
  let icon: React.ReactNode;
  let label: string;

  if (incomplete) {
    icon = <WarningAmberRoundedIcon fontSize="small" color="warning" />;
    label = t("general.Incomplete");
  } else if (active) {
    icon = <CheckCircleRoundedIcon fontSize="small" color="success" />;
    label = t("general.Active");
  } else {
    icon = <CancelRoundedIcon fontSize="small" color="error" />;
    label = t("general.Inactive");
  }

  return (
    <StyledBox>
      {icon}
      {showLabel && <StyledText>{label}</StyledText>}
    </StyledBox>
  );
};

export default ClassStatus;
