"use client";

import StepForm from "@/components/organisms/StepForm";
import { Box, styled } from "@mui/material";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  textAlign: "center",
  width: "100%",
  height: "100%",
  color: theme.palette.text.default,
}));

interface StudentIdProps {
  params: { studentId: string };
}

const StudentId = ({ params }: StudentIdProps) => {
  const { studentId } = params;

  return (
    <Wrapper>
      <StepForm />
    </Wrapper>
  );
};

export default StudentId;
