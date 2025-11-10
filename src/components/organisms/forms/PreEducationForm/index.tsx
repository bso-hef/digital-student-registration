import React, { useEffect, useMemo } from "react";

import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import {
  createValidateStudentPreviousSchoolData,
  validateStudentPreviousSchoolData,
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
  vorhergehendeSchule: string;
  vorhergehendeStufe: string;
  vorhergehendeSchulform: string;
  abschluesse: string;
}

interface PreEducationFormProps {
  data?: Partial<FormValues>;
  onSubmit?: (values: FormValues) => void;
  formikRef?: React.RefObject<FormikProps<FormValues> | null>;
  onValidationChange?: (isValid: boolean) => void;
}

const PreEducationForm: React.FC<PreEducationFormProps> = ({
  data,
  onSubmit,
  formikRef,
  onValidationChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    schoolLevelOptions,
    schoolTypeOptions,
    degreeOptions,
    fieldConfigs,
    getOptionValues,
    getEnabledOptions,
    loading,
  } = useOnboardingSettings();

  const initialValues: FormValues = {
    vorhergehendeSchule: data?.vorhergehendeSchule || "",
    vorhergehendeStufe: data?.vorhergehendeStufe || "",
    vorhergehendeSchulform: data?.vorhergehendeSchulform || "",
    abschluesse: data?.abschluesse || "",
  };

  // Create dynamic validation schema with settings
  const validationSchema = useMemo(() => {
    if (
      schoolLevelOptions.length > 0 &&
      schoolTypeOptions.length > 0 &&
      degreeOptions.length > 0
    ) {
      const allowCustom = fieldConfigs?.abschluesse?.allowCustom ?? true;
      return createValidateStudentPreviousSchoolData(
        getOptionValues(schoolLevelOptions),
        getOptionValues(schoolTypeOptions),
        getOptionValues(degreeOptions),
        allowCustom,
      );
    }
    return validateStudentPreviousSchoolData;
  }, [
    schoolLevelOptions,
    schoolTypeOptions,
    degreeOptions,
    fieldConfigs,
    getOptionValues,
  ]);

  // Track validation state changes (must be before early return)
  useEffect(() => {
    if (formikRef?.current && onValidationChange) {
      onValidationChange(formikRef.current.isValid);
    }
  });

  if (loading) {
    return <div>Loading settings...</div>;
  }

  const allowCustomDegree = fieldConfigs?.abschluesse?.allowCustom ?? true;

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        dispatch(updateStudentOnboardingData(values));
        if (onSubmit) onSubmit(values);
      }}
      innerRef={formikRef}
    >
      {({ errors, touched }) => (
        <StyledForm>
          {/* vorhergehendeSchule */}
          <Field
            component={TextField}
            name="vorhergehendeSchule"
            label={t("onboarding.preEducation.previousSchoolName")}
            variant="outlined"
            margin="normal"
            fullWidth
            error={
              touched.vorhergehendeSchule && Boolean(errors.vorhergehendeSchule)
            }
            helperText={
              touched.vorhergehendeSchule && errors.vorhergehendeSchule
            }
          />

          {/* vorhergehendeStufe - Dynamic Dropdown */}
          <Field
            component={Select}
            name="vorhergehendeStufe"
            label={t("onboarding.preEducation.previousLevel")}
            variant="outlined"
            margin="normal"
            fullWidth
            error={
              touched.vorhergehendeStufe && Boolean(errors.vorhergehendeStufe)
            }
          >
            {getEnabledOptions(schoolLevelOptions).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field>

          {/* vorhergehendeSchulform - Dynamic Dropdown */}
          <Field
            component={Select}
            name="vorhergehendeSchulform"
            label={t("onboarding.preEducation.previousSchoolType")}
            variant="outlined"
            margin="normal"
            fullWidth
            error={
              touched.vorhergehendeSchulform &&
              Boolean(errors.vorhergehendeSchulform)
            }
          >
            {getEnabledOptions(schoolTypeOptions).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field>

          {/* Abschluesse - Dynamic Dropdown or Text Field */}
          {allowCustomDegree ? (
            <Field
              component={TextField}
              name="abschluesse"
              label={t("onboarding.preEducation.qualifications")}
              variant="outlined"
              margin="normal"
              fullWidth
              error={touched.abschluesse && Boolean(errors.abschluesse)}
              helperText={touched.abschluesse && errors.abschluesse}
            />
          ) : (
            <Field
              component={Select}
              name="abschluesse"
              label={t("onboarding.preEducation.qualifications")}
              variant="outlined"
              margin="normal"
              fullWidth
              error={touched.abschluesse && Boolean(errors.abschluesse)}
            >
              {getEnabledOptions(degreeOptions).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field>
          )}
        </StyledForm>
      )}
    </Formik>
  );
};

export default PreEducationForm;
