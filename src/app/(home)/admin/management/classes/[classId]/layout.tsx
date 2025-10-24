"use client";

import React, { Suspense, useEffect } from "react";

import { AdminSubPageHeader } from "@/components/molecules/AdminSubPageHeader";
import VerticalTabs from "@/components/organisms/VerticalTabs";
import { clearCurrentClass, getClass } from "@/store/actions/classActions";
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
  alignItems: "center",
  justifyContent: "flex-start",
  textAlign: "center",
  width: "100%",
  height: "100%",
  borderRadius: theme.spacing(2),
  color: theme.palette.text.default,
}));

const configureClassTabs = (t: TFunction) => {
  const tabs = [
    {
      label: t("settings.manageClass.classSettings.general"),
      link: "general",
      component: null,
    },
    {
      label: t("settings.manageClass.classSettings.students"),
      link: "students",
      component: null,
    },
  ];

  return tabs;
};

export default function ClassSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { currentClass, loading } = useSelector(
    (state: RootState) => state.class,
  );
  const { classId } = useParams();

  useEffect(() => {
    if (classId && typeof classId === "string") {
      dispatch(getClass(classId));
    }

    return () => {
      dispatch(clearCurrentClass());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  useEffect(() => {
    if (!classId || !pathname) return;
    if (pathname.endsWith(`/${classId}`)) {
      router.replace(`/admin/management/classes/${classId}/general`);
    }
  }, [classId, pathname, router]);

  if (loading || !currentClass.data) {
    return <CircularProgress style={{ margin: "auto" }} />;
  }

  if (!loading && !currentClass.data) {
    router.push("/404");
    return null;
  }

  return (
    <Wrapper>
      <AdminSubPageHeader
        title={t("settings.manageClass.classSettings.settings")}
        subtitle={currentClass.data.name}
        backTo="/admin/management/classes"
        loading={currentClass.loading}
      />
      <Suspense fallback={<CircularProgress />}>
        <VerticalTabs tabs={configureClassTabs(t)}>{children}</VerticalTabs>
      </Suspense>
    </Wrapper>
  );
}
