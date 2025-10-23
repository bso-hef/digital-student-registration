import React from "react";

import { STUDENT_STATUS } from "@/constants/general.constants";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import FileDownloadDoneRoundedIcon from "@mui/icons-material/FileDownloadDoneRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import { Box, Typography, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  width: "100%",
  maxWidth: "max-content",
}));

const StyledText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.default,
  fontSize: "16px !important",
  lineHeight: "24px",
}));

const StudentStatus = ({ studentStatus }: { studentStatus: string }) => {
  const { t } = useTranslation();

  let icon: React.ReactNode;
  let text: string;

  switch (studentStatus) {
    case STUDENT_STATUS.IMPORTED:
      icon = <FileDownloadDoneRoundedIcon fontSize="small" />;
      text = t("general.Imported");
      break;
    case STUDENT_STATUS.INVITED:
      icon = <MailOutlineRoundedIcon fontSize="small" />;
      text = t("general.Invited");
      break;
    case STUDENT_STATUS.ONBOARDED:
      icon = <CheckCircleRoundedIcon fontSize="small" />;
      text = t("general.Onboarded");
      break;
    default:
      icon = <HelpOutlineRoundedIcon fontSize="small" />;
      text = t("general.Unknown");
      break;
  }

  return (
    <StyledBox>
      {icon}
      <StyledText>{text}</StyledText>
    </StyledBox>
  );
};

export default StudentStatus;
