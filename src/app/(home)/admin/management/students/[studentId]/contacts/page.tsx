"use client";

import React, { Fragment, useCallback } from "react";

import { GeneralSkeletonLoader } from "@/components/atoms/GeneralSkeletonLoader";
import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import { updateStudent } from "@/store/actions/studentActions";
import { AppDispatch } from "@/store/store";
import { ContactPerson } from "@/types/db";
import { applicationScrollbar } from "@/utils/styling.utils";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  styled,
} from "@mui/material";
import { Field, FieldArray, FieldProps, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import { RootState } from "@/store/reducers";

const StyledBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
  overflow: "auto",
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  ...applicationScrollbar(theme),
}));

const ContactPersonCard = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
}));

const ContactPersonHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

const FieldsRow = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  flexWrap: "wrap",
  "& > *": {
    flex: "1 1 200px",
    minWidth: "200px",
  },
}));

const contactPersonSchema = yup.object({
  type: yup.string().nullable(),
  firstName: yup.string().nullable(),
  lastName: yup.string().nullable(),
  phone: yup.string().nullable(),
  mobile: yup.string().nullable(),
  street: yup.string().nullable(),
  city: yup.string().nullable(),
  zip: yup.string().nullable(),
});

const validationSchema = yup.object({
  contactPersons: yup.array().of(contactPersonSchema),
});

interface ContactPersonFormData {
  type: string;
  firstName: string;
  lastName: string;
  phone: string;
  mobile: string;
  street: string;
  city: string;
  zip: string;
}

const emptyContactPerson: ContactPersonFormData = {
  type: "",
  firstName: "",
  lastName: "",
  phone: "",
  mobile: "",
  street: "",
  city: "",
  zip: "",
};

const contactTypeOptions = [
  "Mother",
  "Father",
  "ContactPerson",
  "Grandparent",
  "Sibling",
  "Other",
];

const ContactsStudentSettingsTab = () => {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const { maxContactPersons } = useOnboardingSettings();
  const { currentStudent, currentStudentLoading } = useSelector(
    (state: RootState) => state.student,
  );

  const mapContactPersonsToForm = useCallback((): ContactPersonFormData[] => {
    if (!currentStudent?.contactPersons?.length) {
      return [{ ...emptyContactPerson }];
    }

    return currentStudent.contactPersons.map((cp: ContactPerson) => ({
      type: cp.type || "",
      firstName: cp.firstName || "",
      lastName: cp.lastName || "",
      phone: cp.phone || "",
      mobile: cp.mobile || "",
      street: cp.address?.street || "",
      city: cp.address?.city || "",
      zip: cp.address?.zip || "",
    }));
  }, [currentStudent]);

  const initialValues = {
    contactPersons: mapContactPersonsToForm(),
  };

  const loaderCount = 2;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={(values) => {
        if (currentStudent?._id) {
          const contactPersons = values.contactPersons
            .filter(
              (cp) =>
                cp.firstName || cp.lastName || cp.type || cp.phone || cp.mobile,
            )
            .map((cp) => ({
              type: cp.type || null,
              firstName: cp.firstName || "",
              lastName: cp.lastName || "",
              phone: cp.phone || null,
              mobile: cp.mobile || null,
              address:
                cp.street || cp.city || cp.zip
                  ? {
                      street: cp.street || null,
                      city: cp.city || null,
                      zip: cp.zip || null,
                    }
                  : null,
            }));

          dispatch(updateStudent(currentStudent._id, { contactPersons }));
        }
      }}
    >
      {({ dirty, isSubmitting, handleSubmit, values }) => (
        <Fragment>
          <AdminSettingsHeader
            isSubHeader
            title={t("settings.manageStudent.studentSettings.tabs.guardians")}
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
              <Form>
                <FieldArray name="contactPersons">
                  {({ push, remove }) => (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {values.contactPersons.map((_, index) => (
                        <ContactPersonCard key={index}>
                          <ContactPersonHeader>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600 }}
                            >
                              {t("settings.manageStudent.contactPerson")} #
                              {index + 1}
                            </Typography>
                            {values.contactPersons.length > 1 && (
                              <IconButton
                                onClick={() => remove(index)}
                                size="small"
                                color="error"
                              >
                                <DeleteOutlineRoundedIcon />
                              </IconButton>
                            )}
                          </ContactPersonHeader>

                          <FieldsRow>
                            <FormControl fullWidth size="small">
                              <InputLabel>
                                {t("settings.manageStudent.contactType")}
                              </InputLabel>
                              <Field name={`contactPersons.${index}.type`}>
                                {({ field }: FieldProps) => (
                                  <Select
                                    {...field}
                                    label={t(
                                      "settings.manageStudent.contactType",
                                    )}
                                  >
                                    <MenuItem value="">
                                      {t("common.notSpecified")}
                                    </MenuItem>
                                    {contactTypeOptions.map((type) => (
                                      <MenuItem key={type} value={type}>
                                        {t(
                                          `settings.manageStudent.contactTypes.${type}`,
                                        )}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                )}
                              </Field>
                            </FormControl>
                            <Field
                              component={TextField}
                              name={`contactPersons.${index}.firstName`}
                              type="text"
                              label={t("settings.manageStudent.firstName")}
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                            <Field
                              component={TextField}
                              name={`contactPersons.${index}.lastName`}
                              type="text"
                              label={t("settings.manageStudent.lastName")}
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                          </FieldsRow>

                          <FieldsRow>
                            <Field
                              component={TextField}
                              name={`contactPersons.${index}.phone`}
                              type="text"
                              label={t("settings.manageStudent.phone")}
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                            <Field
                              component={TextField}
                              name={`contactPersons.${index}.mobile`}
                              type="text"
                              label={t("settings.manageStudent.mobile")}
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                          </FieldsRow>

                          <Divider />

                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {t("settings.manageStudent.address")}
                          </Typography>

                          <FieldsRow>
                            <Field
                              component={TextField}
                              name={`contactPersons.${index}.street`}
                              type="text"
                              label={t("settings.manageStudent.street")}
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                            <Field
                              component={TextField}
                              name={`contactPersons.${index}.city`}
                              type="text"
                              label={t("settings.manageStudent.city")}
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                            <Field
                              component={TextField}
                              name={`contactPersons.${index}.zip`}
                              type="text"
                              label={t("settings.manageStudent.zip")}
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                          </FieldsRow>
                        </ContactPersonCard>
                      ))}

                      {values.contactPersons.length < maxContactPersons && (
                        <Button
                          variant="outlined"
                          startIcon={<AddRoundedIcon />}
                          onClick={() => push({ ...emptyContactPerson })}
                          sx={{ alignSelf: "flex-start" }}
                        >
                          {t("settings.manageStudent.addContactPerson")}
                        </Button>
                      )}
                    </Box>
                  )}
                </FieldArray>
              </Form>
            )}
          </StyledBox>
        </Fragment>
      )}
    </Formik>
  );
};

export default ContactsStudentSettingsTab;
