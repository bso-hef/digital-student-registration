import React from "react";

import { validateStudentContactPersonData } from "@/lib/validate/student.validate";
import { StudentData } from "@/types/student";
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
  ansprechpartner1Art: string;
  ansprechpartner1Vorname: string;
  ansprechpartner1Nachname: string;
  ansprechpartner1Plz: string;
  ansprechpartner1Ort: string;
  ansprechpartner1Straße: string;
  ansprechpartner1HausNr: string;
  ansprechpartner1Mobil: string;
  ansprechpartner1Telefon1: string;
}

interface ParentsFormProps {
  data?: Partial<StudentData>;
}

const ParentsForm: React.FC<ParentsFormProps> = ({ data }) => {
  const initialValues: FormValues = {
    ansprechpartner1Art: data?.ansprechpartner1Art || "",
    ansprechpartner1Vorname: data?.ansprechpartner1Vorname || "",
    ansprechpartner1Nachname: data?.ansprechpartner1Nachname || "",
    ansprechpartner1Plz: data?.ansprechpartner1Plz || "",
    ansprechpartner1Ort: data?.ansprechpartner1Ort || "",
    ansprechpartner1Straße: data?.ansprechpartner1Straße || "",
    ansprechpartner1HausNr: data?.ansprechpartner1HausNr || "",
    ansprechpartner1Mobil: data?.ansprechpartner1Mobil || "",
    ansprechpartner1Telefon1: data?.ansprechpartner1Telefon1 || "",
  };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validateStudentContactPersonData}
      onSubmit={(values) => {
        console.log("✅ Submitted values:", values);
      }}
    >
      {({ errors, touched }) => (
        <StyledForm>
          {/* ansprechpartner1Art */}
          <Field
            component={TextField}
            name="ansprechpartner1Art"
            label="Ansprechpartner Art"
            variant="outlined"
            margin="normal"
            error={
              touched.ansprechpartner1Art && Boolean(errors.ansprechpartner1Art)
            }
            helperText={
              touched.ansprechpartner1Art && errors.ansprechpartner1Art
            }
          />

          {/* ansprechpartner1Vorname */}
          <Field
            component={TextField}
            name="ansprechpartner1Vorname"
            label="Vorname"
            variant="outlined"
            margin="normal"
            error={
              touched.ansprechpartner1Vorname &&
              Boolean(errors.ansprechpartner1Vorname)
            }
            helperText={
              touched.ansprechpartner1Vorname && errors.ansprechpartner1Vorname
            }
          />

          {/* ansprechpartner1Nachname */}
          <Field
            component={TextField}
            name="ansprechpartner1Nachname"
            label="Nachname"
            variant="outlined"
            margin="normal"
            error={
              touched.ansprechpartner1Nachname &&
              Boolean(errors.ansprechpartner1Nachname)
            }
            helperText={
              touched.ansprechpartner1Nachname &&
              errors.ansprechpartner1Nachname
            }
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default ParentsForm;
