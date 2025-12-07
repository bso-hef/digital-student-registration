"use client";

import React, { Fragment, useCallback, useEffect, useState } from "react";

import ActionsTooltip from "@/components/atoms/ActionsTooltip";
import GeneralInput from "@/components/atoms/GeneralInput";
import OnboardingVersion from "@/components/atoms/OnboardingVersion";
import ProfileAvatar from "@/components/atoms/ProfileAvatar";
import GeneralMenu from "@/components/atoms/menus/GeneralMenu";
import { logoutUser } from "@/store/actions/authActions";
import { AppDispatch, RootState } from "@/store/store";
import { getName } from "@/utils/string.utils";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

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
    selected && sub ? theme.palette.surface.button.hoverLight : "transparent",
  "&:hover": {
    backgroundColor: selected
      ? theme.palette.surface.button.focused
      : theme.palette.surface.button.hoverLight,
    cursor: "pointer",
  },
  "&.Mui-selected": {
    color: selected ? theme.palette.text.primary : theme.palette.text.default,
    backgroundColor: theme.palette.surface.button.hoverLight,
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
})<{ selected?: boolean }>(({ theme, selected }) => ({
  color: selected ? theme.palette.text.primary : theme.palette.text.default,
  fontSize: "16px",
  fontWeight: selected ? 600 : 400,
}));

const WelcomeContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

const WelcomeText = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  lineHeight: "20px",
  fontWeight: 400,
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1),
}));

const NameText = styled(Typography)(({ theme }) => ({
  fontSize: "22px",
  lineHeight: "28px",
  letterSpacing: "0.02em",
  fontWeight: 500,
  color: theme.palette.text.default,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "100%",
}));

const JobTitleText = styled(Typography)(({ theme }) => ({
  fontSize: "13px",
  lineHeight: "18px",
  fontWeight: 400,
  color: theme.palette.text.secondary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "100%",
}));

const LeftNavigation = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [open, setOpen] = useState<boolean[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    const result = await dispatch(logoutUser());
    if (result.success) {
      router.push("/login");
    }
  };

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

  const [search, setSearch] = useState("");

  const listedRoutes = listOfRoutes;

  const filteredRoutes = listedRoutes(t).filter((route) => {
    if (search === "") {
      return true;
    }

    if (route.displayValue.toLowerCase().includes(search.toLowerCase())) {
      return true;
    }

    if (route.children) {
      return route.children.some((child) =>
        child.displayValue.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return false;
  });

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
          <Box display="flex" justifyContent="center" width="100%">
            <ActionsTooltip title={t("navigation.openMenu")} placement="bottom">
              <Box
                onClick={handleAvatarClick}
                sx={{
                  cursor: "pointer",
                  "&:hover": { opacity: 0.8 },
                  width: 92,
                  height: 92,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: menuAnchor
                    ? `3px solid ${theme.palette.primary.main}`
                    : "3px solid transparent",
                  transition: "border-color 0.2s ease-in-out",
                }}
              >
                <ProfileAvatar
                  size={80}
                  avatar={user?.avatar}
                  initialsFallback={getName(user)}
                />
              </Box>
            </ActionsTooltip>
            <GeneralMenu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
              menuItems={[
                {
                  label: t("navigation.dashboard"),
                  startIcon: <DashboardRoundedIcon />,
                  onClick: () => router.push("/admin/dashboard"),
                },
                {
                  label: t("navigation.profileSettings"),
                  startIcon: <ManageAccountsRoundedIcon />,
                  onClick: () => router.push("/admin/settings/profile"),
                },
                {
                  label: t("navigation.systemSettings"),
                  startIcon: <MonitorHeartRoundedIcon />,
                  onClick: () => router.push("/admin/settings/system"),
                },
                {
                  label: t("navigation.Logout"),
                  startIcon: <LogoutRoundedIcon color="error" />,
                  onClick: handleLogout,
                },
              ]}
            />
          </Box>
          <WelcomeContainer>
            <WelcomeText>
              {t("navigation.welcome", { name: "" }).trim()}
            </WelcomeText>
            <NameText>{getName(user) || "Admin"}</NameText>
            {user?.jobTitle && <JobTitleText>{user.jobTitle}</JobTitleText>}
          </WelcomeContainer>
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
        <List style={{ width: "100%" }}>
          {filteredRoutes.map((route: Route, index: number) => {
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
                      selected={isSelected}
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
                    {route.children
                      .filter((child) => {
                        if (search === "") {
                          return true;
                        }

                        if (
                          route.displayValue
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        ) {
                          return true;
                        }

                        return child.displayValue
                          .toLowerCase()
                          .includes(search.toLowerCase());
                      })
                      .map((child) => (
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
                            primary={child.displayValue}
                            selected={hasRoute(child.path)}
                            primaryTypographyProps={{
                              fontSize: "16px !important",
                              fontWeight: hasRoute(child.path) ? 500 : 400,
                              color: hasRoute(child.path)
                                ? theme.palette.text.primary
                                : theme.palette.text.default,
                            }}
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

export default LeftNavigation;
