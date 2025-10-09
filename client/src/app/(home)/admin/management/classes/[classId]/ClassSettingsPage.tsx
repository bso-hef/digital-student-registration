import React, { Suspense, memo } from "react";

import VerticalTabs from "@/components/organisms/VerticalTabs";
import { AppDispatch } from "@/store/store";
import { Box, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/reducers";

const configureClassTabs = ({ values, classId, submitHandlers, t }) => {
  const tabs = [
    {
      label: "General",
      link: "general",
      component: <Box>General</Box>,
    },
    {
      label: "Students",
      link: "students",
      component: <Box>Students</Box>,
    },
    {
      label: "Settings",
      link: "settings",
      component: <Box>Settings</Box>,
    },
  ];

  return tabs;
};

const ClassSettingsPage = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const { currentClass, loading } = useSelector(
    (state: RootState) => state.class,
  );
  const { id: classId } = useParams();

  const loadComponent = () => {
    if (currentClass) {
      return (
        <Suspense fallback={<CircularProgress />}>
          <VerticalTabs
            tabs={configureClassTabs({
              values: settings,
              queueId,
              submitHandlers,
              availableMembers,
              t,
            })}
          />
        </Suspense>
      );
    } else {
      return history("/error/404");
    }
  };

  return <div>ClassSettingsPage</div>;
};

export default memo(ClassSettingsPage);
