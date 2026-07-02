"use client";

import React, { FC, useMemo } from "react";

import { GenderType } from "@/types/student";
import FemaleRoundedIcon from "@mui/icons-material/FemaleRounded";
import MaleRoundedIcon from "@mui/icons-material/MaleRounded";
import TransgenderRoundedIcon from "@mui/icons-material/TransgenderRounded";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface GenderDisplayProps {
  gender?: GenderType;
}

const GenderDisplay: FC<GenderDisplayProps> = ({ gender }) => {
  const { t } = useTranslation();

  const { icon: Icon, label } = useMemo(() => {
    switch (gender) {
      case "male":
        return { icon: MaleRoundedIcon, label: t("gender.male") };
      case "female":
        return { icon: FemaleRoundedIcon, label: t("gender.female") };
      case "diverse":
        return { icon: TransgenderRoundedIcon, label: t("gender.diverse") };
      default:
        return { icon: null, label: t("gender.unknown") };
    }
  }, [gender, t]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {Icon ? <Icon fontSize="small" /> : null}
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
};

export default GenderDisplay;
