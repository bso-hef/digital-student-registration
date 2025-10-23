import React from "react";

import { validateStudentPreviousSchoolData } from "@/lib/validate/student.validate";
import { styled } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";

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
  const initialValues: FormValues = {
    vorhergehendeSchule: data?.vorhergehendeSchule || "",
    vorhergehendeStufe: data?.vorhergehendeStufe || "",
    vorhergehendeSchulform: data?.vorhergehendeSchulform || "",
    abschluesse: data?.abschluesse || "",
  };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validateStudentPreviousSchoolData}
      onSubmit={(values) => {
        console.log("✅ Submitted values:", values);
      }}
    >
      {({ errors, touched }) => (
        <StyledForm>
          {/* vorhergehendeSchule */}
          <Field
            component={TextField}
            name="herkunftsland"
            label="Herkunftsland"
            variant="outlined"
            margin="normal"
            error={
              touched.vorhergehendeSchule && Boolean(errors.vorhergehendeSchule)
            }
            helperText={
              touched.vorhergehendeSchule && errors.vorhergehendeSchule
            }
          />

          {/* vorhergehendeStufe */}
          <Field
            component={TextField}
            name="zuzugjahr"
            label="Zuzugsjahr"
            type="number"
            variant="outlined"
            margin="normal"
            error={
              touched.vorhergehendeStufe && Boolean(errors.vorhergehendeStufe)
            }
            helperText={touched.vorhergehendeStufe && errors.vorhergehendeStufe}
          />

          {/* vorhergehendeSchulform */}
          <Field
            component={TextField}
            name="familiensprache"
            label="Familiensprache"
            variant="outlined"
            margin="normal"
            error={
              touched.vorhergehendeSchulform &&
              Boolean(errors.vorhergehendeSchulform)
            }
            helperText={
              touched.vorhergehendeSchulform && errors.vorhergehendeSchulform
            }
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default PreEducationForm;
