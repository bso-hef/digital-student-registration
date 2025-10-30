import React, { useMemo } from "react";

import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import {
  createValidateGeneralStudentData,
  validateGeneralStudentData,
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
  eintrittschule: string;
  klassenname: string;
  vorname: string;
  nachname: string;
  geburtsname: string;
  geschlecht: string;
  geburtsdatum: string;
  geburtsland: string;
  geburtsort: string;
  religion: string;
  staatsangehoerigkeit1: string;
  staatsangehoerigkeit2: string;
}

interface GeneralFormProps {
  data?: Partial<FormValues>;
}

const GeneralForm: React.FC<GeneralFormProps> = ({ data }) => {
  const { genderOptions, getOptionValues, getEnabledOptions, loading } =
    useOnboardingSettings();

  const initialValues: FormValues = {
    eintrittschule: data?.eintrittschule || "",
    klassenname: data?.klassenname || "",
    vorname: data?.vorname || "",
    nachname: data?.nachname || "",
    geburtsname: data?.geburtsname || "",
    geschlecht: data?.geschlecht || "",
    geburtsdatum: data?.geburtsdatum || "",
    geburtsland: data?.geburtsland || "",
    geburtsort: data?.geburtsort || "",
    religion: data?.religion || "",
    staatsangehoerigkeit1: data?.staatsangehoerigkeit1 || "",
    staatsangehoerigkeit2: data?.staatsangehoerigkeit2 || "",
  };

  // Create dynamic validation schema with settings
  const validationSchema = useMemo(() => {
    if (genderOptions.length > 0) {
      return createValidateGeneralStudentData(getOptionValues(genderOptions));
    }
    return validateGeneralStudentData;
  }, [genderOptions, getOptionValues]);

  if (loading) {
    return <div>Loading settings...</div>;
  }

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
          {/* Vorname */}
          <Field
            component={TextField}
            name="vorname"
            label="Vorname"
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.vorname && Boolean(errors.vorname)}
            helperText={touched.vorname && errors.vorname}
          />

          {/* Nachname */}
          <Field
            component={TextField}
            name="nachname"
            label="Nachname"
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.nachname && Boolean(errors.nachname)}
            helperText={touched.nachname && errors.nachname}
          />

          {/* Geschlecht - Dynamic Dropdown */}
          <Field
            component={Select}
            name="geschlecht"
            label="Geschlecht"
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.geschlecht && Boolean(errors.geschlecht)}
            helperText={touched.geschlecht && errors.geschlecht}
          >
            {getEnabledOptions(genderOptions).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field>

          {/* Geburtsdatum */}
          <Field
            component={TextField}
            name="geburtsdatum"
            label="Geburtsdatum"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.geburtsdatum && Boolean(errors.geburtsdatum)}
            helperText={touched.geburtsdatum && errors.geburtsdatum}
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default GeneralForm;
