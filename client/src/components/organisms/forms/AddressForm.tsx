import React from "react";

import { validateStudentAddressData } from "@/lib/validate/student.validate";
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
  straße: string;
  hausnr: number;
  plz: number;
  ort: string;
  mobil: string;
  tel: string;
  mail: string;
}

interface AddressFormProps {
  data?: Partial<FormValues>;
}

const AddressForm: React.FC<AddressFormProps> = ({ data }) => {
  const initialValues: FormValues = {
    straße: data?.straße || "",
    hausnr: data?.hausnr || 0,
    plz: data?.plz || 0,
    ort: data?.ort || "",
    mobil: data?.mobil || "",
    tel: data?.tel || "",
    mail: data?.mail || "",
  };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validateStudentAddressData}
      onSubmit={(values) => {
        console.log("✅ Submitted values:", values);
      }}
    >
      {({ errors, touched }) => (
        <StyledForm>
          {/* straße */}
          <Field
            component={TextField}
            name="herkunftsland"
            label="Herkunftsland"
            variant="outlined"
            margin="normal"
            error={touched.straße && Boolean(errors.straße)}
            helperText={touched.straße && errors.straße}
          />

          {/* hausnr */}
          <Field
            component={TextField}
            name="zuzugjahr"
            label="Zuzugsjahr"
            type="number"
            variant="outlined"
            margin="normal"
            error={touched.hausnr && Boolean(errors.hausnr)}
            helperText={touched.hausnr && errors.hausnr}
          />

          {/* plz */}
          <Field
            component={TextField}
            name="familiensprache"
            label="Familiensprache"
            variant="outlined"
            margin="normal"
            error={touched.plz && Boolean(errors.plz)}
            helperText={touched.plz && errors.plz}
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default AddressForm;
