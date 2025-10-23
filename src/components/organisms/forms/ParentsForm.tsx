import React from "react";

import { validateStudentContactPersonData } from "@/lib/validate/student.validate";
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
  ansprechpartnerArt: string;
  ansprechpartnerVorname: string;
  ansprechpartnerNachname: string;
  ansprechpartnerPlz: number;
  ansprechpartnerOrt: string;
  ansprechpartnerStraße: string;
  ansprechpartnerHausNr: string;
  ansprechpartnerMobil: string;
  ansprechpartnerTelefon: string;
}

interface ParentsFormProps {
  data?: Partial<FormValues>;
}

const ParentsForm: React.FC<ParentsFormProps> = ({ data }) => {
  const initialValues: FormValues = {
    ansprechpartnerArt: data?.ansprechpartnerArt || "",
    ansprechpartnerVorname: data?.ansprechpartnerVorname || "",
    ansprechpartnerNachname: data?.ansprechpartnerNachname || "",
    ansprechpartnerPlz: data?.ansprechpartnerPlz || 0,
    ansprechpartnerOrt: data?.ansprechpartnerOrt || "",
    ansprechpartnerStraße: data?.ansprechpartnerStraße || "",
    ansprechpartnerHausNr: data?.ansprechpartnerHausNr || "",
    ansprechpartnerMobil: data?.ansprechpartnerMobil || "",
    ansprechpartnerTelefon: data?.ansprechpartnerTelefon || "",
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
          {/* ansprechpartnerArt */}
          <Field
            component={TextField}
            name="herkunftsland"
            label="Herkunftsland"
            variant="outlined"
            margin="normal"
            error={
              touched.ansprechpartnerArt && Boolean(errors.ansprechpartnerArt)
            }
            helperText={touched.ansprechpartnerArt && errors.ansprechpartnerArt}
          />

          {/* ansprechpartnerVorname */}
          <Field
            component={TextField}
            name="zuzugjahr"
            label="Zuzugsjahr"
            type="number"
            variant="outlined"
            margin="normal"
            error={
              touched.ansprechpartnerVorname &&
              Boolean(errors.ansprechpartnerVorname)
            }
            helperText={
              touched.ansprechpartnerVorname && errors.ansprechpartnerVorname
            }
          />

          {/* Familiensprache */}
          <Field
            component={TextField}
            name="familiensprache"
            label="Familiensprache"
            variant="outlined"
            margin="normal"
            error={
              touched.ansprechpartnerNachname &&
              Boolean(errors.ansprechpartnerNachname)
            }
            helperText={
              touched.ansprechpartnerNachname && errors.ansprechpartnerNachname
            }
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default ParentsForm;
