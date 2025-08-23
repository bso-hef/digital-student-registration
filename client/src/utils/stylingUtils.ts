"use client";

import { Theme } from "@mui/material";

import { THEME } from "../constants/generalConstants";

export const applicationScrollbar = (theme: Theme) => {
  const isDarkTheme = theme.palette.mode === THEME.DARK;

  return {
    "&::-webkit-scrollbar": {
      width: 4,
      height: 4,
      borderRadius: 4,
    },
    "&::-webkit-scrollbar-track": {
      WebkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      backgroundColor: isDarkTheme ? "transparent" : "#FAFAFA",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "4px",
      backgroundColor: isDarkTheme ? "#4DBFC3" : "#CFD5DE",
      "&:hover": {
        backgroundColor: isDarkTheme ? "#82D7DA" : "transparent",
      },
    },
  };
};

export const capitalizeFirstLetter = (s: string) => {
  if (typeof s !== "string") return "";

  const lowerCased = s.toLowerCase();

  return lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1);
};
