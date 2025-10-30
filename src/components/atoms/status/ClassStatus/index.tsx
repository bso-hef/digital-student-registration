import React from "react";

import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
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
  showLabel?: boolean;
};

const ClassStatus: React.FC<ClassStatusProps> = ({
  active,
  showLabel = true,
}) => {
  const { t } = useTranslation();

  const icon = active ? (
    <CheckCircleRoundedIcon fontSize="small" color="success" />
  ) : (
    <CancelRoundedIcon fontSize="small" color="error" />
  );

  const label = active ? t("general.Active") : t("general.Inactive");

  return (
    <StyledBox>
      {icon}
      {showLabel && <StyledText>{label}</StyledText>}
    </StyledBox>
  );
};

export default ClassStatus;
