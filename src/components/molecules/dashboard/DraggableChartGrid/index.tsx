import React from "react";

import ClassDistributionChart from "@/components/organisms/dashboard/ClassDistributionChart";
import RegistrationTrendChart from "@/components/organisms/dashboard/RegistrationTrendChart";
import StudentStatusChart from "@/components/organisms/dashboard/StudentStatusChart";
import {
  DashboardStats,
  GradeDistribution,
  RecentActivityItem,
  RegistrationTrendItem,
  StudentStatusBreakdown,
} from "@/types/dashboard";
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
import { Box } from "@mui/material";

import RecentActivityWidget from "../RecentActivityWidget";

interface DraggableChartGridProps {
  stats: DashboardStats | null;
  loading: boolean;
  recentActivity: RecentActivityItem[];
  activityLoading: boolean;
  order: string[];
  onReorder: (newOrder: string[]) => void;
}

interface SortableChartWrapperProps {
  id: string;
  children: React.ReactNode;
}

const SortableChartWrapper: React.FC<SortableChartWrapperProps> = ({
  id,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const DraggableChartGrid: React.FC<DraggableChartGridProps> = ({
  stats,
  loading,
  recentActivity,
  activityLoading,
  order,
  onReorder,
}) => {
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

  const chartComponents: Record<string, React.ReactNode> = {
    registrationTrend: (
      <RegistrationTrendChart
        data={stats?.registrationTrend || ([] as RegistrationTrendItem[])}
        loading={loading}
      />
    ),
    studentStatus: (
      <StudentStatusChart
        data={
          stats?.studentStatusBreakdown ||
          ({
            imported: 0,
            invited: 0,
            onboarded: 0,
            other: 0,
          } as StudentStatusBreakdown)
        }
        loading={loading}
      />
    ),
    classDistribution: (
      <ClassDistributionChart
        data={stats?.gradeDistribution || ([] as GradeDistribution[])}
        loading={loading}
      />
    ),
    recentActivity: (
      <RecentActivityWidget
        activities={recentActivity}
        loading={activityLoading}
      />
    ),
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
              lg: "repeat(2, 1fr)",
            },
            gap: 3,
          }}
        >
          {order.map((id) => {
            const component = chartComponents[id];
            if (!component) return null;
            return (
              <SortableChartWrapper key={id} id={id}>
                {component}
              </SortableChartWrapper>
            );
          })}
        </Box>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableChartGrid;
