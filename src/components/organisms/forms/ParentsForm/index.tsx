import React from "react";

import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import { validateStudentContactPersonData } from "@/lib/validate/student.validate";
import { updateStudentOnboardingData } from "@/store/actions/studentActions";
import { useAppDispatch } from "@/store/store";
import { StudentData } from "@/types/student";
import { MenuItem, styled } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { Select, TextField } from "formik-mui";

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
  onSubmit?: (values: FormValues) => void;
}

const ParentsForm: React.FC<ParentsFormProps> = ({ data, onSubmit }) => {
  const dispatch = useAppDispatch();
  const { contactPersonTypeOptions, getEnabledOptions, loading } =
    useOnboardingSettings();

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

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validateStudentContactPersonData}
      onSubmit={(values) => {
        dispatch(updateStudentOnboardingData(values));
        if (onSubmit) onSubmit(values);
      }}
    >
      {({ errors, touched }) => (
        <StyledForm>
          {/* ansprechpartner1Art - Dynamic Dropdown */}
          <Field
            component={Select}
            name="ansprechpartner1Art"
            label="Ansprechpartner Art"
            variant="outlined"
            margin="normal"
            fullWidth
            error={
              touched.ansprechpartner1Art && Boolean(errors.ansprechpartner1Art)
            }
          >
            {getEnabledOptions(contactPersonTypeOptions).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field>

          {/* ansprechpartner1Vorname */}
          <Field
            component={TextField}
            name="ansprechpartner1Vorname"
            label="Vorname"
            variant="outlined"
            margin="normal"
            fullWidth
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
            fullWidth
            error={
              touched.ansprechpartner1Nachname &&
              Boolean(errors.ansprechpartner1Nachname)
            }
            helperText={
              touched.ansprechpartner1Nachname &&
              errors.ansprechpartner1Nachname
            }
          />

          {/* ansprechpartner1Plz */}
          <Field
            component={TextField}
            name="ansprechpartner1Plz"
            label="PLZ"
            variant="outlined"
            margin="normal"
            fullWidth
            error={
              touched.ansprechpartner1Plz && Boolean(errors.ansprechpartner1Plz)
            }
            helperText={
              touched.ansprechpartner1Plz && errors.ansprechpartner1Plz
            }
          />

          {/* ansprechpartner1Ort */}
          <Field
            component={TextField}
            name="ansprechpartner1Ort"
            label="Ort"
            variant="outlined"
            margin="normal"
            fullWidth
            error={
              touched.ansprechpartner1Ort && Boolean(errors.ansprechpartner1Ort)
            }
            helperText={
              touched.ansprechpartner1Ort && errors.ansprechpartner1Ort
            }
          />

          {/* ansprechpartner1Straße */}
          <Field
            component={TextField}
            name="ansprechpartner1Straße"
            label="Straße"
            variant="outlined"
            margin="normal"
            fullWidth
            error={
              touched.ansprechpartner1Straße &&
              Boolean(errors.ansprechpartner1Straße)
            }
            helperText={
              touched.ansprechpartner1Straße && errors.ansprechpartner1Straße
            }
          />

          {/* ansprechpartner1HausNr */}
          <Field
            component={TextField}
            name="ansprechpartner1HausNr"
            label="Hausnummer"
            variant="outlined"
            margin="normal"
            fullWidth
            error={
              touched.ansprechpartner1HausNr &&
              Boolean(errors.ansprechpartner1HausNr)
            }
            helperText={
              touched.ansprechpartner1HausNr && errors.ansprechpartner1HausNr
            }
          />

          {/* ansprechpartner1Mobil */}
          <Field
            component={TextField}
            name="ansprechpartner1Mobil"
            label="Mobilnummer"
            variant="outlined"
            margin="normal"
            fullWidth
            error={
              touched.ansprechpartner1Mobil &&
              Boolean(errors.ansprechpartner1Mobil)
            }
            helperText={
              touched.ansprechpartner1Mobil && errors.ansprechpartner1Mobil
            }
          />

          {/* ansprechpartner1Telefon1 */}
          <Field
            component={TextField}
            name="ansprechpartner1Telefon1"
            label="Telefon"
            variant="outlined"
            margin="normal"
            fullWidth
            error={
              touched.ansprechpartner1Telefon1 &&
              Boolean(errors.ansprechpartner1Telefon1)
            }
            helperText={
              touched.ansprechpartner1Telefon1 &&
              errors.ansprechpartner1Telefon1
            }
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default ParentsForm;
