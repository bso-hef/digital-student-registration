"use client";

import React, { Fragment, memo, useCallback, useEffect, useState } from "react";

import GeneralInput from "@/components/atoms/GeneralInput";
import OnboardingVersion from "@/components/atoms/OnboardingVersion";
import ProfileAvatar from "@/components/atoms/ProfileAvatar";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  styled,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { listOfRoutes } from "./routesConfig";

const StyledWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: theme.palette.surface.interface.base,
  border: `1px solid ${theme.palette.border.seperator}`,
  height: "100%",
  width: "320px",
  padding: theme.spacing(3, 2),
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  borderRadius: theme.spacing(2),
  flexShrink: 0,
}));

const StyledNavigation = styled(Box)(() => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  flexGrow: 1,
  height: "100%",
  maxHeight: "700px",
  width: "100%",
  overflowY: "auto",
}));

const StyledListItem = styled(ListItem)<{
  button?: string;
  selected?: boolean;
  sub?: boolean;
}>(({ theme, selected, sub }) => ({
  color: selected ? theme.palette.text.primary : theme.palette.text.default,
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  gap: theme.spacing(1),
  alignItems: "center",
  width: "100%",
  borderRadius: theme.spacing(1),
  padding: sub ? theme.spacing(0.5, 4) : theme.spacing(1, 2),
  backgroundColor:
    selected && sub ? theme.palette.surface.button.focused : "transparent",
  "&:hover": {
    backgroundColor: theme.palette.surface.button.hoverLight,
    cursor: "pointer",
  },
  "&.Mui-selected": {
    color: selected ? theme.palette.text.primary : theme.palette.text.default,
    backgroundColor: theme.palette.surface.button.focused,
  },
}));

const StyledListItemIcon = styled(ListItemIcon)<{ selected?: boolean }>(
  ({ theme, selected }) => ({
    color: selected ? theme.palette.icon.primary : theme.palette.icon.secondary,
    minWidth: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "32px",
    height: "32px",
  }),
);

const StyledListItemText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  color: isSelected ? theme.palette.text.primary : theme.palette.text.default,
  fontWeight: isSelected ? 600 : 400,
}));

const StyledLabel = styled(Typography)(({ theme }) => ({
  fontSize: "22px !important",
  lineHeight: "28px !important",
  letterSpacing: "0.02em !important",
  fontWeight: "500 !important",
  color: theme.palette.text.default,
  marginTop: theme.spacing(1),
}));

const LeftNavigation = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState<boolean[]>([]);

  const hasRoute = useCallback(
    (path: string) => pathname.includes(path),
    [pathname],
  );

  type Route = {
    path: string;
    icon?: React.ReactNode;
    displayValue: string;
    children?: {
      path: string;
      icon?: React.ReactNode;
      displayValue: string;
    }[];
  };

  const hasActiveChild = useCallback((route: Route, pathname: string) => {
    if (route.children) {
      return route.children.some((child) => pathname.includes(child.path));
    }
    return false;
  }, []);

  const goToRoute = (path: string) => {
    if (path.startsWith("http")) {
      window.open(path, "_blank");
    } else {
      router.push(path);
    }
  };

  const listedRoutes = listOfRoutes;

  useEffect(() => {
    const newOpen = listedRoutes(t).map(
      (route) => hasRoute(route.path) || hasActiveChild(route, pathname),
    );
    setOpen(newOpen);
  }, [hasActiveChild, hasRoute, listedRoutes, pathname, t]);

  const handleClick = (index: number) => {
    const newOpen = [...open];
    newOpen[index] = !newOpen[index];
    setOpen(newOpen);
  };

  return (
    <StyledWrapper>
      <StyledNavigation>
        <Box width="100%">
          <ProfileAvatar size={80} />
          <StyledLabel>
            {t("navigation.welcome", { name: "Admin" })}
          </StyledLabel>
          <Divider sx={{ my: 2 }} />
        </Box>
        <Box mb={2} width="100%">
          <GeneralInput
            style={{
              width: "282px",
              height: "50px",
              flexShrink: 0,
            }}
            type="text"
            placeholder={t("navigation.Browse settings")}
            fullWidth
            showSearchStartIcon
          />
        </Box>
        <List style={{ width: "100%" }}>
          {listOfRoutes(t).map((route: Route, index: number) => {
            const isSelected =
              hasRoute(route.path) || hasActiveChild(route, pathname);

            return route.children ? (
              <Fragment key={index}>
                <List component="div" disablePadding>
                  <StyledListItem
                    button="true"
                    selected={isSelected}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(index);
                    }}
                  >
                    {route?.icon && (
                      <StyledListItemIcon selected={isSelected}>
                        {route.icon}
                      </StyledListItemIcon>
                    )}
                    <StyledListItemText
                      isSelected={isSelected}
                      primary={route.displayValue}
                    />
                    {open[index] ? (
                      <ExpandLessRoundedIcon sx={{ height: 24, width: 24 }} />
                    ) : (
                      <ExpandMoreRoundedIcon sx={{ height: 24, width: 24 }} />
                    )}
                  </StyledListItem>
                </List>
                <Collapse in={open[index]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {route.children.map((child) => (
                      <StyledListItem
                        sub={true}
                        button="true"
                        selected={hasRoute(child.path)}
                        key={child.displayValue}
                        onClick={() => goToRoute(child.path)}
                      >
                        {child.icon && (
                          <StyledListItemIcon selected={hasRoute(child.path)}>
                            {child.icon}
                          </StyledListItemIcon>
                        )}
                        <StyledListItemText
                          isSelected={hasRoute(child.path)}
                          secondary={child.displayValue}
                        />
                      </StyledListItem>
                    ))}
                  </List>
                </Collapse>
              </Fragment>
            ) : (
              <StyledListItem
                button="true"
                key={index}
                selected={hasRoute(route.path)}
                onClick={() => goToRoute(route.path)}
              >
                {route?.icon && (
                  <StyledListItemIcon selected={hasRoute(route.path)}>
                    {route.icon}
                  </StyledListItemIcon>
                )}
                <StyledListItemText primary={route.displayValue} />
                {route.path.startsWith("http") && (
                  <OpenInNewRoundedIcon sx={{ height: 24, width: 24 }} />
                )}
              </StyledListItem>
            );
          })}
        </List>
      </StyledNavigation>
      <OnboardingVersion />
    </StyledWrapper>
  );
};

export default memo(LeftNavigation);
