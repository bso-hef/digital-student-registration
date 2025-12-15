"use client";

import React, { Fragment, useEffect } from "react";

import { GeneralSkeletonLoader } from "@/components/atoms/GeneralSkeletonLoader";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import ClassAutocomplete from "@/components/molecules/ClassAutocomplete";
import { getClasses } from "@/store/actions/classActions";
import { updateStudent } from "@/store/actions/studentActions";
import { AppDispatch } from "@/store/store";
import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, Divider, Typography, styled } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

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

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "16px !important",
  lineHeight: "20px !important",
  fontWeight: 500,
  textAlign: "left",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

const validationSchema = yup.object({
  schoolEntryDate: yup.date().nullable(),
  previousSchool: yup.string().nullable(),
  previousSchoolType: yup.string().nullable(),
  previousSchoolLevel: yup.string().nullable(),
  degrees: yup.string().nullable(),
  profession: yup.string().nullable(),
  trainingStartDate: yup.date().nullable(),
  employerCompanyName: yup.string().nullable(),
  employerAddress: yup.string().nullable(),
  employerContactName: yup.string().nullable(),
  employerContactEmail: yup.string().email("Invalid email").nullable(),
  employerContactPhone: yup.string().nullable(),
  employerContactSalutation: yup.string().nullable(),
});

const EducationStudentSettingsTab = () => {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const { currentStudent, currentStudentLoading } = useSelector(
    (state: RootState) => state.student,
  );
  const { classes } = useSelector((state: RootState) => state.class);

  useEffect(() => {
    dispatch(getClasses());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentClass =
    typeof currentStudent?.currentClass === "object" &&
    currentStudent?.currentClass !== null
      ? currentStudent.currentClass
      : currentStudent?.currentClass;

  const initialValues = {
    schoolEntryDate: currentStudent?.schoolEntryDate
      ? dayjs(currentStudent.schoolEntryDate)
      : null,
    previousSchool: currentStudent?.previousSchool || "",
    previousSchoolType: currentStudent?.previousSchoolType || "",
    previousSchoolLevel: currentStudent?.previousSchoolLevel || "",
    degrees: currentStudent?.degrees || "",
    profession: currentStudent?.profession || "",
    trainingStartDate: currentStudent?.trainingStartDate
      ? dayjs(currentStudent.trainingStartDate)
      : null,
    employerCompanyName: currentStudent?.employer?.companyName || "",
    employerAddress: currentStudent?.employer?.address || "",
    employerContactName: currentStudent?.employer?.contactName || "",
    employerContactEmail: currentStudent?.employer?.contactEmail || "",
    employerContactPhone: currentStudent?.employer?.contactPhone || "",
    employerContactSalutation:
      currentStudent?.employer?.contactSalutation || "",
  };

  const loaderCount = 2;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={(values) => {
        if (currentStudent?._id) {
          const patch = {
            schoolEntryDate: values.schoolEntryDate?.toDate() || null,
            previousSchool: values.previousSchool || null,
            previousSchoolType: values.previousSchoolType || null,
            previousSchoolLevel: values.previousSchoolLevel || null,
            degrees: values.degrees || null,
            profession: values.profession || null,
            trainingStartDate: values.trainingStartDate?.toDate() || null,
            employer: {
              companyName: values.employerCompanyName || null,
              address: values.employerAddress || null,
              contactName: values.employerContactName || null,
              contactEmail: values.employerContactEmail || null,
              contactPhone: values.employerContactPhone || null,
              contactSalutation: values.employerContactSalutation || null,
            },
          };
          dispatch(updateStudent(currentStudent._id, patch));
        }
      }}
    >
      {({ dirty, isSubmitting, handleSubmit, values, setFieldValue }) => (
        <Fragment>
          <AdminSettingsHeader
            isSubHeader
            title={t("settings.manageStudent.studentSettings.tabs.education")}
            onSave={handleSubmit}
            disabled={!dirty || isSubmitting || currentStudentLoading}
          />
          <StyledBox>
            {currentStudentLoading ? (
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
                      <SectionTitle variant="subtitle1">
                        {t("settings.manageStudent.currentEducation")}
                      </SectionTitle>

                      <Box style={{ width: "100%" }}>
                        <ClassAutocomplete
                          studentId={currentStudent?._id || ""}
                          currentClass={currentClass}
                          availableClasses={classes}
                        />
                      </Box>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={t("settings.manageStudent.schoolEntryDate")}
                          value={values.schoolEntryDate}
                          onChange={(newValue) =>
                            setFieldValue("schoolEntryDate", newValue)
                          }
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      </LocalizationProvider>

                      <Divider sx={{ my: 1 }} />

                      <SectionTitle variant="subtitle1">
                        {t("settings.manageStudent.previousEducation")}
                      </SectionTitle>

                      <Field
                        component={TextField}
                        name="previousSchool"
                        type="text"
                        label={t("settings.manageStudent.previousSchool")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="previousSchoolType"
                        type="text"
                        label={t("settings.manageStudent.previousSchoolType")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="previousSchoolLevel"
                        type="text"
                        label={t("settings.manageStudent.previousSchoolLevel")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="degrees"
                        type="text"
                        label={t("settings.manageStudent.degrees")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Box>
                  </Form>
                </StyledHalfBox>
                <StyledHalfBox>
                  <Form>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <SectionTitle variant="subtitle1">
                        {t("settings.manageStudent.vocationalTraining")}
                      </SectionTitle>

                      <Field
                        component={TextField}
                        name="profession"
                        type="text"
                        label={t("settings.manageStudent.profession")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={t("settings.manageStudent.trainingStartDate")}
                          value={values.trainingStartDate}
                          onChange={(newValue) =>
                            setFieldValue("trainingStartDate", newValue)
                          }
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      </LocalizationProvider>

                      <Divider sx={{ my: 1 }} />

                      <SectionTitle variant="subtitle1">
                        {t("settings.manageStudent.employer")}
                      </SectionTitle>

                      <Field
                        component={TextField}
                        name="employerCompanyName"
                        type="text"
                        label={t("settings.manageStudent.employerCompanyName")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="employerAddress"
                        type="text"
                        label={t("settings.manageStudent.employerAddress")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="employerContactName"
                        type="text"
                        label={t("settings.manageStudent.employerContactName")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="employerContactEmail"
                        type="email"
                        label={t("settings.manageStudent.employerContactEmail")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="employerContactPhone"
                        type="text"
                        label={t("settings.manageStudent.employerContactPhone")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="employerContactSalutation"
                        type="text"
                        label={t(
                          "settings.manageStudent.employerContactSalutation",
                        )}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Box>
                  </Form>
                </StyledHalfBox>
              </Fragment>
            )}
          </StyledBox>
        </Fragment>
      )}
    </Formik>
  );
};

export default EducationStudentSettingsTab;
