"use client";

import React, { Fragment } from "react";

import { GeneralSkeletonLoader } from "@/components/atoms/GeneralSkeletonLoader";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import { updateStudent } from "@/store/actions/studentActions";
import { AppDispatch } from "@/store/store";
import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, styled } from "@mui/material";
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

const validationSchema = yup.object({
  email: yup.string().email("Invalid email format").nullable(),
  phone: yup.string().nullable(),
  street: yup.string().nullable(),
  city: yup.string().nullable(),
  zip: yup.string().nullable(),
  country: yup.string().nullable(),
});

const ContactStudentSettingsTab = () => {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const { currentStudent, currentStudentLoading } = useSelector(
    (state: RootState) => state.student,
  );

  const initialValues = {
    email: currentStudent?.email || "",
    phone: currentStudent?.phone || "",
    street: currentStudent?.address?.street || "",
    city: currentStudent?.address?.city || "",
    zip: currentStudent?.address?.zip || "",
    country: currentStudent?.address?.country || "",
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
            email: values.email || null,
            phone: values.phone || null,
            address: {
              street: values.street || null,
              city: values.city || null,
              zip: values.zip || null,
              country: values.country || null,
            },
          };
          dispatch(updateStudent(currentStudent._id, patch));
        }
      }}
    >
      {({ dirty, isSubmitting, handleSubmit }) => (
        <Fragment>
          <AdminSettingsHeader
            isSubHeader
            title={t("settings.manageStudent.studentSettings.tabs.contact")}
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
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Field
                        component={TextField}
                        name="email"
                        type="email"
                        label={t("settings.manageStudent.email")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="phone"
                        type="text"
                        label={t("settings.manageStudent.phone")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Box>
                  </Form>
                </StyledHalfBox>
                <StyledHalfBox>
                  <Form>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Field
                        component={TextField}
                        name="street"
                        type="text"
                        label={t("settings.manageStudent.street")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="city"
                        type="text"
                        label={t("settings.manageStudent.city")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="zip"
                        type="text"
                        label={t("settings.manageStudent.zip")}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                      <Field
                        component={TextField}
                        name="country"
                        type="text"
                        label={t("settings.manageStudent.country")}
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

export default ContactStudentSettingsTab;
