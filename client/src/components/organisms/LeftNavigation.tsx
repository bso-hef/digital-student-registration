import React, { memo } from "react";

import { Box, styled } from "@mui/material";

const StyledNavigation = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.surface.interface.base,
  border: `1px solid ${theme.palette.border.seperator}`,
  height: "100%",
  width: "320px",
  padding: theme.spacing(2),
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  borderRadius: theme.spacing(2),
}));

const LeftNavigation = () => {
  return <StyledNavigation>LeftNavigation</StyledNavigation>;
};

export default memo(LeftNavigation);
