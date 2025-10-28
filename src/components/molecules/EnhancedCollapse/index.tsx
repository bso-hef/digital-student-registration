import React, { memo } from "react";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { Box, Paper, Typography, styled } from "@mui/material";

const StyledCollapse = styled(Box, {
  shouldForwardProp: (prop) => prop !== "expanded",
})<{ expanded?: boolean }>(({ theme, expanded }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(1),
  height: "64px",
  alignSelf: "stretch",
  padding: theme.spacing(0, 3),
  backgroundColor: expanded
    ? theme.palette.surface.button.focused
    : theme.palette.surface.interface.base,
  backgroundImage: "unset",
  border: `1px solid ${theme.palette.border.seperator}`,
  borderRadius: expanded ? theme.spacing(1, 1, 0, 0) : theme.spacing(1),
  cursor: "pointer",
  fontFamily: "Inter, sans-serif",
  color: theme.palette.text.default,
  transition: "all 0.3s ease-in-out",
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  color: theme.palette.text.default,
  fontFamily: "Inter, sans-serif",
  fontSize: "16px !important",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "20px !important",
}));

const StyledSubTitle = styled(Typography)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  color: theme.palette.text.information,
  fontFamily: "Inter, sans-serif",
  fontSize: "12px !important",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "14px !important",
}));

const StyledContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== "disablePadding" && prop !== "expanded",
})<{ expanded?: boolean; disablePadding?: boolean }>(
  ({ theme, disablePadding, expanded }) => ({
    padding: disablePadding ? 0 : theme.spacing(2, 3),
    borderRadius: theme.spacing(0, 0, 1, 1),
    borderLeft: expanded
      ? `1px solid ${theme.palette.border.seperator}`
      : "none",
    borderRight: expanded
      ? `1px solid ${theme.palette.border.seperator}`
      : "none",
    borderBottom: expanded
      ? `1px solid ${theme.palette.border.seperator}`
      : "none",
    backgroundColor: theme.palette.surface.interface.base,
    backgroundImage: "unset",
    overflow: expanded ? "auto" : "hidden",
  }),
);

interface EnhancedCollapseProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onAction?: (() => void) | null;
  withArrow?: boolean;
  expanded?: boolean;
  disablePadding?: boolean;
}

const EnhancedCollapse: React.FC<EnhancedCollapseProps> = ({
  title,
  subtitle,
  children,
  onAction = null,
  withArrow = true,
  expanded = true,
  disablePadding = false,
}) => {
  return (
    <Paper elevation={0}>
      <StyledCollapse onClick={onAction} expanded={expanded}>
        <Box>
          <StyledTitle>{title}</StyledTitle>
          {subtitle && <StyledSubTitle>{subtitle}</StyledSubTitle>}
        </Box>
        {withArrow && (
          <Box display="flex" alignItems="center">
            {expanded ? (
              <KeyboardArrowUpRoundedIcon />
            ) : (
              <KeyboardArrowDownRoundedIcon />
            )}
          </Box>
        )}
      </StyledCollapse>
      {expanded && (
        <StyledContent disablePadding={disablePadding} expanded={expanded}>
          {children}
        </StyledContent>
      )}
    </Paper>
  );
};

export default memo(EnhancedCollapse);
