import React from "react";

import { Button, ButtonProps, Typography, styled } from "@mui/material";
import { useDeviceTypeDetection } from "device-type-detection";

import ActionsTooltip from "../../ActionsTooltip";

interface StyledButtonProps extends ButtonProps {
  isMobile: boolean;
  isMobileHorizontal: boolean;
  fullWidth: boolean;
  fullHeight: boolean;
  maxHeight?: string;
  maxWidth?: string;
  isPrimary?: boolean;
}

const GeneralButtonContainer = styled(Button, {
  shouldForwardProp: (prop) =>
    ![
      "isMobile",
      "isMobileHorizontal",
      "fullWidth",
      "fullHeight",
      "maxHeight",
      "maxWidth",
      "isPrimary",
    ].includes(String(prop)),
})<StyledButtonProps>(
  ({
    theme,
    disabled,
    isMobile,
    isMobileHorizontal,
    fullWidth,
    fullHeight,
    maxHeight,
    maxWidth,
    isPrimary,
  }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(1),
    alignSelf: "stretch",
    backgroundColor: disabled
      ? theme.palette.surface.button.disabled
      : isPrimary
        ? theme.palette.surface.button.primary
        : theme.palette.surface.interface.background,
    color: disabled
      ? theme.palette.text.disabled
      : isPrimary
        ? theme.palette.text.contrast
        : theme.palette.text.default,
    padding: isMobile ? theme.spacing(0.5, 2) : theme.spacing(1.5, 2),
    borderRadius: theme.spacing(0.5),
    border: isPrimary ? "none" : `1px solid ${theme.palette.border.seperator}`,
    minWidth: isMobileHorizontal ? "155px" : undefined,
    width: fullWidth ? "100%" : "auto",
    height: fullHeight ? "44px" : undefined,
    maxHeight: maxHeight || "44px",
    maxWidth: maxWidth || "100%",
    cursor: disabled ? "not-allowed" : "pointer",
    // Mobile touch optimizations
    touchAction: "manipulation", // Removes 300ms click delay
    WebkitTapHighlightColor: "transparent", // Removes iOS tap flash
    userSelect: "none", // Prevents text selection on long press
    "@media (hover: hover) and (pointer: fine)": {
      "&:hover": {
        transition: "background-color 0.3s ease-in-out",
        cursor: disabled ? "not-allowed" : "pointer",
        backgroundColor: disabled
          ? theme.palette.surface.button.disabled
          : isPrimary
            ? theme.palette.surface.button.hover
            : theme.palette.surface.button.hoverLight,
        color: isPrimary
          ? theme.palette.text.contrast
          : theme.palette.text.default,
      },
    },
  }),
);

interface ButtonLabelProps {
  fontSize?: number;
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;
}

const ButtonLabel = styled(Typography, {
  shouldForwardProp: (prop) =>
    !["fontSize", "fontWeight", "lineHeight", "letterSpacing"].includes(
      prop as string,
    ),
})<ButtonLabelProps>(({ fontSize, fontWeight, lineHeight, letterSpacing }) => ({
  fontSize: `${fontSize}px !important`,
  fontWeight: `${fontWeight} !important`,
  lineHeight: `${lineHeight}px !important`,
  letterSpacing: `${letterSpacing}px !important`,
}));

interface GeneralButtonProps {
  onAction?: (
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
  ) => void;
  disabled?: boolean;
  isPrimary?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  label?: string;
  fontSize?: number;
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];
  upperCase?: boolean;
  withTooltip?: boolean;
  tooltipLabel?: React.ReactNode;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
  type?: "button" | "submit" | "reset";
  id?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disableElevation?: boolean;
  maxHeight?: string;
  maxWidth?: string;
}

const GeneralButton: React.FC<GeneralButtonProps> = ({
  onAction,
  disabled = false,
  fullWidth = false,
  fullHeight = false,
  label = "",
  fontSize = 14,
  fontWeight = 500,
  lineHeight = 16,
  letterSpacing = 0.8,
  variant = "contained",
  color = "primary",
  upperCase = false,
  withTooltip = false,
  tooltipLabel,
  tooltipPlacement = "top",
  type,
  id,
  startIcon,
  endIcon,
  disableElevation = true,
  maxHeight,
  maxWidth,
  isPrimary = true,
  ...otherProps
}) => {
  const { isMobile, isMobileHorizontal, isTablet } = useDeviceTypeDetection();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault();
      onAction?.(e as unknown as React.MouseEvent<HTMLElement>);
    }
  };

  const eventProps =
    isMobile || isTablet
      ? {
          onTouchEnd: (e: React.TouchEvent<HTMLElement>) => {
            e.preventDefault(); // Prevent synthetic click event
            onAction?.(e);
          },
          onKeyDown: handleKeyDown,
        }
      : {
          onClick: (e: React.MouseEvent<HTMLElement>) => onAction?.(e),
          onKeyDown: handleKeyDown,
        };

  const muiButtonProps = { ...otherProps, ...eventProps };

  const button = (
    <GeneralButtonContainer
      id={id}
      type={type}
      variant={variant}
      color={color}
      disabled={disabled}
      disableElevation={disableElevation}
      disableTouchRipple={true}
      fullWidth={fullWidth}
      isMobile={isMobile}
      isMobileHorizontal={isMobileHorizontal}
      fullHeight={fullHeight}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      isPrimary={isPrimary}
      {...muiButtonProps}
    >
      {startIcon}
      <ButtonLabel
        fontSize={fontSize}
        fontWeight={fontWeight}
        lineHeight={lineHeight}
        letterSpacing={letterSpacing}
        style={{ textTransform: upperCase ? "uppercase" : "none" }}
      >
        {label}
      </ButtonLabel>
      {endIcon}
    </GeneralButtonContainer>
  );

  if (withTooltip) {
    return (
      <ActionsTooltip title={tooltipLabel} placement={tooltipPlacement}>
        {button}
      </ActionsTooltip>
    );
  }

  return button;
};

export default GeneralButton;
