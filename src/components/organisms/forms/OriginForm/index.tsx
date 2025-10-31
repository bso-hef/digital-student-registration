import React, { useMemo } from "react";

import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import {
  createValidateStudentOriginData,
  validateStudentOriginData,
} from "@/lib/validate/student.validate";
import { updateStudentOnboardingData } from "@/store/actions/studentActions";
import { useAppDispatch } from "@/store/store";
import { Autocomplete, MenuItem, styled } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { Select, TextField } from "formik-mui";
import { useTranslation } from "react-i18next";

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
  zuzugjahr: number;
  familiensprache: string;
}

interface OriginFormProps {
  data?: Partial<FormValues>;
  onSubmit?: (values: FormValues) => void;
}

const OriginForm: React.FC<OriginFormProps> = ({ data, onSubmit }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    languageOptions,
    countryOptions,
    fieldConfigs,
    getOptionValues,
    getEnabledOptions,
    loading,
  } = useOnboardingSettings();

  const initialValues: FormValues = {
    herkunftsland: data?.herkunftsland || "",
    zuzugjahr: data?.zuzugjahr || 0,
    familiensprache: data?.familiensprache || "",
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
        dispatch(updateStudentOnboardingData(values));
        if (onSubmit) onSubmit(values);
      }}
    >
      {({ setFieldValue, values, errors, touched }) => {
        const enabledCountries = getEnabledOptions(countryOptions);

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
                  label={t(
                    "onboarding.origin.countryOfOrigin",
                    "Herkunftsland",
                  )}
                  variant="outlined"
                  margin="normal"
                  error={touched.herkunftsland && Boolean(errors.herkunftsland)}
                  helperText={touched.herkunftsland && errors.herkunftsland}
                />
              )}
            />

            {/* Zuzugsjahr */}
            <Field
              component={TextField}
              name="zuzugjahr"
              label={t("onboarding.origin.yearOfImmigration", "Zuzugsjahr")}
              type="number"
              variant="outlined"
              margin="normal"
              fullWidth
              error={touched.zuzugjahr && Boolean(errors.zuzugjahr)}
              helperText={touched.zuzugjahr && errors.zuzugjahr}
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
              <Field
                component={Select}
                name="familiensprache"
                label={t("onboarding.origin.familyLanguage", "Familiensprache")}
                variant="outlined"
                margin="normal"
                fullWidth
                error={
                  touched.familiensprache && Boolean(errors.familiensprache)
                }
              >
                {getEnabledOptions(languageOptions).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
            )}
          </StyledForm>
        );
      }}
    </Formik>
  );
};

export default OriginForm;
