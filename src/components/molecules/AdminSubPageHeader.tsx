"use client";

import React, { Fragment, memo } from "react";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { Box, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";

import { GeneralSkeletonLoader } from "../atoms/GeneralSkeletonLoader";
import SmallIconButton from "../atoms/buttons/SmallIconButton";

export interface AdminSubPageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  backTo?: string;
  onHandleBack?: () => void;
  loading?: boolean;
}

const Root = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 3),
  backgroundColor: theme.palette.surface.interface?.base,
  backgroundImage: "unset",
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.border.seperator}`,
  gap: theme.spacing(0.5),
  width: "100%",
  borderRadius: theme.spacing(2, 2, 0, 0),
}));

const Title = styled(Typography)(({ theme }) => ({
  textTransform: "uppercase",
  fontSize: "12px !important",
  letterSpacing: "0.4px",
  lineHeight: "166% !important",
  fontWeight: 400,
  color: theme.palette.text.information,
  textAlign: "left",
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: "16px !important",
  fontWeight: "500 !important",
  lineHeight: "20px !important",
  color: theme.palette.text.default,
  textAlign: "left",
}));

const Column = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

export const AdminSubPageHeader: React.FC<AdminSubPageHeaderProps> = memo(
  ({ title, subtitle, backTo, onHandleBack, loading }) => {
    const router = useRouter();
    const theme = useTheme();

    const handleBackClickEvent = () => {
      if (onHandleBack) {
        onHandleBack();
      }
      if (backTo && backTo.trim()) {
        router.push(backTo);
      } else {
        router.back();
      }
    };

    return (
      <Root>
        <SmallIconButton
          icon={
            <ChevronLeftRoundedIcon
              style={{ color: theme.palette.icon?.secondary }}
            />
          }
          onAction={handleBackClickEvent}
          bigIcon
        />

        <Column>
          {loading ? (
            <GeneralSkeletonLoader
              variant="rounded"
              width="200px"
              height="41px"
            />
          ) : (
            <Fragment>
              <Title>{title}</Title>
              <Subtitle>{subtitle}</Subtitle>
            </Fragment>
          )}
        </Column>
      </Root>
    );
  },
);

AdminSubPageHeader.displayName = "AdminSubPageHeader";
