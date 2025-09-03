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
  herkunftsland: string;
  zuzugjahr: number;
  familiensprache: string;
}

interface OriginFormProps {
  data?: Partial<FormValues>;
}

const OriginForm: React.FC<OriginFormProps> = ({ data }) => {
  const initialValues: FormValues = {
    herkunftsland: data?.herkunftsland || "",
    zuzugjahr: data?.zuzugjahr || 0,
    familiensprache: data?.familiensprache || "",
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
          {/* Herkunftsland */}
          <Field
            component={TextField}
            name="herkunftsland"
            label="Herkunftsland"
            variant="outlined"
            margin="normal"
            error={touched.herkunftsland && Boolean(errors.herkunftsland)}
            helperText={touched.herkunftsland && errors.herkunftsland}
          />

          {/* Zuzugsjahr */}
          <Field
            component={TextField}
            name="zuzugjahr"
            label="Zuzugsjahr"
            type="number"
            variant="outlined"
            margin="normal"
            error={touched.zuzugjahr && Boolean(errors.zuzugjahr)}
            helperText={touched.zuzugjahr && errors.zuzugjahr}
          />

          {/* Familiensprache */}
          <Field
            component={TextField}
            name="familiensprache"
            label="Familiensprache"
            variant="outlined"
            margin="normal"
            error={touched.familiensprache && Boolean(errors.familiensprache)}
            helperText={touched.familiensprache && errors.familiensprache}
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default OriginForm;
