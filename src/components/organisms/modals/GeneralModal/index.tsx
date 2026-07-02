import React, { memo } from "react";

import { copyText } from "@/utils/string.utils";
import { applicationScrollbar } from "@/utils/styling.utils";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  type DialogProps,
  Fade,
  styled,
} from "@mui/material";

import StyledDialogTitle from "./StyledDialogTitle";

type RootBoxProps = {
  modalWidth?: number | string;
  modalHeight?: number | string;
  modalMaxHeight?: number | string;
};

const Root = styled(Box, {
  shouldForwardProp: (prop) =>
    !["modalWidth", "modalHeight", "modalMaxHeight"].includes(prop as string),
})<RootBoxProps>(({ theme, modalWidth, modalHeight, modalMaxHeight }) => ({
  display: "flex",
  flexDirection: "column",
  margin: 0,
  padding: theme.spacing(6),
  width: modalWidth ?? 630,
  height: modalHeight ?? "auto",
  maxHeight: modalMaxHeight ?? "100%",
  borderRadius: theme.spacing(2),
}));

const StyledDialog = styled(Dialog, {
  shouldForwardProp: (prop) => prop !== "transparentBackdrop",
})<{ transparentBackdrop?: boolean }>(({ theme, transparentBackdrop }) => ({
  "& .MuiBackdrop-root": transparentBackdrop
    ? { backgroundColor: "transparent" }
    : undefined,
  "& .MuiDialog-paper": {
    backgroundColor: theme.palette.surface.interface.base,
    backgroundImage: "unset",
    color: theme.palette.text.default,
    borderRadius: theme.spacing(2),
    margin: 0,
    ...applicationScrollbar(theme),
  },
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(0),
  overflow: "hidden",
  flex: "unset",
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(3, 0, 0, 0),
  width: "100%",
}));

export interface GeneralModalProps extends Omit<
  DialogProps,
  "onClose" | "open" | "title"
> {
  open: boolean;
  modalWidth?: number | string;
  modalHeight?: number | string;
  modalMaxHeight?: number | string;
  customTitle?: React.ReactNode;
  subtitle?: string;
  contentChildren?: React.ReactNode;
  actionsChildren?: React.ReactNode;
  onCloseModal?: (value: string) => void;
  onCopyValue?: string;
  onOpenInNewTab?: string;
  disabled?: boolean;
  disableBackdropClick?: boolean;
  closeIcon?: boolean;
  textCapitalize?: boolean;
  transparentBackdrop?: boolean;
  withTransition?: boolean;
}

const GeneralModal = ({
  modalWidth = 630,
  modalMaxHeight = "100%",
  modalHeight,
  customTitle,
  subtitle,
  contentChildren,
  actionsChildren,
  open,
  onCloseModal,
  onCopyValue,
  onOpenInNewTab,
  maxWidth = "md",
  disableBackdropClick = false,
  closeIcon = true,
  textCapitalize = false,
  transparentBackdrop = false,
  withTransition = true,
  ...otherProps
}: GeneralModalProps) => {
  const handleClose = () => {
    onCloseModal?.("");
  };

  const handleCopy = () => {
    if (onCopyValue) copyText(onCopyValue);
  };

  const handleOpenInNewTab = () => {
    if (onOpenInNewTab) {
      window.open(onOpenInNewTab, "_blank", "noopener,noreferrer");
    }
  };

  const closeIconProps = closeIcon
    ? {
        onClose: handleClose,
      }
    : {};

  const copyIconProps = onCopyValue
    ? {
        onCopy: handleCopy,
      }
    : {};

  const openInNewTabProps = onOpenInNewTab
    ? {
        onOpenInNewTab: handleOpenInNewTab,
      }
    : {};

  const backdropProps = transparentBackdrop
    ? { style: { backgroundColor: "transparent" } }
    : {};

  const transitionProps = withTransition
    ? { TransitionComponent: Fade, TransitionProps: { timeout: 300 } }
    : {};

  return (
    <StyledDialog
      aria-labelledby="customized-dialog-title"
      onClose={(event, reason) => {
        // MUI v9 removed the `disableEscapeKeyDown` prop; we prevent closing on
        // backdrop click / escape key here instead. `disableBackdropClick`
        // additionally keeps the dialog open while a blocking action runs.
        if (
          disableBackdropClick ||
          reason === "backdropClick" ||
          reason === "escapeKeyDown"
        ) {
          return;
        }
        handleClose();
      }}
      open={open}
      maxWidth={maxWidth}
      transparentBackdrop={transparentBackdrop}
      slotProps={{ backdrop: { ...backdropProps } }}
      {...transitionProps}
    >
      <Root
        modalWidth={modalWidth}
        modalHeight={modalHeight}
        modalMaxHeight={modalMaxHeight}
        {...otherProps}
      >
        {customTitle && (
          <StyledDialogTitle
            id="customized-dialog-title"
            subtitle={subtitle}
            textCapitalize={textCapitalize}
            {...closeIconProps}
            {...copyIconProps}
            {...openInNewTabProps}
          >
            {customTitle}
          </StyledDialogTitle>
        )}

        {contentChildren && (
          <StyledDialogContent>{contentChildren}</StyledDialogContent>
        )}

        {actionsChildren && (
          <StyledDialogActions>{actionsChildren}</StyledDialogActions>
        )}
      </Root>
    </StyledDialog>
  );
};

export default memo(GeneralModal);
