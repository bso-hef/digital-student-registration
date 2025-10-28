import React, { useMemo } from "react";

import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import {
  createValidateStudentOriginData,
  validateStudentOriginData,
} from "@/lib/validate/student.validate";
import { MenuItem, styled } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { Select, TextField } from "formik-mui";

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
}

const OriginForm: React.FC<OriginFormProps> = ({ data }) => {
  const {
    languageOptions,
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
        console.log("✅ Submitted values:", values);
      }}
    >
      {({ errors, touched }) => (
        <StyledForm>
          {/* Herkunftsland */}
          <Field
            component={TextField}
            name="herkunftsland"
            label="Herkunftsland"
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.herkunftsland && Boolean(errors.herkunftsland)}
            helperText={touched.herkunftsland && errors.herkunftsland}
          />

          {/* Zuzugsjahr */}
          <Field
            component={TextField}
            name="zuzugjahr"
            label="Zuzugsjahr"
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
              label="Familiensprache"
              variant="outlined"
              margin="normal"
              fullWidth
              error={touched.familiensprache && Boolean(errors.familiensprache)}
              helperText={touched.familiensprache && errors.familiensprache}
            />
          ) : (
            <Field
              component={Select}
              name="familiensprache"
              label="Familiensprache"
              variant="outlined"
              margin="normal"
              fullWidth
              error={touched.familiensprache && Boolean(errors.familiensprache)}
            >
              {getEnabledOptions(languageOptions).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field>
          )}
        </StyledForm>
      )}
    </Formik>
  );
};

export default OriginForm;
