import React, { useEffect } from "react";

import { SCREEN_BLOCKER_TYPES } from "@/constants/general.constants";
import { useDeviceTypeDetection } from "@/hooks/useDeviceTypeDetection";
import ScreenRotationRoundedIcon from "@mui/icons-material/ScreenRotationRounded";
import { Box, Fade, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

const Wrapper = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  color: theme.palette.text.default,
  backgroundColor: theme.palette.surface.interface.disabled,
  padding: theme.spacing(6),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  zIndex: 999999,
  gap: theme.spacing(2),
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: "24px",
  fontWeight: 700,
  color: theme.palette.text.default,
}));

interface RotationBlockerProps {
  message?: string;
  blockerType: (typeof SCREEN_BLOCKER_TYPES)[keyof typeof SCREEN_BLOCKER_TYPES];
  onBlocked?: (isBlocked: boolean) => void;
}

const RotationBlocker = ({
  message = "",
  blockerType,
  onBlocked,
}: RotationBlockerProps) => {
  const { t } = useTranslation();
  const {
    isMobileVertical,
    isMobileHorizontal,
    isMobile,
    isTablet,
    isTabletVertical,
    isTabletHorizontal,
  } = useDeviceTypeDetection();

  const isBlockedLandscape = blockerType === SCREEN_BLOCKER_TYPES.LANDSCAPE;
  const isBlockedPortrait = blockerType === SCREEN_BLOCKER_TYPES.PORTRAIT;

  // Derive blocked state during render from the current device flags
  let isBlocked = false;
  if (isBlockedLandscape) {
    if ((isMobile && isMobileHorizontal) || (isTablet && isTabletHorizontal)) {
      isBlocked = true;
    }
  } else if (isBlockedPortrait) {
    if ((isMobile && isMobileVertical) || (isTablet && isTabletVertical)) {
      isBlocked = true;
    }
  }

  useEffect(() => {
    if (typeof onBlocked === "function") {
      onBlocked(isBlocked);
    }
  }, [isBlocked, onBlocked]);

  const getMessage = () => {
    if (message) {
      return message;
    }
    if (isBlockedLandscape) {
      return t("screenBlockers.portrait");
    }
    if (isBlockedPortrait) {
      return t("screenBlockers.landscape");
    }
    return "";
  };

  return (
    <Fade in={isBlocked} timeout={100}>
      <Wrapper>
        <ScreenRotationRoundedIcon style={{ fontSize: 64 }} />
        <StyledTitle>{getMessage()}</StyledTitle>
      </Wrapper>
    </Fade>
  );
};

export default RotationBlocker;
