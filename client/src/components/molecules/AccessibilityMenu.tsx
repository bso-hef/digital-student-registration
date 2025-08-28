import React, { Fragment, useState } from "react";

import AccessibilityRoundedIcon from "@mui/icons-material/AccessibilityRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, Button, Drawer, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

import SmallIconButton from "../atoms/buttons/SmallIconButton";
import LanguageDropdown from "../atoms/dropdowns/LanguageDropdown";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  backdropFilter: "blur(2px)",
  WebkitBackdropFilter: "blur(2px)",
  "& .MuiDrawer-paper": {
    background: theme.palette.surface.interface.base,
    borderLeft: `1px solid ${theme.palette.border.seperator}`,
    borderRadius: theme.spacing(3, 0, 0, 3),
    boxShadow: theme.shadows[4],
    width: "100%",
    maxWidth: 280,
    padding: theme.spacing(2),
  },
}));

const StyledButtonLabel = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  lineHeight: "20px",
  fontWeight: 500,
  textTransform: "none",
  color: theme.palette.text.default,
}));

const AccessibilityMenu = () => {
  const { t } = useTranslation();

  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const handleToggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  return (
    <Fragment>
      <SmallIconButton
        icon={<AccessibilityRoundedIcon />}
        onAction={handleToggleMenu}
        hugeIcon
        title={t("general.Accessibility")}
        placement="bottom"
      />

      <StyledDrawer anchor="right" open={openMenu} onClose={handleToggleMenu}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            {t("general.Accessibility")}
          </Typography>
          <SmallIconButton
            icon={<CloseRoundedIcon />}
            onAction={handleToggleMenu}
            title={t("general.Close")}
            placement="bottom"
            bigIcon
          />
        </Box>

        <Box mt={2} display="flex" flexDirection="column" gap={3}>
          <StyledButtonLabel>Language Control:</StyledButtonLabel>
          <LanguageDropdown />

          <StyledButtonLabel>Theme Control:</StyledButtonLabel>
          <Button variant="outlined" fullWidth>
            Dark Mode
          </Button>

          <StyledButtonLabel>Language Control:</StyledButtonLabel>
          <Button variant="outlined" fullWidth>
            Language Control
          </Button>
        </Box>
      </StyledDrawer>
    </Fragment>
  );
};

export default AccessibilityMenu;
