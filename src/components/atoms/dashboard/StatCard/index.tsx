import React from "react";

import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import { Box, Card, CardContent, Typography, styled } from "@mui/material";

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "gradient",
})<{ gradient?: string }>(({ theme, gradient }) => ({
  background: gradient || theme.palette.surface.interface.base,
  border: `1px solid ${theme.palette.border.seperator}`,
  borderRadius: theme.spacing(1.5),
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 8px",
  transition: "all 0.3s ease-in-out",
  height: "100%",
  position: "relative",
  overflow: "hidden",
  cursor: "grab",
  "&:active": {
    cursor: "grabbing",
  },
  "&:hover": {
    border: `2px dashed ${gradient ? "rgba(255,255,255,0.6)" : theme.palette.border.hover}`,
    boxShadow: "rgba(0, 0, 0, 0.2) 0px 8px 24px",
    transform: "scale(1.02)",
  },
  ...(gradient && {
    color: "#ffffff",
    "& .MuiTypography-root": {
      color: "#ffffff",
    },
  }),
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  "&:last-child": {
    paddingBottom: theme.spacing(3),
  },
  position: "relative",
  zIndex: 1,
}));

const ValueText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "hasGradient",
})<{ hasGradient?: boolean }>(({ theme, hasGradient }) => ({
  fontSize: "2.5rem",
  fontWeight: 700,
  color: hasGradient ? "#ffffff" : theme.palette.text.default,
  marginBottom: theme.spacing(0.5),
  textShadow: hasGradient ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
}));

const LabelText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "hasGradient",
})<{ hasGradient?: boolean }>(({ theme, hasGradient }) => ({
  fontSize: "0.875rem",
  fontWeight: 600,
  color: hasGradient ? "rgba(255,255,255,0.95)" : theme.palette.text.secondary,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
}));

const DragHandle = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  opacity: 0.6,
  transition: "opacity 0.2s ease-in-out",
  color: "rgba(255,255,255,0.9)",
  cursor: "grab",
  zIndex: 2,
  "&:active": {
    cursor: "grabbing",
  },
  "&:hover": {
    opacity: 1,
  },
}));

const IconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "hasGradient",
})<{ hasGradient?: boolean }>(({ hasGradient }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px",
  borderRadius: "12px",
  backgroundColor: hasGradient
    ? "rgba(255, 255, 255, 0.2)"
    : "rgba(0, 0, 0, 0.05)",
  backdropFilter: "blur(10px)",
  marginBottom: "16px",
}));

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  gradient?: string;
  id?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  gradient,
  id,
}) => {
  return (
    <StyledCard gradient={gradient} id={id}>
      <DragHandle className="drag-handle">
        <DragIndicatorRoundedIcon
          sx={{
            fontSize: 24,
          }}
        />
      </DragHandle>
      <StyledCardContent>
        {icon && <IconWrapper hasGradient={!!gradient}>{icon}</IconWrapper>}
        <ValueText hasGradient={!!gradient}>{value}</ValueText>
        <LabelText hasGradient={!!gradient}>{label}</LabelText>
      </StyledCardContent>
    </StyledCard>
  );
};

export default StatCard;
