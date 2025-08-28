import React from "react";

import { styled } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import * as Yup from "yup";

const StyledForm = styled(Form)(({ theme }) => ({
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

const validationSchema = Yup.object({
  vorname: Yup.string().required("Vorname ist erforderlich"),
  nachname: Yup.string().required("Nachname ist erforderlich"),
  geburtsdatum: Yup.date()
    .typeError("Ungültiges Datum")
    .required("Geburtsdatum ist erforderlich"),
});

const GeneralForm: React.FC = () => {
  const initialValues: FormValues = {
    eintrittschule: "",
    klassenname: "",
    vorname: "",
    nachname: "",
    geburtsname: "",
    geschlecht: "",
    geburtsdatum: "",
    geburtsland: "",
    geburtsort: "",
    religion: "",
    staatsangehoerigkeit1: "",
    staatsangehoerigkeit2: "",
  };

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
