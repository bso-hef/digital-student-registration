"use client";

import React, { useEffect, useMemo } from "react";

import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import {
  createValidateGeneralStudentData,
  validateGeneralStudentData,
} from "@/lib/validate/student.validate";
import { updateStudentOnboardingData } from "@/store/actions/studentActions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  Autocomplete,
  Box,
  TextField as MUITextField,
  MenuItem,
  Skeleton,
  Typography,
  styled,
} from "@mui/material";
import dayjs from "dayjs";
import { FormikProps } from "formik";
import { Field, Form, Formik } from "formik";
import { Select, TextField } from "formik-mui";
import { DatePicker } from "formik-mui-x-date-pickers";
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

const FullWidthField = styled(Box)(() => ({
  gridColumn: "1 / -1",
}));

interface FormValues {
  eintrittschule: dayjs.Dayjs | null;
  klassenname: string;
  vorname: string;
  nachname: string;
  geburtsname: string;
  geschlecht: string;
  geburtsdatum: dayjs.Dayjs | null;
  geburtsland: string;
  geburtsort: string;
  religion: string;
  staatsangehoerigkeit1: string;
  staatsangehoerigkeit2: string;
}

interface GeneralFormProps {
  onSubmit?: (values: FormValues) => void;
  formikRef?: React.RefObject<FormikProps<FormValues> | null>;
  onValidationChange?: (isValid: boolean) => void;
}

const GeneralForm: React.FC<GeneralFormProps> = ({
  onSubmit,
  formikRef,
  onValidationChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const studentData = useAppSelector((state) => state.student.data);
  const {
    genderOptions,
    religionOptions,
    countryOptions,
    getOptionValues,
    getEnabledOptions,
    loading,
  } = useOnboardingSettings();

  const initialValues: FormValues = {
    eintrittschule: null,
    klassenname: "",
    vorname: studentData.vorname || "",
    nachname: studentData.nachname || "",
    geburtsname: studentData.geburtsname || "",
    geschlecht: studentData.geschlecht || "",
    geburtsdatum: studentData.geburtsdatum
      ? dayjs(studentData.geburtsdatum)
      : null,
    geburtsland: studentData.geburtsland || "DE",
    geburtsort: studentData.geburtsort || "",
    religion: studentData.religion || "",
    staatsangehoerigkeit1: studentData.staatsangehoerigkeit1 || "",
    staatsangehoerigkeit2: studentData.staatsangehoerigkeit2 || "",
  };

  // Create dynamic validation schema with settings
  const validationSchema = useMemo(() => {
    if (genderOptions.length > 0 || countryOptions.length > 0) {
      return createValidateGeneralStudentData(
        getOptionValues(genderOptions),
        getOptionValues(countryOptions),
      );
    }
    return validateGeneralStudentData;
  }, [genderOptions, countryOptions, getOptionValues]);

  const handleSubmit = (values: FormValues) => {
    // Convert Dayjs objects to ISO strings for Redux storage
    const submittedValues = {
      ...values,
      eintrittschule: values.eintrittschule
        ? values.eintrittschule.format("YYYY-MM-DD")
        : "",
      geburtsdatum: values.geburtsdatum
        ? values.geburtsdatum.format("YYYY-MM-DD")
        : "",
    };

    // Update Redux state
    dispatch(updateStudentOnboardingData(submittedValues));

    // Call parent onSubmit if provided
    if (onSubmit) {
      onSubmit(values);
    }
  };

  // Track validation state changes (must be before early return)
  useEffect(() => {
    if (formikRef?.current && onValidationChange) {
      const { isValid, isValidating, values } = formikRef.current;
      if (!isValidating) {
        onValidationChange(isValid);
      }
    }
  }, [formikRef, onValidationChange]);

  // Show loading skeleton while settings are loading
  if (loading) {
    return (
      <Box
        sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Typography variant="h6" gutterBottom>
          <Skeleton width="60%" />
        </Typography>
        <Skeleton variant="rectangular" height={56} />
        <Skeleton variant="rectangular" height={56} />
        <Skeleton variant="rectangular" height={56} />
        <Skeleton variant="rectangular" height={56} />
      </Box>
    );
  }

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      innerRef={formikRef}
    >
      {({ setFieldValue, values, setFieldTouched }) => (
        <StyledForm>
          <Typography variant="h6" gutterBottom>
            {t("onboarding.general.title")}
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            {t("onboarding.general.personalInfo")}
          </Typography>

          <FormSection>
            {/* Vorname */}
            <Field
              component={TextField}
              name="vorname"
              label={t("onboarding.general.firstName")}
              variant="outlined"
              fullWidth
              required
            />

            {/* Nachname */}
            <Field
              component={TextField}
              name="nachname"
              label={t("onboarding.general.lastName")}
              variant="outlined"
              fullWidth
              required
            />
          </FormSection>

          <FormSection>
            {/* Geburtsname */}
            <Field
              component={TextField}
              name="geburtsname"
              label={t("onboarding.general.birthName")}
              variant="outlined"
              fullWidth
            />

            {/* Geschlecht - Dynamic Dropdown */}
            <Field
              component={Select}
              name="geschlecht"
              label={t("onboarding.general.gender")}
              variant="outlined"
              fullWidth
              required
            >
              {getEnabledOptions(genderOptions).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field>
          </FormSection>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            {t("onboarding.general.birthInfo")}
          </Typography>

          <FormSection>
            {/* Geburtsdatum */}
            <Field
              component={DatePicker}
              name="geburtsdatum"
              label={t("onboarding.general.birthDate")}
              slotProps={{
                textField: {
                  variant: "outlined",
                  fullWidth: true,
                  required: true,
                },
              }}
            />

            {/* Geburtsort */}
            <Field
              component={TextField}
              name="geburtsort"
              label={t("onboarding.general.birthPlace")}
              variant="outlined"
              fullWidth
              required
            />
          </FormSection>

          <Autocomplete
            options={getEnabledOptions(countryOptions)}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            value={
              getEnabledOptions(countryOptions).find(
                (opt) => opt.value === values.geburtsland,
              ) || null
            }
            onChange={(_, newValue) => {
              setFieldValue("geburtsland", newValue?.value || "");
            }}
            onBlur={() => setFieldTouched("geburtsland", true)}
            fullWidth
            renderInput={(params) => (
              <MUITextField
                {...params}
                label={t("onboarding.general.birthCountry")}
                variant="outlined"
                fullWidth
                required
              />
            )}
          />

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            {t("onboarding.general.additionalInfo")}
          </Typography>

          <FormSection>
            {/* Religion */}
            <Field
              component={Select}
              name="religion"
              label={t("onboarding.general.religion")}
              variant="outlined"
              fullWidth
            >
              <MenuItem value="">
                <em>{t("general.none")}</em>
              </MenuItem>
              {getEnabledOptions(religionOptions).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field>

            {/* Staatsangehörigkeit 1 */}
            <Field
              component={TextField}
              name="staatsangehoerigkeit1"
              label={t(
                "onboarding.general.nationality1",
                "Staatsangehörigkeit 1",
              )}
              variant="outlined"
              fullWidth
              required
            />
          </FormSection>

          <FullWidthField>
            {/* Staatsangehörigkeit 2 */}
            <Field
              component={TextField}
              name="staatsangehoerigkeit2"
              label={t(
                "onboarding.general.nationality2",
                "Staatsangehörigkeit 2 (optional)",
              )}
              variant="outlined"
              fullWidth
            />
          </FullWidthField>
        </StyledForm>
      )}
    </Formik>
  );
};

export default GeneralForm;
