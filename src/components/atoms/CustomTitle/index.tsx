import React from "react";

import { useDeviceTypeDetection } from "@/hooks/useDeviceTypeDetection";
import { Box, Typography, styled } from "@mui/material";

const TitleBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "showMobileView",
})<{ showMobileView: boolean }>(({ theme, showMobileView }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: showMobileView ? "center" : "flex-start",
  justifyContent: "center",
  width: "100%",
  textAlign: showMobileView ? "center" : "left",
  color: theme.palette.text.default,
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "32px !important",
  fontWeight: 600,
  lineHeight: "24px !important",
  color: theme.palette.text.default,
  marginBottom: theme.spacing(2),
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: "24px !important",
  fontWeight: 400,
  lineHeight: "32px !important",
  letterSpacing: "0.115px",
  color: theme.palette.text.information,
  marginBottom: theme.spacing(2),
}));

interface CustomTitleProps {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
}

const CustomTitle = ({ title, subTitle, children }: CustomTitleProps) => {
  const { isMobile, isTabletVertical } = useDeviceTypeDetection();

  const showMobileView = isMobile || isTabletVertical;

  return (
    <TitleBox showMobileView={showMobileView}>
      <Title>{title}</Title>
      <SubTitle>{subTitle}</SubTitle>
      {children}
    </TitleBox>
  );
};

export default CustomTitle;
