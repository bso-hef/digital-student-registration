import React from "react";

import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import { Box, DialogTitle, Typography, styled, useTheme } from "@mui/material";

type TitleOwnProps = {
  children: React.ReactNode;
  subtitle?: string;
  onClose?: () => void;
  onCopy?: () => void;
  textCapitalize?: boolean;
  id?: string;
};

const StyledTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  padding: theme.spacing(0, 0, 3, 0),
  [theme.breakpoints.down("sm")]: {
    paddingBottom: "8px",
  },
}));

const StyledTitleRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(3),
}));

const StyledTitleActionsRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: theme.spacing(1),
  marginLeft: "auto",
}));

const StyledTitleText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "textCapitalize",
})<{ textCapitalize: boolean }>(({ theme, textCapitalize }) => ({
  color: theme.palette.text.default,
  fontSize: "24px",
  fontStyle: "normal",
  fontWeight: "700",
  lineHeight: "32px",
  textAlign: "left",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  textTransform: textCapitalize ? "capitalize" : "none",
}));

const StyledSubTitle = styled(Box)(({ theme }) => ({
  color: theme.palette.text.information,
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: "400",
  lineHeight: "20px",
  // marginTop: theme.spacing(1),
}));

const StyledDialogTitle = ({
  children,
  subtitle,
  onClose,
  onCopy,
  textCapitalize = true,
  ...otherTitleProps
}: TitleOwnProps) => {
  const theme = useTheme();

  return (
    <StyledTitle {...otherTitleProps}>
      <StyledTitleRow>
        <StyledTitleText textCapitalize={textCapitalize} variant="h6">
          {children}
        </StyledTitleText>
        <StyledTitleActionsRow>
          {onCopy && (
            <SmallIconButton
              onAction={onCopy}
              icon={
                <LinkRoundedIcon sx={{ color: theme.palette.icon.secondary }} />
              }
              hugeIcon
              noMargin
            />
          )}
          {onClose && (
            <SmallIconButton
              onAction={onClose}
              icon={
                <CloseRoundedIcon
                  sx={{ color: theme.palette.icon.secondary }}
                />
              }
              noMargin
              hugeIcon
            />
          )}
        </StyledTitleActionsRow>
      </StyledTitleRow>
      {subtitle && <StyledSubTitle>{subtitle}</StyledSubTitle>}
    </StyledTitle>
  );
};

export default StyledDialogTitle;
