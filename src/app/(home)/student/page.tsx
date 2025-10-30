"use client";

import CustomTitle from "@/components/atoms/CustomTitle";
import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import { Box, styled } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import * as Yup from "yup";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  textAlign: "center",
  width: "100%",
  height: "100%",
  color: theme.palette.text.default,
}));

const StyledForm = styled(Form)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  marginTop: theme.spacing(2),
  gap: theme.spacing(2),
}));

interface FormValues {
  firstName: string;
  lastName: string;
  uniqueIdentifier: string | number;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required("Vorname ist erforderlich"),
  lastName: Yup.string().required("Nachname ist erforderlich"),
  uniqueIdentifier: Yup.string().required(
    "Eindeutiger Bezeichner ist erforderlich",
  ),
});

export default function StudentPage() {
  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    uniqueIdentifier: "",
  };

  return (
    <Wrapper>
      <CustomTitle
        title="Anmeldung der BSO"
        subTitle="Bitte gib deinen Vor-, Nachnamen und die Anmelde-ID ein."
      />
      <Formik<FormValues>
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("✅ Submitted values:", values);
        }}
      >
        {({ handleSubmit, errors, touched }) => (
          <StyledForm>
            <Field
              component={TextField}
              name="firstName"
              placeholder="Vorname"
              error={touched.firstName && Boolean(errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />
            <Field
              component={TextField}
              name="lastName"
              placeholder="Nachname"
              error={touched.lastName && Boolean(errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
            <Field
              component={TextField}
              name="uniqueIdentifier"
              placeholder="Eindeutiger Bezeichner"
              error={
                touched.uniqueIdentifier && Boolean(errors.uniqueIdentifier)
              }
              helperText={touched.uniqueIdentifier && errors.uniqueIdentifier}
            />
            <Box>
              <GeneralButton
                onAction={() => handleSubmit()}
                isPrimary={false}
                label="Absenden"
                disabled={Object.keys(errors).length > 0}
              />
            </Box>
          </StyledForm>
        )}
      </Formik>
    </Wrapper>
  );
}
