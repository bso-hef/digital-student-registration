import React from "react";

import { validateGeneralStudentData } from "@/lib/validate/student.validate";
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

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validateGeneralStudentData}
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
            error={touched.nachname && Boolean(errors.nachname)}
            helperText={touched.nachname && errors.nachname}
          />

          {/* Geburtsdatum */}
          <Field
            component={TextField}
            name="geburtsdatum"
            label="Geburtsdatum"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            margin="normal"
            error={touched.geburtsdatum && Boolean(errors.geburtsdatum)}
            helperText={touched.geburtsdatum && errors.geburtsdatum}
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default GeneralForm;
