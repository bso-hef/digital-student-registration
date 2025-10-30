import React, { Fragment } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import GeneralModal from "../GeneralModal";

type ConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirmation: () => void;
  title?: string;
  message?: string;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirmation,
  title,
  message,
}) => {
  const { t } = useTranslation();

  const defaultMessage = t("general.Are you sure you want to close this modal");

  const contentChildren = (
    <Box>
      <Typography>{message ? message : defaultMessage}</Typography>
    </Box>
  );

  const actionsChildren = (
    <Fragment>
      <GeneralButton
        onAction={onClose}
        label={t("general.Cancel")}
        isPrimary={false}
      />
      <GeneralButton onAction={onConfirmation} label={t("general.Confirm")} />
    </Fragment>
  );

  return (
    <GeneralModal
      open={open}
      onCloseModal={onClose}
      modalWidth={500}
      customTitle={title || t("general.Confirm")}
      contentChildren={contentChildren}
      actionsChildren={actionsChildren}
    />
  );
};

export default ConfirmationModal;
