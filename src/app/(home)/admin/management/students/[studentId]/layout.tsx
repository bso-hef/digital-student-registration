"use client";

import React, { Suspense, useEffect } from "react";

import { AdminSubPageHeader } from "@/components/molecules/AdminSubPageHeader";
import VerticalTabs from "@/components/organisms/VerticalTabs";
import {
  clearCurrentStudent,
  getStudent,
} from "@/store/actions/studentActions";
import { AppDispatch } from "@/store/store";
import { Box, CircularProgress, styled } from "@mui/material";
import { TFunction } from "i18next";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/reducers";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
  textAlign: "center",
  width: "100%",
  flex: 1,
  minHeight: 0,
  borderRadius: theme.spacing(2),
  color: theme.palette.text.default,
  overflow: "hidden",
}));

const configureStudentTabs = (t: TFunction) => {
  const tabs = [
    {
      label: t("settings.manageStudent.studentSettings.tabs.general"),
      link: "general",
      component: null,
    },
    {
      label: t("settings.manageStudent.studentSettings.tabs.contact"),
      link: "contact",
      component: null,
    },
    {
      label: t("settings.manageStudent.studentSettings.tabs.education"),
      link: "education",
      component: null,
    },
    {
      label: t("settings.manageStudent.studentSettings.tabs.guardians"),
      link: "contacts",
      component: null,
    },
  ];

  return tabs;
};

export default function StudentSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { currentStudent, currentStudentLoading } = useSelector(
    (state: RootState) => state.student,
  );
  const { studentId } = useParams();

  useEffect(() => {
    if (studentId && typeof studentId === "string") {
      dispatch(getStudent(studentId));
    }

    return () => {
      dispatch(clearCurrentStudent());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  useEffect(() => {
    if (!studentId || !pathname) return;
    if (pathname.endsWith(`/${studentId}`)) {
      router.replace(`/admin/management/students/${studentId}/general`);
    }
  }, [studentId, pathname, router]);

  if (currentStudentLoading || !currentStudent) {
    return <CircularProgress style={{ margin: "auto" }} />;
  }

  if (!currentStudentLoading && !currentStudent) {
    router.push("/404");
    return null;
  }

  return (
    <Wrapper>
      <AdminSubPageHeader
        title={t("settings.manageStudent.studentSettings.settings")}
        subtitle={`${currentStudent.firstName} ${currentStudent.lastName}`}
        backTo="/admin/management/students"
        loading={currentStudentLoading}
      />
      <Suspense fallback={<CircularProgress />}>
        <VerticalTabs tabs={configureStudentTabs(t)}>{children}</VerticalTabs>
      </Suspense>
    </Wrapper>
  );
}
