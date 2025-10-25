import React from "react";

import { validateStudentCompanyData } from "@/lib/validate/student.validate";
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
  betriebApAnrede: string;
  betriebApVorname: string;
  betriebApNachname: string;
  betriebApTelefon1: string;
}

interface CompanyContactFormProps {
  data?: Partial<StudentData>;
}

const CompanyContactForm: React.FC<CompanyContactFormProps> = ({ data }) => {
  const initialValues: FormValues = {
    betriebApAnrede: data?.betriebApAnrede || "",
    betriebApVorname: data?.betriebApVorname || "",
    betriebApNachname: data?.betriebApNachname || "",
    betriebApTelefon1: data?.betriebApTelefon1 || "",
  };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validateStudentCompanyData}
      onSubmit={(values) => {
        console.log("✅ Submitted values:", values);
      }}
    >
      {({ errors, touched }) => (
        <StyledForm>
          {/* betriebApAnrede */}
          <Field
            component={TextField}
            name="betriebApAnrede"
            label="Anrede"
            variant="outlined"
            margin="normal"
            error={touched.betriebApAnrede && Boolean(errors.betriebApAnrede)}
            helperText={touched.betriebApAnrede && errors.betriebApAnrede}
          />

          {/* betriebApVorname */}
          <Field
            component={TextField}
            name="betriebApVorname"
            label="Vorname"
            variant="outlined"
            margin="normal"
            error={touched.betriebApVorname && Boolean(errors.betriebApVorname)}
            helperText={touched.betriebApVorname && errors.betriebApVorname}
          />

          {/* betriebApNachname */}
          <Field
            component={TextField}
            name="betriebApNachname"
            label="Nachname"
            variant="outlined"
            margin="normal"
            error={
              touched.betriebApNachname && Boolean(errors.betriebApNachname)
            }
            helperText={touched.betriebApNachname && errors.betriebApNachname}
          />

          {/* betriebApTelefon1 */}
          <Field
            component={TextField}
            name="betriebApTelefon1"
            label="Telefon"
            variant="outlined"
            margin="normal"
            error={
              touched.betriebApTelefon1 && Boolean(errors.betriebApTelefon1)
            }
            helperText={touched.betriebApTelefon1 && errors.betriebApTelefon1}
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default CompanyContactForm;
