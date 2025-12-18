import React, { useEffect, useMemo } from "react";

import FormikDropdown from "@/components/atoms/dropdowns/FormikDropdown";
import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import {
  createValidateStudentOriginData,
  validateStudentOriginData,
} from "@/lib/validate/student.validate";
import { updateStudentOnboardingData } from "@/store/actions/studentActions";
import { useAppDispatch } from "@/store/store";
import { Autocomplete, styled } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { FormikProps } from "formik";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { RootState } from "@/store/reducers";

const StyledForm = styled(Form)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  width: "100%",
  height: "auto",
}));

interface FormValues {
  herkunftsland: string;
  zuzugjahr: Dayjs | null;
  familiensprache: string;
}

interface OriginFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (values: any) => void;
  formikRef?: React.RefObject<FormikProps<FormValues> | null>;
  onValidationChange?: (isValid: boolean) => void;
}

const OriginForm: React.FC<OriginFormProps> = ({
  onSubmit,
  formikRef,
  onValidationChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // Get student data from Redux to pre-fill form values
  const { data: studentData } = useSelector(
    (state: RootState) => state.student,
  );

  const {
    languageOptions,
    countryOptions,
    fieldConfigs,
    getOptionValues,
    getEnabledOptions,
    loading,
  } = useOnboardingSettings();

  // Convert geburtsland code to country label for pre-filling herkunftsland
  const defaultHerkunftsland = useMemo(() => {
    // If already has herkunftsland, use it
    if (studentData?.herkunftsland) return studentData.herkunftsland;
    // Convert geburtsland code to label
    if (studentData?.geburtsland) {
      const country = getEnabledOptions(countryOptions).find(
        (c) => c.value === studentData.geburtsland,
      );
      return country?.label || "";
    }
    return "";
  }, [
    studentData?.herkunftsland,
    studentData?.geburtsland,
    countryOptions,
    getEnabledOptions,
  ]);

  const initialValues: FormValues = {
    herkunftsland: defaultHerkunftsland,
    zuzugjahr: studentData?.zuzugjahr
      ? dayjs().year(studentData.zuzugjahr)
      : null,
    familiensprache: studentData?.familiensprache || "",
  };

  // Create dynamic validation schema with settings
  const validationSchema = useMemo(() => {
    if (languageOptions.length > 0) {
      const allowCustom = fieldConfigs?.familiensprache?.allowCustom ?? true;
      return createValidateStudentOriginData(
        getOptionValues(languageOptions),
        allowCustom,
      );
    }
    return validateStudentOriginData;
  }, [languageOptions, fieldConfigs, getOptionValues]);

  // Track validation state changes (must be before early return)
  useEffect(() => {
    if (formikRef?.current && onValidationChange) {
      onValidationChange(formikRef.current.isValid);
    }
  });

  if (loading) {
    return <div>Loading settings...</div>;
  }

  const allowCustomLanguage =
    fieldConfigs?.familiensprache?.allowCustom ?? true;

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        // Convert Dayjs to year number for storage
        const dataToSave = {
          ...values,
          zuzugjahr: values.zuzugjahr ? values.zuzugjahr.year() : null,
        };
        dispatch(updateStudentOnboardingData(dataToSave));
        // Pass values to parent to ensure immediate save to database
        if (onSubmit) onSubmit(dataToSave);
      }}
      innerRef={formikRef}
    >
      {({ setFieldValue, values, errors, touched }) => {
        // Filter out Germany since this form is only for non-German students
        // (students born in Germany skip this form entirely via conditional logic)
        const enabledCountries = getEnabledOptions(countryOptions).filter(
          (country) => country.value !== "DE",
        );

        return (
          <StyledForm>
            {/* Herkunftsland - Autocomplete */}
            <Autocomplete
              options={enabledCountries.map((c) => c.label)}
              value={values.herkunftsland || null}
              onChange={(_, newValue) => {
                setFieldValue("herkunftsland", newValue || "");
              }}
              renderInput={(params) => (
                <Field
                  component={TextField}
                  {...params}
                  name="herkunftsland"
                  label={t("onboarding.origin.countryOfOrigin")}
                  variant="outlined"
                  margin="normal"
                  error={touched.herkunftsland && Boolean(errors.herkunftsland)}
                  helperText={touched.herkunftsland && errors.herkunftsland}
                  fullWidth
                />
              )}
              fullWidth
            />

            {/* Zuzugsjahr - Year Picker */}
            <DatePicker
              value={values.zuzugjahr}
              onChange={(newValue) => setFieldValue("zuzugjahr", newValue)}
              label={t("onboarding.origin.yearOfImmigration", "Zuzugsjahr")}
              views={["year"]}
              format="YYYY"
              disableFuture
              slotProps={{
                textField: {
                  variant: "outlined",
                  fullWidth: true,
                  margin: "normal",
                  error: touched.zuzugjahr && Boolean(errors.zuzugjahr),
                  helperText:
                    touched.zuzugjahr && errors.zuzugjahr
                      ? String(errors.zuzugjahr)
                      : undefined,
                },
              }}
            />

            {/* Familiensprache - Dynamic Dropdown or Text Field */}
            {allowCustomLanguage ? (
              <Field
                component={TextField}
                name="familiensprache"
                label={t("onboarding.origin.familyLanguage", "Familiensprache")}
                variant="outlined"
                margin="normal"
                fullWidth
                error={
                  touched.familiensprache && Boolean(errors.familiensprache)
                }
                helperText={touched.familiensprache && errors.familiensprache}
              />
            ) : (
              <FormikDropdown
                name="familiensprache"
                label={t("onboarding.origin.familyLanguage", "Familiensprache")}
                options={getEnabledOptions(languageOptions)}
              />
            )}
          </StyledForm>
        );
      }}
    </Formik>
  );
};

export default OriginForm;
