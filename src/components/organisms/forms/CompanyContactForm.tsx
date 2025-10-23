import React from "react";

import { validateStudentCompanyContactData } from "@/lib/validate/student.validate";
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
  betriebAnsprechpartnerAnrede: string;
  betriebAnsprechpartnerVorname: string;
  betriebAnsprechpartnerNachname: string;
  betriebAnsprechpartnerTel: string;
}

interface CompanyContactFormProps {
  data?: Partial<FormValues>;
}

const CompanyContactForm: React.FC<CompanyContactFormProps> = ({ data }) => {
  const initialValues: FormValues = {
    betriebAnsprechpartnerAnrede: data?.betriebAnsprechpartnerAnrede || "",
    betriebAnsprechpartnerVorname: data?.betriebAnsprechpartnerVorname || "",
    betriebAnsprechpartnerNachname: data?.betriebAnsprechpartnerNachname || "",
    betriebAnsprechpartnerTel: data?.betriebAnsprechpartnerTel || "",
  };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validateStudentCompanyContactData}
      onSubmit={(values) => {
        console.log("✅ Submitted values:", values);
      }}
    >
      {({ errors, touched }) => (
        <StyledForm>
          {/* betriebAnsprechpartnerAnrede */}
          <Field
            component={TextField}
            name="herkunftsland"
            label="Herkunftsland"
            variant="outlined"
            margin="normal"
            error={
              touched.betriebAnsprechpartnerAnrede &&
              Boolean(errors.betriebAnsprechpartnerAnrede)
            }
            helperText={
              touched.betriebAnsprechpartnerAnrede &&
              errors.betriebAnsprechpartnerAnrede
            }
          />

          {/* betriebAnsprechpartnerVorname */}
          <Field
            component={TextField}
            name="zuzugjahr"
            label="Zuzugsjahr"
            type="number"
            variant="outlined"
            margin="normal"
            error={
              touched.betriebAnsprechpartnerVorname &&
              Boolean(errors.betriebAnsprechpartnerVorname)
            }
            helperText={
              touched.betriebAnsprechpartnerVorname &&
              errors.betriebAnsprechpartnerVorname
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
              touched.betriebAnsprechpartnerNachname &&
              Boolean(errors.betriebAnsprechpartnerNachname)
            }
            helperText={
              touched.betriebAnsprechpartnerNachname &&
              errors.betriebAnsprechpartnerNachname
            }
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default CompanyContactForm;
