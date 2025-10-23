import React from "react";

import { validateStudentMetaData } from "@/lib/validate/student.validate";
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
  changedData: string;
  schuelerId: number;
  datenschutz: boolean;
  personenabbild: string;
  teams: string;
  unterricht: string;
  schulordnung: boolean;
}

interface SummaryFormProps {
  data?: Partial<FormValues>;
}

const SummaryForm: React.FC<SummaryFormProps> = ({ data }) => {
  const initialValues: FormValues = {
    changedData: data?.changedData || "",
    schuelerId: data?.schuelerId || 0,
    datenschutz: data?.datenschutz || false,
    personenabbild: data?.personenabbild || "",
    teams: data?.teams || "",
    unterricht: data?.unterricht || "",
    schulordnung: data?.schulordnung || false,
  };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validateStudentMetaData}
      onSubmit={(values) => {
        console.log("✅ Submitted values:", values);
      }}
    >
      {({ errors, touched }) => (
        <StyledForm>
          {/* Herkunftsland */}
          <Field
            component={TextField}
            name="herkunftsland"
            label="Herkunftsland"
            variant="outlined"
            margin="normal"
            error={touched.changedData && Boolean(errors.changedData)}
            helperText={touched.changedData && errors.changedData}
          />

          {/* Zuzugsjahr */}
          <Field
            component={TextField}
            name="zuzugjahr"
            label="Zuzugsjahr"
            type="number"
            variant="outlined"
            margin="normal"
            error={touched.changedData && Boolean(errors.changedData)}
            helperText={touched.changedData && errors.changedData}
          />

          {/* Familiensprache */}
          <Field
            component={TextField}
            name="familiensprache"
            label="Familiensprache"
            variant="outlined"
            margin="normal"
            error={touched.changedData && Boolean(errors.changedData)}
            helperText={touched.changedData && errors.changedData}
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default SummaryForm;
