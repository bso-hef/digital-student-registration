import React from "react";

import { Box, LinearProgress, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

import HeaderSearchInput from "../atoms/HeaderSearchInput";
import GeneralButton from "../atoms/buttons/GeneralButton";

const StyledHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingLeft: 0,
  paddingRight: 0,
  margin: theme.spacing(0, 3, 3, 3),
  position: "relative",
  width: "100%",
}));

const StyledHeaderTitle = styled(Typography)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  textTransform: "capitalize",
  color: theme.palette.text.default,
  fontFamily: "Inter",
  fontSize: 24,
  fontWeight: 700,
  lineHeight: "32px",
}));

const StyledToolBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "row",
  gap: theme.spacing(2),
}));

const StyledDivierOrLoader = styled(Box)(() => ({
  position: "absolute",
  bottom: 0,
  width: "100%",
}));

const StyledDivider = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.border.seperator}`,
}));

interface AdminSettingsHeaderProps {
  title: string;
  disabled?: boolean;
  onSearch?: (value: string) => void;
  onSave?: () => void;
  onLoad?: boolean;
  children?: React.ReactNode;
  [key: string]: unknown;
}

const AdminSettingsHeader: React.FC<AdminSettingsHeaderProps> = ({
  title,
  disabled,
  onSearch,
  onSave,
  onLoad,
  children,
  ...OtherProps
}) => {
  const { t } = useTranslation();

  return (
    <StyledHeader mb={2} px={3} py={2} {...OtherProps}>
      <StyledHeaderTitle>{title}</StyledHeaderTitle>
      <StyledToolBox>
        {onSearch && (
          <Box>
            <HeaderSearchInput
              onChange={onSearch ? (e) => onSearch(e.target.value) : undefined}
            />
          </Box>
        )}
        {children}
        {onSave && (
          <GeneralButton
            onAction={onSave}
            disabled={disabled}
            type="submit"
            label={t("general.Save")}
          />
        )}
      </StyledToolBox>
      <StyledDivierOrLoader>
        {onLoad ? <LinearProgress /> : <StyledDivider />}
      </StyledDivierOrLoader>
    </StyledHeader>
  );
};

export default AdminSettingsHeader;
