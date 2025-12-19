"use client";

import React from "react";

import { Box, Skeleton, styled } from "@mui/material";

const SkeletonForm = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  width: "100%",
  height: "auto",
  gap: theme.spacing(2),
}));

const SkeletonSection = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
}));

const SkeletonField = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
}));

// Generic form skeleton with configurable rows
interface FormSkeletonProps {
  rows?: number;
  hasHeader?: boolean;
  headerWidth?: string;
}

const FormSkeleton: React.FC<FormSkeletonProps> = ({
  rows = 4,
  hasHeader = true,
  headerWidth = "40%",
}) => {
  return (
    <SkeletonForm>
      {hasHeader && (
        <Skeleton
          variant="text"
          width={headerWidth}
          height={28}
          sx={{ mb: 1 }}
        />
      )}
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonSection key={index}>
          <SkeletonField variant="rounded" height={56} width="100%" />
          <SkeletonField variant="rounded" height={56} width="100%" />
        </SkeletonSection>
      ))}
    </SkeletonForm>
  );
};

// Welcome form skeleton (minimal)
export const WelcomeFormSkeleton: React.FC = () => (
  <SkeletonForm>
    <Skeleton variant="text" width="60%" height={40} />
    <Skeleton variant="text" width="80%" height={24} />
    <Skeleton variant="text" width="70%" height={24} />
  </SkeletonForm>
);

// General form skeleton (most fields)
export const GeneralFormSkeleton: React.FC = () => (
  <FormSkeleton rows={6} headerWidth="50%" />
);

// Origin form skeleton
export const OriginFormSkeleton: React.FC = () => (
  <FormSkeleton rows={3} headerWidth="45%" />
);

// Address form skeleton
export const AddressFormSkeleton: React.FC = () => (
  <FormSkeleton rows={4} headerWidth="40%" />
);

// Parents form skeleton
export const ParentsFormSkeleton: React.FC = () => (
  <SkeletonForm>
    <Skeleton variant="text" width="35%" height={28} sx={{ mb: 1 }} />
    <SkeletonSection>
      <SkeletonField variant="rounded" height={56} width="100%" />
      <SkeletonField variant="rounded" height={56} width="100%" />
    </SkeletonSection>
    <SkeletonSection>
      <SkeletonField variant="rounded" height={56} width="100%" />
      <SkeletonField variant="rounded" height={56} width="100%" />
    </SkeletonSection>
    <Skeleton variant="text" width="35%" height={28} sx={{ mt: 2, mb: 1 }} />
    <SkeletonSection>
      <SkeletonField variant="rounded" height={56} width="100%" />
      <SkeletonField variant="rounded" height={56} width="100%" />
    </SkeletonSection>
  </SkeletonForm>
);

// Pre-education form skeleton
export const PreEducationFormSkeleton: React.FC = () => (
  <FormSkeleton rows={3} headerWidth="55%" />
);

// Training form skeleton
export const TrainingFormSkeleton: React.FC = () => (
  <FormSkeleton rows={4} headerWidth="45%" />
);

// Company contact form skeleton
export const CompanyContactFormSkeleton: React.FC = () => (
  <FormSkeleton rows={5} headerWidth="50%" />
);

// Agreements form skeleton
export const AgreementsFormSkeleton: React.FC = () => (
  <SkeletonForm>
    <Skeleton variant="text" width="45%" height={28} sx={{ mb: 1 }} />
    <SkeletonField variant="rounded" height={80} width="100%" />
    <SkeletonField variant="rounded" height={80} width="100%" />
    <SkeletonField variant="rounded" height={80} width="100%" />
  </SkeletonForm>
);

// Summary form skeleton
export const SummaryFormSkeleton: React.FC = () => (
  <SkeletonForm>
    <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
    {Array.from({ length: 4 }).map((_, index) => (
      <Box key={index} sx={{ width: "100%", mb: 2 }}>
        <Skeleton variant="text" width="30%" height={24} sx={{ mb: 1 }} />
        <SkeletonField variant="rounded" height={100} width="100%" />
      </Box>
    ))}
  </SkeletonForm>
);

// Completion form skeleton
export const CompletionFormSkeleton: React.FC = () => (
  <SkeletonForm sx={{ alignItems: "center" }}>
    <Skeleton variant="circular" width={80} height={80} />
    <Skeleton variant="text" width="60%" height={40} />
    <Skeleton variant="text" width="80%" height={24} />
  </SkeletonForm>
);

// Get form skeleton by step number
export const getFormSkeleton = (step: number): React.ReactNode => {
  switch (step) {
    case 0:
      return <WelcomeFormSkeleton />;
    case 1:
      return <GeneralFormSkeleton />;
    case 2:
      return <OriginFormSkeleton />;
    case 3:
      return <AddressFormSkeleton />;
    case 4:
      return <ParentsFormSkeleton />;
    case 5:
      return <PreEducationFormSkeleton />;
    case 6:
      return <TrainingFormSkeleton />;
    case 7:
      return <CompanyContactFormSkeleton />;
    case 8:
      return <AgreementsFormSkeleton />;
    case 9:
      return <SummaryFormSkeleton />;
    case 10:
      return <CompletionFormSkeleton />;
    default:
      return <FormSkeleton rows={4} />;
  }
};
