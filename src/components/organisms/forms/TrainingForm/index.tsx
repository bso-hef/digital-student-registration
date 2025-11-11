import React, { useEffect, useMemo } from "react";

import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import {
  createValidateStudentCompanyData,
  validateStudentCompanyData,
} from "@/lib/validate/student.validate";
import { updateStudentOnboardingData } from "@/store/actions/studentActions";
import { useAppDispatch } from "@/store/store";
import { MenuItem, styled } from "@mui/material";
import { FormikProps } from "formik";
import { Field, Form, Formik } from "formik";
import { Select, TextField } from "formik-mui";
import { useTranslation } from "react-i18next";

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
  onSubmit?: (values: FormValues) => void;
  formikRef?: React.RefObject<FormikProps<FormValues> | null>;
  onValidationChange?: (isValid: boolean) => void;
}

const TrainingForm: React.FC<TrainingFormProps> = ({
  data,
  onSubmit,
  formikRef,
  onValidationChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    professionOptions,
    salutationOptions,
    fieldConfigs,
    getOptionValues,
    getEnabledOptions,
    loading,
  } = useOnboardingSettings();

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

  // Create dynamic validation schema with settings
  const validationSchema = useMemo(() => {
    if (professionOptions.length > 0 && salutationOptions.length > 0) {
      const allowCustom = fieldConfigs?.beruf?.allowCustom ?? true;
      return createValidateStudentCompanyData(
        getOptionValues(professionOptions),
        getOptionValues(salutationOptions),
        allowCustom,
      );
    }
    return validateStudentCompanyData;
  }, [professionOptions, salutationOptions, fieldConfigs, getOptionValues]);

  // Track validation state changes (must be before early return)
  useEffect(() => {
    if (formikRef?.current && onValidationChange) {
      onValidationChange(formikRef.current.isValid);
    }
  });

  if (loading) {
    return <div>Loading settings...</div>;
  }

  const allowCustomProfession = fieldConfigs?.beruf?.allowCustom ?? true;

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        dispatch(updateStudentOnboardingData(values));
        // Pass values to parent to ensure immediate save to database
        if (onSubmit) onSubmit(values);
      }}
      innerRef={formikRef}
    >
      {({ errors, touched }) => (
        <StyledForm>
          {/* Beruf - Dynamic Dropdown or Text Field */}
          {allowCustomProfession ? (
            <Field
              component={TextField}
              name="beruf"
              label={t("onboarding.training.profession")}
              variant="outlined"
              margin="normal"
              fullWidth
              error={touched.beruf && Boolean(errors.beruf)}
              helperText={touched.beruf && errors.beruf}
            />
          ) : (
            <Field
              component={Select}
              name="beruf"
              label={t("onboarding.training.profession")}
              variant="outlined"
              margin="normal"
              fullWidth
              error={touched.beruf && Boolean(errors.beruf)}
            >
              {getEnabledOptions(professionOptions).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field>
          )}

          {/* betriebEintritt */}
          <Field
            component={TextField}
            name="betriebEintritt"
            label={t("onboarding.training.companyStartDate")}
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebEintritt && Boolean(errors.betriebEintritt)}
            helperText={touched.betriebEintritt && errors.betriebEintritt}
          />

          {/* betriebName */}
          <Field
            component={TextField}
            name="betriebName"
            label={t("onboarding.training.companyName")}
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebName && Boolean(errors.betriebName)}
            helperText={touched.betriebName && errors.betriebName}
          />

          {/* betriebStraße */}
          <Field
            component={TextField}
            name="betriebStraße"
            label={t("onboarding.training.street")}
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebStraße && Boolean(errors.betriebStraße)}
            helperText={touched.betriebStraße && errors.betriebStraße}
          />

          {/* betriebHausNr */}
          <Field
            component={TextField}
            name="betriebHausNr"
            label={t("onboarding.training.houseNumber")}
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebHausNr && Boolean(errors.betriebHausNr)}
            helperText={touched.betriebHausNr && errors.betriebHausNr}
          />

          {/* betriebPlz */}
          <Field
            component={TextField}
            name="betriebPlz"
            label={t("onboarding.training.postalCode")}
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebPlz && Boolean(errors.betriebPlz)}
            helperText={touched.betriebPlz && errors.betriebPlz}
          />

          {/* betriebOrt */}
          <Field
            component={TextField}
            name="betriebOrt"
            label={t("onboarding.training.city")}
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebOrt && Boolean(errors.betriebOrt)}
            helperText={touched.betriebOrt && errors.betriebOrt}
          />

          {/* betriebTel */}
          <Field
            component={TextField}
            name="betriebTel"
            label={t("onboarding.training.phone")}
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebTel && Boolean(errors.betriebTel)}
            helperText={touched.betriebTel && errors.betriebTel}
          />

          {/* betriebMail */}
          <Field
            component={TextField}
            name="betriebMail"
            label={t("onboarding.training.email")}
            type="email"
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebMail && Boolean(errors.betriebMail)}
            helperText={touched.betriebMail && errors.betriebMail}
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default TrainingForm;
