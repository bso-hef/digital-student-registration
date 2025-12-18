import React from "react";

import StatCard from "@/components/atoms/dashboard/StatCard";
import { QuickStats } from "@/types/dashboard";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ClassRoundedIcon from "@mui/icons-material/ClassRounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

import { DASHBOARD_GRADIENTS } from "@/constants/theme.constants";

interface DraggableStatsGridProps {
  stats: QuickStats;
  order: string[];
  onReorder: (newOrder: string[]) => void;
}

interface SortableStatCardProps {
  id: string;
  label: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
}

const SortableStatCard: React.FC<SortableStatCardProps> = ({
  id,
  label,
  value,
  icon,
  gradient,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <StatCard
        id={id}
        label={label}
        value={value}
        icon={icon}
        gradient={gradient}
      />
    </div>
  );
};

const DraggableStatsGrid: React.FC<DraggableStatsGridProps> = ({
  stats,
  order,
  onReorder,
}) => {
  const { t } = useTranslation();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = order.indexOf(active.id as string);
      const newIndex = order.indexOf(over.id as string);
      const newOrder = arrayMove(order, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  const statConfig: Record<
    string,
    {
      label: string;
      value: number;
      icon: React.ReactNode;
      gradient: string;
    }
  > = {
    totalStudents: {
      label: t("dashboard.quickStats.totalStudents"),
      value: stats.totalStudents,
      icon: <SchoolRoundedIcon sx={{ fontSize: 32 }} />,
      gradient: DASHBOARD_GRADIENTS.TOTAL_STUDENTS.gradient,
    },
    totalClasses: {
      label: t("dashboard.quickStats.totalClasses"),
      value: stats.totalClasses,
      icon: <ClassRoundedIcon sx={{ fontSize: 32 }} />,
      gradient: DASHBOARD_GRADIENTS.TOTAL_CLASSES.gradient,
    },
    unassignedStudents: {
      label: t("dashboard.quickStats.unassignedStudents"),
      value: stats.unassignedStudents,
      icon: <PersonOffRoundedIcon sx={{ fontSize: 32 }} />,
      gradient: DASHBOARD_GRADIENTS.UNASSIGNED.gradient,
    },
    activeClasses: {
      label: t("dashboard.quickStats.activeClasses"),
      value: stats.activeClasses,
      icon: <CheckCircleRoundedIcon sx={{ fontSize: 32 }} />,
      gradient: DASHBOARD_GRADIENTS.ACTIVE_CLASSES.gradient,
    },
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={order} strategy={rectSortingStrategy}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {order?.map((id) => {
            const config = statConfig[id];
            if (!config) return null;
            return (
              <SortableStatCard
                key={id}
                id={id}
                label={config.label}
                value={config.value}
                icon={config.icon}
                gradient={config.gradient}
              />
            );
          })}
        </Box>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableStatsGrid;
