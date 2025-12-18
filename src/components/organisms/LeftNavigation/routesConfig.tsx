import React from "react";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import RoomPreferencesRoundedIcon from "@mui/icons-material/RoomPreferencesRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";
import { TFunction } from "i18next";

export const listOfRoutes = (t: TFunction) => {
  return [
    {
      path: "/admin/dashboard",
      displayValue: t("navigation.dashboard"),
      icon: <DashboardRoundedIcon />,
    },
    {
      path: "/admin/management",
      displayValue: t("navigation.management"),
      icon: <ManageAccountsRoundedIcon />,
      children: [
        {
          path: "/admin/management/students",
          displayValue: t("navigation.studentManagement"),
          icon: <SchoolRoundedIcon />,
        },
        {
          path: "/admin/management/classes",
          displayValue: t("navigation.classManagement"),
          icon: <RoomPreferencesRoundedIcon />,
        },
      ],
    },
    {
      path: "/admin/settings",
      displayValue: t("navigation.settings"),
      icon: <SettingsRoundedIcon />,
      children: [
        {
          path: "/admin/settings/profile",
          displayValue: t("navigation.profileSettings"),
          icon: <PersonRoundedIcon />,
        },
        {
          path: "/admin/settings/onboarding",
          displayValue: t("navigation.onboardingSettings"),
          icon: <RoomPreferencesRoundedIcon />,
        },
        {
          path: "/admin/settings/agreements",
          displayValue: t("navigation.agreementSettings"),
          icon: <SecurityRoundedIcon />,
        },
        {
          path: "/admin/settings/system",
          displayValue: t("navigation.systemSettings"),
          icon: <MonitorHeartRoundedIcon />,
        },
        {
          path: "/admin/settings/audit",
          displayValue: t("navigation.auditLog"),
          icon: <SyncAltRoundedIcon />,
        },
      ],
    },
  ];
};
