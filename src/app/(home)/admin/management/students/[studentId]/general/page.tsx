"use client";

import React, { Fragment } from "react";

import { GeneralSkeletonLoader } from "@/components/atoms/GeneralSkeletonLoader";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import { updateStudent } from "@/store/actions/studentActions";
import { AppDispatch } from "@/store/store";
import { applicationScrollbar } from "@/utils/styling.utils";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  styled,
} from "@mui/material";
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

const ReadOnlyBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1, 0),
}));

const validationSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  birthName: yup.string().nullable(),
  dateOfBirth: yup.date().nullable().required("Date of birth is required"),
  gender: yup.string().oneOf(["male", "female", "diverse", ""]).nullable(),
  birthplace: yup.string().nullable(),
  birthCountry: yup.string().nullable(),
  religion: yup.string().nullable(),
  nationality: yup.string().nullable(),
  secondNationality: yup.string().nullable(),
  familyLanguage: yup.string().nullable(),
  immigrationYear: yup
    .number()
    .nullable()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  active: yup.boolean().required(),
});

const GeneralStudentSettingsTab = () => {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const { currentStudent, currentStudentLoading } = useSelector(
    (state: RootState) => state.student,
  );

  const initialValues = {
    firstName: currentStudent?.firstName || "",
    lastName: currentStudent?.lastName || "",
    birthName: currentStudent?.birthName || "",
    dateOfBirth: currentStudent?.dateOfBirth
      ? dayjs(currentStudent.dateOfBirth)
      : null,
    gender: currentStudent?.gender || "",
    birthplace: currentStudent?.birthplace || "",
    birthCountry: currentStudent?.birthCountry || "",
    religion: currentStudent?.religion || "",
    nationality: currentStudent?.nationality || "",
    secondNationality: currentStudent?.secondNationality || "",
    familyLanguage: currentStudent?.familyLanguage || "",
    immigrationYear: currentStudent?.immigrationYear || null,
    active: currentStudent?.active ?? true,
  };

  const loaderCount = 2;

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "onboarded":
        return "success";
      case "invited":
        return "warning";
      case "imported":
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string | undefined) => {
    switch (status) {
      case "onboarded":
        return t("dashboard.status.onboarded");
      case "invited":
        return t("dashboard.status.invited");
      case "imported":
      default:
        return t("dashboard.status.imported");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={(values) => {
        if (currentStudent?._id) {
          const patch = {
            firstName: values.firstName,
            lastName: values.lastName,
            birthName: values.birthName || null,
            dateOfBirth: values.dateOfBirth?.toDate() || null,
            gender: values.gender || null,
            birthplace: values.birthplace || null,
            birthCountry: values.birthCountry || null,
            religion: values.religion || null,
            nationality: values.nationality || null,
            secondNationality: values.secondNationality || null,
            familyLanguage: values.familyLanguage || null,
            immigrationYear: values.immigrationYear || null,
            active: values.active,
          };
          dispatch(updateStudent(currentStudent._id, patch));
        }
      }}
    >
      {({ dirty, isSubmitting, handleSubmit, values, setFieldValue }) => (
        <Fragment>
          <AdminSettingsHeader
            isSubHeader
            title={t("settings.manageStudent.studentSettings.tabs.general")}
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
                      <Field
                        component={TextField}
                        name="firstName"
                        type="text"
                        label={t("settings.manageStudent.firstName")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="lastName"
                        type="text"
                        label={t("settings.manageStudent.lastName")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="birthName"
                        type="text"
                        label={t("settings.manageStudent.birthName")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={t("settings.manageStudent.dateOfBirth")}
                          value={values.dateOfBirth}
                          onChange={(newValue) =>
                            setFieldValue("dateOfBirth", newValue)
                          }
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      </LocalizationProvider>
                      <FormControl fullWidth size="small">
                        <InputLabel>
                          {t("settings.manageStudent.gender")}
                        </InputLabel>
                        <Field name="gender">
                          {({ field }: FieldProps) => (
                            <Select
                              {...field}
                              label={t("settings.manageStudent.gender")}
                            >
                              <MenuItem value="">
                                {t("common.notSpecified")}
                              </MenuItem>
                              <MenuItem value="male">
                                {t("common.male")}
                              </MenuItem>
                              <MenuItem value="female">
                                {t("common.female")}
                              </MenuItem>
                              <MenuItem value="diverse">
                                {t("common.diverse")}
                              </MenuItem>
                            </Select>
                          )}
                        </Field>
                      </FormControl>
                      <Field
                        component={TextField}
                        name="birthplace"
                        type="text"
                        label={t("settings.manageStudent.birthplace")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="birthCountry"
                        type="text"
                        label={t("settings.manageStudent.birthCountry")}
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
                      <Field
                        component={TextField}
                        name="religion"
                        type="text"
                        label={t("settings.manageStudent.religion")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="nationality"
                        type="text"
                        label={t("settings.manageStudent.nationality")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="secondNationality"
                        type="text"
                        label={t("settings.manageStudent.secondNationality")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="familyLanguage"
                        type="text"
                        label={t("settings.manageStudent.familyLanguage")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="immigrationYear"
                        type="number"
                        label={t("settings.manageStudent.immigrationYear")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          mt: 2,
                        }}
                      >
                        <ReadOnlyBox>
                          <Typography variant="body2" fontWeight={600}>
                            {t("settings.manageStudent.status")}:
                          </Typography>
                          <Chip
                            label={getStatusLabel(currentStudent?.status)}
                            color={getStatusColor(currentStudent?.status)}
                            size="small"
                          />
                        </ReadOnlyBox>

                        <ReadOnlyBox>
                          <Typography variant="body2" fontWeight={600}>
                            {t("settings.manageStudent.verificationCode")}:
                          </Typography>
                          <Typography variant="body2">
                            {currentStudent?.verificationCode || "-"}
                          </Typography>
                        </ReadOnlyBox>

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
                                  {t("settings.manageStudent.isActive")}
                                </Box>
                              </>
                            )}
                          </Field>
                        </Box>
                      </Box>
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

export default GeneralStudentSettingsTab;
