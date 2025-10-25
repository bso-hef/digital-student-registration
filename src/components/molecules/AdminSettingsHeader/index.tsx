import React from "react";

import HeaderSearchInput from "@/components/atoms/HeaderSearchInput";
import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import { Box, LinearProgress, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

const StyledHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSubHeader",
})<{ isSubHeader?: boolean }>(({ theme, isSubHeader }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingLeft: 0,
  paddingRight: 0,
  margin: isSubHeader ? theme.spacing(0, 0, 2, 0) : theme.spacing(0),
  position: "relative",
  width: "100%",
}));

const StyledHeaderTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isSubHeader",
})<{ isSubHeader?: boolean }>(({ theme, isSubHeader }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  textTransform: "capitalize",
  color: theme.palette.text.default,
  paddingLeft: isSubHeader ? theme.spacing(2) : theme.spacing(4),
  fontFamily: "Inter",
  fontSize: "24px !important",
  fontWeight: "700 !important",
  lineHeight: "32px !important",
}));

const StyledToolBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSubHeader",
})<{ isSubHeader?: boolean }>(({ theme, isSubHeader }) => ({
  display: "flex",
  alignItems: "row",
  gap: theme.spacing(2),
  paddingRight: isSubHeader ? theme.spacing(2) : theme.spacing(4),
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
  isSubHeader?: boolean;
  children?: React.ReactNode;
  [key: string]: unknown;
}

const AdminSettingsHeader: React.FC<AdminSettingsHeaderProps> = ({
  title,
  disabled,
  onSearch,
  onSave,
  onLoad,
  isSubHeader = false,
  children,
  ...OtherProps
}) => {
  const { t } = useTranslation();

  return (
    <StyledHeader
      mb={2}
      px={3}
      py={2}
      isSubHeader={isSubHeader}
      {...OtherProps}
    >
      <StyledHeaderTitle isSubHeader={isSubHeader}>{title}</StyledHeaderTitle>
      <StyledToolBox isSubHeader={isSubHeader}>
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
