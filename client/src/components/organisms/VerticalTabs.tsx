"use client";

import React, { ReactNode, Suspense } from "react";

import {
  Box,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { usePathname, useRouter } from "next/navigation";

export type VerticalTab = {
  label: string;
  href: string; // absolut oder relativ, z.B. "/settings/profile" oder "profile"
};

export type VerticalTabsProps = {
  tabs: VerticalTab[];
  /** Optional: fixe Breite der Leiste (px). Default 230. */
  railWidth?: number;
  /** Content der rechten Seite (wird vom Next.js-Routing geliefert) */
  children?: ReactNode;
};

const Root = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  height: "100%",
  // Falls du Custom Theme Keys hast, ersetze die folgenden drei:
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  borderRadius: theme.spacing(0.5),
}));

const Rail = styled(List, {
  shouldForwardProp: (p) => p !== "railwidth",
})<{ railwidth: number }>(({ theme, railwidth }) => ({
  paddingTop: theme.spacing(1.5),
  maxWidth: railwidth,
  width: "100%",
}));

const Container = styled(Box)(({ theme }) => ({
  width: "100%",
  position: "relative",
  borderLeft: `1px solid ${theme.palette.divider}`,
}));

const StyledItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "selected",
})<{ selected?: boolean }>(({ theme, selected }) => ({
  height: 52,
  width: "100%",
  fontSize: 16,
  // text.default -> text.secondary
  color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
  // surface.button.hoverLight -> action.hover
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    cursor: "pointer",
  },
  paddingTop: 0,
  paddingBottom: 0,
  paddingRight: theme.spacing(0.5),
  paddingLeft: selected ? theme.spacing(4.5) : theme.spacing(5),
  borderLeft: selected
    ? `4px solid ${theme.palette.primary.main}` // border.primary -> primary.main
    : "4px solid transparent",
  "&.Mui-selected": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== "selected",
})<{ selected?: boolean }>(({ theme, selected }) => ({
  "& .MuiListItemText-primary": {
    fontSize: 16,
    fontWeight: selected ? 500 : 400,
    color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
  },
}));

export function VerticalTabs({
  tabs,
  railWidth = 230,
  children,
}: VerticalTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isSelected = (href: string) => {
    if (!pathname) return false;
    // Exakt gleich?
    if (pathname === href) return true;

    // Falls href/URL-Teile nur im letzten Segment verglichen werden sollen:
    const seg = pathname.split("/").filter(Boolean).at(-1);
    const hrefSeg = href.split("/").filter(Boolean).at(-1);
    return seg === hrefSeg;
  };

  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <Root>
        <Rail railwidth={railWidth}>
          {tabs.map((tab) => {
            const selected = isSelected(tab.href);
            return (
              <StyledItem
                key={tab.href}
                selected={selected}
                onClick={() => router.push(tab.href)}
              >
                <StyledText selected={selected} primary={tab.label} />
              </StyledItem>
            );
          })}
        </Rail>

        <Container>
          {/* 
            Rechte Seite: 
            - Normalerweise rendert hier der verschachtelte Route-Content über Next.js.
            - Du kannst zusätzlich eine Fallback-Navigation auf den ersten Tab machen,
              wenn keine Kind-Route aktiv ist. Das lässt du aber i.d.R. dem Router/Layouts.
          */}
          {children ?? null}
        </Container>
      </Root>
    </Suspense>
  );
}

export default VerticalTabs;
