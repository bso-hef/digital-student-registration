import React, { useMemo } from "react";

import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import {
  createValidateStudentPreviousSchoolData,
  validateStudentPreviousSchoolData,
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
  vorhergehendeSchule: string;
  vorhergehendeStufe: string;
  vorhergehendeSchulform: string;
  abschluesse: string;
}

interface PreEducationFormProps {
  data?: Partial<FormValues>;
}

const PreEducationForm: React.FC<PreEducationFormProps> = ({ data }) => {
  const {
    schoolLevelOptions,
    schoolTypeOptions,
    degreeOptions,
    fieldConfigs,
    getOptionValues,
    getEnabledOptions,
    loading,
  } = useOnboardingSettings();

  const initialValues: FormValues = {
    vorhergehendeSchule: data?.vorhergehendeSchule || "",
    vorhergehendeStufe: data?.vorhergehendeStufe || "",
    vorhergehendeSchulform: data?.vorhergehendeSchulform || "",
    abschluesse: data?.abschluesse || "",
  };

  // Create dynamic validation schema with settings
  const validationSchema = useMemo(() => {
    if (
      schoolLevelOptions.length > 0 &&
      schoolTypeOptions.length > 0 &&
      degreeOptions.length > 0
    ) {
      const allowCustom = fieldConfigs?.abschluesse?.allowCustom ?? true;
      return createValidateStudentPreviousSchoolData(
        getOptionValues(schoolLevelOptions),
        getOptionValues(schoolTypeOptions),
        getOptionValues(degreeOptions),
        allowCustom,
      );
    }
    return validateStudentPreviousSchoolData;
  }, [
    schoolLevelOptions,
    schoolTypeOptions,
    degreeOptions,
    fieldConfigs,
    getOptionValues,
  ]);

  if (loading) {
    return <div>Loading settings...</div>;
  }

  const allowCustomDegree = fieldConfigs?.abschluesse?.allowCustom ?? true;

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
          {/* vorhergehendeSchule */}
          <Field
            component={TextField}
            name="vorhergehendeSchule"
            label="Vorhergehende Schule"
            variant="outlined"
            margin="normal"
            fullWidth
            error={
              touched.vorhergehendeSchule && Boolean(errors.vorhergehendeSchule)
            }
            helperText={
              touched.vorhergehendeSchule && errors.vorhergehendeSchule
            }
          />

          {/* vorhergehendeStufe - Dynamic Dropdown */}
          <Field
            component={Select}
            name="vorhergehendeStufe"
            label="Vorhergehende Stufe"
            variant="outlined"
            margin="normal"
            fullWidth
            error={
              touched.vorhergehendeStufe && Boolean(errors.vorhergehendeStufe)
            }
          >
            {getEnabledOptions(schoolLevelOptions).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field>

          {/* vorhergehendeSchulform - Dynamic Dropdown */}
          <Field
            component={Select}
            name="vorhergehendeSchulform"
            label="Vorhergehende Schulform"
            variant="outlined"
            margin="normal"
            fullWidth
            error={
              touched.vorhergehendeSchulform &&
              Boolean(errors.vorhergehendeSchulform)
            }
          >
            {getEnabledOptions(schoolTypeOptions).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field>

          {/* Abschluesse - Dynamic Dropdown or Text Field */}
          {allowCustomDegree ? (
            <Field
              component={TextField}
              name="abschluesse"
              label="Abschlüsse"
              variant="outlined"
              margin="normal"
              fullWidth
              error={touched.abschluesse && Boolean(errors.abschluesse)}
              helperText={touched.abschluesse && errors.abschluesse}
            />
          ) : (
            <Field
              component={Select}
              name="abschluesse"
              label="Abschlüsse"
              variant="outlined"
              margin="normal"
              fullWidth
              error={touched.abschluesse && Boolean(errors.abschluesse)}
            >
              {getEnabledOptions(degreeOptions).map((option) => (
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

export default PreEducationForm;
