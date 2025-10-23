import React from "react";

import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { Box, Typography, styled } from "@mui/material";

const StyledWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(0.5),
}));

const StyledLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.default,
  textAlign: "center",
  fontFamily: "Inter",
  fontSize: "10px",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "166%",
}));

const StyledVersion = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.information,
  textAlign: "center",
  fontFamily: "Inter",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "166%",
  textTransform: "capitalize",
}));

const OnboardingVersion = ({ heartColor = "#EA9A3E" }) => {
  return (
    <StyledWrapper>
      {process.env.NEXT_PUBLIC_NAME && process.env.NEXT_PUBLIC_VERSION ? (
        <StyledVersion variant="caption" display="block">
          {process.env.NEXT_PUBLIC_NAME +
            " v" +
            process.env.NEXT_PUBLIC_VERSION}
        </StyledVersion>
      ) : null}
      <StyledLabel>
        Made with{" "}
        <FavoriteRoundedIcon
          style={{ height: "10px", width: "10px", color: heartColor }}
        />{" "}
        in Germany
      </StyledLabel>
    </StyledWrapper>
  );
};

export default OnboardingVersion;
