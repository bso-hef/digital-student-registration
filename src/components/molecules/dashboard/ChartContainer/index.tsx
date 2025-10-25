import React from "react";

import { GeneralSkeletonLoader } from "@/components/atoms/GeneralSkeletonLoader";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import { Box, Card, CardContent, Typography, styled } from "@mui/material";

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.surface.interface.base,
  border: `1px solid ${theme.palette.border.seperator}`,
  borderRadius: theme.spacing(1.5),
  boxShadow: "rgba(0, 0, 0, 0.05) 0px 2px 8px",
  height: "100%",
  position: "relative",
  cursor: "grab",
  transition: "all 0.3s ease-in-out",
  "&:active": {
    cursor: "grabbing",
  },
  "&:hover": {
    border: `2px dashed ${theme.palette.border.hover}`,
    boxShadow: "rgba(0, 0, 0, 0.15) 0px 6px 20px",
    transform: "scale(1.01)",
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  "&:last-child": {
    paddingBottom: theme.spacing(3),
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "1.125rem",
  fontWeight: 700,
  color: theme.palette.text.default,
  marginBottom: theme.spacing(2),
}));

const DragHandle = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  opacity: 0.4,
  transition: "opacity 0.2s ease-in-out",
  color: theme.palette.text.secondary,
  cursor: "grab",
  zIndex: 2,
  "&:active": {
    cursor: "grabbing",
  },
  "&:hover": {
    opacity: 0.8,
  },
}));

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  height?: number | string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  children,
  loading = false,
  height = 300,
}) => {
  return (
    <StyledCard>
      <DragHandle className="drag-handle">
        <DragIndicatorRoundedIcon
          sx={{
            fontSize: 24,
          }}
        />
      </DragHandle>
      <StyledCardContent>
        <Title>{title}</Title>
        <Box sx={{ height, width: "100%" }}>
          {loading ? (
            <GeneralSkeletonLoader
              variant="rectangular"
              width="100%"
              height="100%"
            />
          ) : (
            children
          )}
        </Box>
      </StyledCardContent>
    </StyledCard>
  );
};

export default ChartContainer;
