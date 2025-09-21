import React from "react";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
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
      icon: null,
      children: [
        {
          path: "/admin/management/students",
          displayValue: t("navigation.studentManagement"),
          icon: null,
        },
        {
          path: "/admin/management/classes",
          displayValue: t("navigation.classesManagement"),
          icon: null,
        },
      ],
    },
    {
      path: "/admin/data",
      displayValue: t("navigation.data"),
      icon: null,
      children: [
        {
          path: "/admin/data/import",
          displayValue: t("navigation.importData"),
          icon: null,
        },
        {
          path: "/admin/data/export",
          displayValue: t("navigation.exportData"),
          icon: null,
        },
        {
          path: "/admin/data/overview",
          displayValue: t("navigation.dataOverview"),
          icon: null,
        },
      ],
    },
    {
      path: "/admin/settings",
      displayValue: t("navigation.settings"),
      icon: null,
      children: [
        {
          path: "/admin/settings/onboarding",
          displayValue: t("navigation.onboardingSettings"),
          icon: null,
        },
        {
          path: "/admin/settings/agreements",
          displayValue: t("navigation.agreementSettings"),
          icon: null,
        },
        {
          path: "/admin/settings/integrations",
          displayValue: t("navigation.integrationSettings"),
          icon: null,
        },
        {
          path: "/admin/settings/audit",
          displayValue: t("navigation.auditLog"),
          icon: null,
        },
      ],
    },
  ];
};
