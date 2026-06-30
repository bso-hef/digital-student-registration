import React, { useEffect } from "react";

import { useDeviceTypeDetection } from "@/hooks/useDeviceTypeDetection";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
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
  textAlign: "center",
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  color: theme.palette.text.secondary,
  textAlign: "center",
  maxWidth: "400px",
}));

interface MobileBlockerProps {
  enabled?: boolean;
  onBlocked?: (isBlocked: boolean) => void;
}

const MobileBlocker = ({ enabled = true, onBlocked }: MobileBlockerProps) => {
  const { t } = useTranslation();
  const { isMobile, isTablet } = useDeviceTypeDetection();
  const isBlocked = enabled && (isMobile || isTablet);

  useEffect(() => {
    if (typeof onBlocked === "function") {
      onBlocked(isBlocked);
    }
  }, [isBlocked, onBlocked]);

  return (
    <Fade in={isBlocked} timeout={100}>
      <Wrapper>
        <DesktopWindowsRoundedIcon style={{ fontSize: 64 }} />
        <StyledTitle>{t("screenBlockers.desktopOnlyTitle")}</StyledTitle>
        <StyledDescription>
          {t("screenBlockers.desktopOnlyDescription")}
        </StyledDescription>
      </Wrapper>
    </Fade>
  );
};

export default MobileBlocker;
