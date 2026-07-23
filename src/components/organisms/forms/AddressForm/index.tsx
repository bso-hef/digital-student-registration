"use client";

import React, { useEffect } from "react";

import { validateStudentAddressData } from "@/lib/validate/student.validate";
import { updateStudentOnboardingData } from "@/store/actions/studentActions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Box, Typography, styled } from "@mui/material";
import { Field, Form, Formik, FormikProps } from "formik";
import { TextField } from "formik-mui";
import { useTranslation } from "react-i18next";

const StyledForm = styled(Form)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  width: "100%",
  height: "auto",
  gap: theme.spacing(2),
}));

const FormSection = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
}));

interface FormValues {
  straße: string;
  hausnr: string;
  plz: string;
  ort: string;
  mobil: string;
  tel: string;
  mail: string;
}

interface AddressFormProps {
  onSubmit?: (values?: Partial<Record<string, unknown>>) => void;
  formikRef?: React.RefObject<FormikProps<FormValues> | null>;
  onValidationChange?: (isValid: boolean) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  formikRef,
  onValidationChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const studentData = useAppSelector((state) => state.student.data);

  const initialValues: FormValues = {
    straße: studentData.straße || "",
    hausnr: studentData.hausNr || "",
    plz: studentData.postleitzahl || "",
    ort: studentData.ort || "",
    mobil: studentData.mobil || "",
    tel: studentData.telefon1 || "",
    mail: studentData.email || "",
  };

  const handleSubmit = (values: FormValues) => {
    // Map form values to Redux state field names
    const mappedValues = {
      straße: values.straße,
      hausNr: values.hausnr,
      postleitzahl: values.plz,
      ort: values.ort,
      mobil: values.mobil,
      telefon1: values.tel,
      email: values.mail,
    };

    // Update Redux state with mapped values
    dispatch(updateStudentOnboardingData(mappedValues));

    // Pass mapped values to parent to ensure immediate save to database
    if (onSubmit) {
      onSubmit(mappedValues);
    }
  };

  // Track validation state changes (no early returns, so safe here)
  useEffect(() => {
    if (formikRef?.current && onValidationChange) {
      onValidationChange(formikRef.current.isValid);
    }
  });

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validateStudentAddressData}
      onSubmit={handleSubmit}
      enableReinitialize
      innerRef={formikRef}
    >
      {() => (
        <StyledForm>
          <Typography variant="h6" gutterBottom>
            {t("onboarding.address.title")}
          </Typography>

          <FormSection>
            {/* Straße */}
            <Field
              component={TextField}
              name="straße"
              label={t("onboarding.address.street")}
              variant="outlined"
              fullWidth
              required
            />

            {/* Hausnummer */}
            <Field
              component={TextField}
              name="hausnr"
              label={t("onboarding.address.houseNumber")}
              variant="outlined"
              fullWidth
              required
            />
          </FormSection>

          <FormSection>
            {/* PLZ */}
            <Field
              component={TextField}
              name="plz"
              label={t("onboarding.address.postalCode")}
              variant="outlined"
              fullWidth
              required
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                },
              }}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                // Only allow numbers
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />

            {/* Ort */}
            <Field
              component={TextField}
              name="ort"
              label={t("onboarding.address.city")}
              variant="outlined"
              fullWidth
              required
            />
          </FormSection>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            {t("onboarding.address.contactTitle")}
          </Typography>

          <FormSection>
            {/* Mobilnummer */}
            <Field
              component={TextField}
              name="mobil"
              label={t("onboarding.address.mobile")}
              variant="outlined"
              fullWidth
              placeholder="+49 123 456789"
              inputProps={{
                inputMode: "tel",
                pattern: "[+0-9 ]*",
              }}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                // Only allow numbers, +, and spaces
                if (!/[0-9+\s]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />

            {/* Festnetz */}
            <Field
              component={TextField}
              name="tel"
              label={t("onboarding.address.phone")}
              variant="outlined"
              fullWidth
              placeholder="+49 123 456789"
              inputProps={{
                inputMode: "tel",
                pattern: "[+0-9 ]*",
              }}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                // Only allow numbers, +, and spaces
                if (!/[0-9+\s]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />

            {/* E-Mail */}
            <Field
              component={TextField}
              name="mail"
              label={t("onboarding.address.email")}
              type="email"
              variant="outlined"
              fullWidth
              required
            />
          </FormSection>
        </StyledForm>
      )}
    </Formik>
  );
};

export default AddressForm;
