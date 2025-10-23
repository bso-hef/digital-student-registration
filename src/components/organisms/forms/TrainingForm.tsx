import React from "react";

import { validateStudentCompanyData } from "@/lib/validate/student.validate";
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
          {/* beruf */}
          <Field
            component={TextField}
            name="beruf"
            label="beruf"
            variant="outlined"
            margin="normal"
            error={touched.beruf && Boolean(errors.beruf)}
            helperText={touched.beruf && errors.beruf}
          />

          {/* betriebEintritt */}
          <Field
            component={TextField}
            name="zuzugjahr"
            label="Zuzugsjahr"
            type="number"
            variant="outlined"
            margin="normal"
            error={touched.betriebEintritt && Boolean(errors.betriebEintritt)}
            helperText={touched.betriebEintritt && errors.betriebEintritt}
          />

          {/* betriebName */}
          <Field
            component={TextField}
            name="familiensprache"
            label="Familiensprache"
            variant="outlined"
            margin="normal"
            error={touched.betriebName && Boolean(errors.betriebName)}
            helperText={touched.betriebName && errors.betriebName}
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default TrainingForm;
