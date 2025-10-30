import React, { useMemo } from "react";

import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import {
  createValidateStudentCompanyData,
  validateStudentCompanyData,
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
  beruf: string;
  betriebEintritt: string;
  betriebName: string;
  betriebStraße: string;
  betriebHausNr: string;
  betriebPlz: string;
  betriebOrt: string;
  betriebTel: string;
  betriebMail: string;
}

interface TrainingFormProps {
  data?: Partial<FormValues>;
}

const TrainingForm: React.FC<TrainingFormProps> = ({ data }) => {
  const {
    professionOptions,
    salutationOptions,
    fieldConfigs,
    getOptionValues,
    getEnabledOptions,
    loading,
  } = useOnboardingSettings();

  const initialValues: FormValues = {
    beruf: data?.beruf || "",
    betriebEintritt: data?.betriebEintritt || "",
    betriebName: data?.betriebName || "",
    betriebStraße: data?.betriebStraße || "",
    betriebHausNr: data?.betriebHausNr || "",
    betriebPlz: data?.betriebPlz || "",
    betriebOrt: data?.betriebOrt || "",
    betriebTel: data?.betriebTel || "",
    betriebMail: data?.betriebMail || "",
  };

  // Create dynamic validation schema with settings
  const validationSchema = useMemo(() => {
    if (professionOptions.length > 0 && salutationOptions.length > 0) {
      const allowCustom = fieldConfigs?.beruf?.allowCustom ?? true;
      return createValidateStudentCompanyData(
        getOptionValues(professionOptions),
        getOptionValues(salutationOptions),
        allowCustom,
      );
    }
    return validateStudentCompanyData;
  }, [professionOptions, salutationOptions, fieldConfigs, getOptionValues]);

  if (loading) {
    return <div>Loading settings...</div>;
  }

  const allowCustomProfession = fieldConfigs?.beruf?.allowCustom ?? true;

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
          {/* Beruf - Dynamic Dropdown or Text Field */}
          {allowCustomProfession ? (
            <Field
              component={TextField}
              name="beruf"
              label="Beruf"
              variant="outlined"
              margin="normal"
              fullWidth
              error={touched.beruf && Boolean(errors.beruf)}
              helperText={touched.beruf && errors.beruf}
            />
          ) : (
            <Field
              component={Select}
              name="beruf"
              label="Beruf"
              variant="outlined"
              margin="normal"
              fullWidth
              error={touched.beruf && Boolean(errors.beruf)}
            >
              {getEnabledOptions(professionOptions).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field>
          )}

          {/* betriebEintritt */}
          <Field
            component={TextField}
            name="betriebEintritt"
            label="Betriebseintritt"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebEintritt && Boolean(errors.betriebEintritt)}
            helperText={touched.betriebEintritt && errors.betriebEintritt}
          />

          {/* betriebName */}
          <Field
            component={TextField}
            name="betriebName"
            label="Betriebsname"
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebName && Boolean(errors.betriebName)}
            helperText={touched.betriebName && errors.betriebName}
          />

          {/* betriebStraße */}
          <Field
            component={TextField}
            name="betriebStraße"
            label="Straße"
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebStraße && Boolean(errors.betriebStraße)}
            helperText={touched.betriebStraße && errors.betriebStraße}
          />

          {/* betriebHausNr */}
          <Field
            component={TextField}
            name="betriebHausNr"
            label="Hausnummer"
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebHausNr && Boolean(errors.betriebHausNr)}
            helperText={touched.betriebHausNr && errors.betriebHausNr}
          />

          {/* betriebPlz */}
          <Field
            component={TextField}
            name="betriebPlz"
            label="PLZ"
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebPlz && Boolean(errors.betriebPlz)}
            helperText={touched.betriebPlz && errors.betriebPlz}
          />

          {/* betriebOrt */}
          <Field
            component={TextField}
            name="betriebOrt"
            label="Ort"
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebOrt && Boolean(errors.betriebOrt)}
            helperText={touched.betriebOrt && errors.betriebOrt}
          />

          {/* betriebTel */}
          <Field
            component={TextField}
            name="betriebTel"
            label="Telefon"
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebTel && Boolean(errors.betriebTel)}
            helperText={touched.betriebTel && errors.betriebTel}
          />

          {/* betriebMail */}
          <Field
            component={TextField}
            name="betriebMail"
            label="E-Mail"
            type="email"
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebMail && Boolean(errors.betriebMail)}
            helperText={touched.betriebMail && errors.betriebMail}
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default TrainingForm;
