"use client";

import React, { Fragment } from "react";

import { GeneralSkeletonLoader } from "@/components/atoms/GeneralSkeletonLoader";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import { updateClass } from "@/store/actions/classActions";
import { AppDispatch } from "@/store/store";
import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, styled } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Field, FieldProps, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import AppleSwitch from "@/components/atoms/AppleSwitch";

import { RootState } from "@/store/reducers";

const StyledBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  flex: 1,
  minHeight: 0,
  overflow: "auto",
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  ...applicationScrollbar(theme),
}));

const StyledHalfBox = styled(Box)(({ theme }) => ({
  width: "50%",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  grade: yup
    .number()
    .nullable()
    .min(0)
    .max(14, "Grade must be between 0 and 14"),
  schoolYearFrom: yup.date().nullable().required("Start date is required"),
  schoolYearTo: yup.date().nullable().required("End date is required"),
  isVocational: yup.boolean().required(),
  requiresEmployerInfo: yup.boolean().required(),
  active: yup.boolean().required(),
});

const GeneralClassSettingsTab = () => {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const { currentClass, loading } = useSelector(
    (state: RootState) => state.class,
  );

  const initialValues = {
    name: currentClass?.data?.name || "",
    grade: currentClass?.data?.grade || null,
    schoolYearFrom: currentClass?.data?.schoolYearFrom
      ? dayjs(currentClass?.data?.schoolYearFrom)
      : null,
    schoolYearTo: currentClass?.data?.schoolYearTo
      ? dayjs(currentClass?.data?.schoolYearTo)
      : null,
    isVocational: currentClass?.data?.isVocational || false,
    requiresEmployerInfo: currentClass?.data?.requiresEmployerInfo || false,
    active: currentClass?.data?.active || false,
  };

  const loaderCount = 2;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={(values) => {
        if (currentClass?.data?._id) {
          const patch = {
            name: values.name,
            grade: values.grade,
            schoolYearFrom: values.schoolYearFrom?.toDate() || null,
            schoolYearTo: values.schoolYearTo?.toDate() || null,
            isVocational: values.isVocational,
            requiresEmployerInfo: values.requiresEmployerInfo,
            active: values.active,
          };
          dispatch(updateClass(currentClass?.data?._id, patch));
        }
      }}
    >
      {({ dirty, isSubmitting, handleSubmit, values, setFieldValue }) => (
        <Fragment>
          <AdminSettingsHeader
            isSubHeader
            title={t("settings.manageClass.classSettings.general")}
            onSave={handleSubmit}
            disabled={!dirty || isSubmitting || loading}
          />
          <StyledBox>
            {loading ? (
              <Fragment>
                {Array.from({ length: loaderCount }).map((_, index) => (
                  <GeneralSkeletonLoader
                    key={index}
                    variant="text"
                    animation="wave"
                    width="100%"
                    height={60}
                  />
                ))}
              </Fragment>
            ) : (
              <Fragment>
                <StyledHalfBox>
                  <Form>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <Field
                        component={TextField}
                        name="name"
                        type="text"
                        label={t("settings.manageClass.className")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="grade"
                        type="number"
                        label={t("settings.manageClass.grade")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box display="flex" flexDirection="column" gap={2}>
                          <DatePicker
                            label={t("settings.manageClass.schoolYearFrom")}
                            value={values.schoolYearFrom}
                            onChange={(newValue) =>
                              setFieldValue("schoolYearFrom", newValue)
                            }
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                          <DatePicker
                            label={t("settings.manageClass.schoolYearTo")}
                            value={values.schoolYearTo}
                            onChange={(newValue) =>
                              setFieldValue("schoolYearTo", newValue)
                            }
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        </Box>
                      </LocalizationProvider>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          mt: 1,
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <Field name="isVocational">
                            {({ field, form }: FieldProps) => (
                              <>
                                <AppleSwitch
                                  checked={field.value}
                                  onChange={(e) =>
                                    form.setFieldValue(
                                      field.name,
                                      e.target.checked,
                                    )
                                  }
                                />
                                <Box sx={{ fontWeight: 600 }}>
                                  {t("settings.manageClass.isVocational")}
                                </Box>
                              </>
                            )}
                          </Field>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                          <Field name="requiresEmployerInfo">
                            {({ field, form }: FieldProps) => (
                              <>
                                <AppleSwitch
                                  checked={field.value}
                                  onChange={(e) =>
                                    form.setFieldValue(
                                      field.name,
                                      e.target.checked,
                                    )
                                  }
                                />
                                <Box sx={{ fontWeight: 600 }}>
                                  {t(
                                    "settings.manageClass.requiresEmployerInfo",
                                  )}
                                </Box>
                              </>
                            )}
                          </Field>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                          <Field name="active">
                            {({ field, form }: FieldProps) => (
                              <>
                                <AppleSwitch
                                  checked={field.value}
                                  onChange={(e) =>
                                    form.setFieldValue(
                                      field.name,
                                      e.target.checked,
                                    )
                                  }
                                />
                                <Box sx={{ fontWeight: 600 }}>
                                  {t("settings.manageClass.isClassActive")}
                                </Box>
                              </>
                            )}
                          </Field>
                        </Box>
                      </Box>
                    </Box>
                  </Form>
                </StyledHalfBox>
                <StyledHalfBox>{/* future content */}</StyledHalfBox>
              </Fragment>
            )}
          </StyledBox>
        </Fragment>
      )}
    </Formik>
  );
};

export default GeneralClassSettingsTab;
