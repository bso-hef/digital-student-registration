"use client";

import React, { Fragment, Suspense, useCallback } from "react";

import {
  Box,
  CircularProgress,
  List,
  ListItemButton,
  ListItemButtonProps,
  ListItemText,
  ListItemTextProps,
  styled,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

export type VerticalTab = {
  label: string;
  link: string;
  component: React.ReactNode;
};

export type VerticalTabsProps = {
  tabs: VerticalTab[];
  showSpinnerFallback?: boolean;
  children?: React.ReactNode;
};

const Root = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.palette.surface.interface.base,
  backgroundImage: "unset",
  color: theme.palette.text.default,
  display: "flex",
  minHeight: 0,
  width: "100%",
  borderRadius: theme.spacing(2),
}));

const LeftList = styled(List)(({ theme }) => ({
  paddingTop: theme.spacing(1.5),
  maxWidth: 230,
  width: "100%",
}));

const RightContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  width: "100%",
  minHeight: 0,
  borderLeft: `1px solid ${theme.palette.border.seperator}`,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}));

type StyledListItemExtraProps = { $selected?: boolean } & ListItemButtonProps;
const StyledListItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "$selected",
})<StyledListItemExtraProps>(({ theme, $selected }) => ({
  height: 52,
  fontSize: "16px",
  color: theme.palette.text.default,
  width: 230,
  "&:hover": {
    backgroundColor: theme.palette.surface.button.hoverLight,
    cursor: "pointer",
  },
  padding: $selected
    ? theme.spacing(0, 0.5, 0, 4.5)
    : theme.spacing(0, 0.5, 0, 5),
  borderLeft: $selected
    ? `4px solid ${theme.palette.border.primary}`
    : "4px solid transparent",
  "&.Mui-selected": {
    background: `${theme.palette.surface.button.hoverLight} !important`,
  },
  "&.Mui-selected .MuiListItemText-root": {
    color: theme.palette.text.primary,
    fontWeight: 500,
  },
}));

type StyledListItemTextExtraProps = { $selected?: boolean } & ListItemTextProps;
const StyledListItemText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== "$selected",
})<StyledListItemTextExtraProps>(({ theme, $selected }) => ({
  "& .MuiListItemText-primary": {
    fontSize: "16px",
    fontWeight: $selected ? 500 : 400,
    color: $selected ? theme.palette.text.primary : theme.palette.text.default,
  },
}));

export default function VerticalTabs({
  tabs,
  showSpinnerFallback = true,
  children,
}: VerticalTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const gotoRoute = (path: string) => router.push(path);

  const isTabSelected = useCallback(
    (tabLink: string) => {
      if (!pathname) return false;
      if (pathname === tabLink) return true;

      const pathSegments = pathname.split("/").filter(Boolean);
      const currentSegment = pathSegments[pathSegments.length - 1];

      const tabSegments = tabLink.split("/").filter(Boolean);
      const tabLast = tabSegments[tabSegments.length - 1];

      return currentSegment === tabLast;
    },
    [pathname],
  );

  return (
    <Suspense
      fallback={
        showSpinnerFallback ? (
          <CircularProgress
            sx={{
              m: "auto",
              position: "absolute",
              inset: 0,
            }}
          />
        ) : (
          <></>
        )
      }
    >
      <Root>
        <LeftList>
          {tabs.map((tab) => {
            const selected = isTabSelected(tab.link);
            return (
              <StyledListItem
                key={tab.link}
                selected={selected}
                $selected={selected}
                onClick={() => gotoRoute(tab.link)}
                aria-selected={selected}
              >
                <StyledListItemText $selected={selected} primary={tab.label} />
              </StyledListItem>
            );
          })}
        </LeftList>
        <RightContainer>{children}</RightContainer>
      </Root>
    </Suspense>
  );
}
