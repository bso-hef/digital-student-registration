"use client";

import React from "react";

import { Skeleton, SkeletonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export interface GeneralSkeletonLoaderProps extends SkeletonProps {
  isAvatar?: boolean;
  height?: number | string;
  width?: number | string;
}

const StyledSkeleton = styled(Skeleton, {
  shouldForwardProp: (prop) => prop !== "isAvatar",
})<{ isAvatar?: boolean }>(({ theme, isAvatar }) => ({
  backgroundColor: isAvatar
    ? theme.palette.icon?.disabled
    : theme.palette.surface?.interface?.active,
}));

export const GeneralSkeletonLoader: React.FC<GeneralSkeletonLoaderProps> = ({
  animation = "wave",
  variant = "rounded",
  height,
  width,
  isAvatar = false,
  ...otherProps
}) => {
  return (
    <StyledSkeleton
      isAvatar={isAvatar}
      animation={animation}
      variant={variant}
      height={height}
      width={width}
      {...otherProps}
    />
  );
};
