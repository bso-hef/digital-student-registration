import React, { useEffect, useMemo } from "react";

import FormikConfiguredAutocomplete from "@/components/atoms/dropdowns/FormikConfiguredAutocomplete";
import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import { createValidateStudentPreviousSchoolData } from "@/lib/validate/student.validate";
import { updateStudentOnboardingData } from "@/store/actions/studentActions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ClassInterface } from "@/types/class.d";
import { FormControl, MenuItem, styled } from "@mui/material";
import { FormikProps } from "formik";
import { Field, Form, Formik } from "formik";
import { Select, TextField } from "formik-mui";
import { useTranslation } from "react-i18next";

const StyledForm = styled(Form)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "center",
  width: "100%",
  height: "auto",
  gap: theme.spacing(2),
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
  currentClass?: ClassInterface | null;
}

const PreEducationForm: React.FC<PreEducationFormProps> = ({
  data: dataProp,
  onSubmit,
  formikRef,
  onValidationChange,
  currentClass,
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

  // Get data from Redux if not provided via props
  const studentDataFromRedux = useAppSelector((state) => state.student.data);
  const data = dataProp || studentDataFromRedux;

  // Calculate previous level based on current class grade
  // If student is in grade 11, previous level would be "Klasse 10"
  const calculatePreviousLevel = (grade: number | null): string => {
    if (!grade || grade <= 1) return "";
    const previousGrade = grade - 1;
    return `Klasse ${previousGrade}`;
  };

  // Determine appropriate school type based on previous grade level
  // Grundschule: grades 1-4
  // Hauptschule/Realschule/Gymnasium/Gesamtschule: grades 5-10
  // For grades 11-14, typically came from Gymnasium or Gesamtschule
  // For vocational classes, typically came from Berufsschule or one of the secondary schools
  const calculatePreviousSchoolType = (grade: number | null): string => {
    if (!grade || grade <= 1) return "";
    const previousGrade = grade - 1;

    // Grundschule: grades 1-4
    if (previousGrade >= 1 && previousGrade <= 4) {
      return "Grundschule";
    }
    // Grades 5-10: Could be any secondary school type
    // Default to Gesamtschule as it's the most general option
    else if (previousGrade >= 5 && previousGrade <= 10) {
      return "Gesamtschule";
    }
    // Grades 11-14: Typically Gymnasium or Gesamtschule
    // Default to Gymnasium for upper grades
    else if (previousGrade >= 11) {
      return "Gymnasium";
    }

    return "";
  };

  const previousLevelFromClass = currentClass?.grade
    ? calculatePreviousLevel(currentClass.grade)
    : "";

  const previousSchoolTypeFromClass = currentClass?.grade
    ? calculatePreviousSchoolType(currentClass.grade)
    : "";

  const initialValues: FormValues = {
    vorhergehendeSchule: data?.vorhergehendeSchule || "",
    vorhergehendeStufe:
      data?.vorhergehendeStufe || previousLevelFromClass || "",
    vorhergehendeSchulform:
      data?.vorhergehendeSchulform || previousSchoolTypeFromClass || "",
    abschluesse: data?.abschluesse || "Kein", // Default to "Kein" (no qualification)
  };

  // Create dynamic validation schema with settings
  const validationSchema = useMemo(
    () =>
      createValidateStudentPreviousSchoolData(
        getOptionValues(schoolLevelOptions),
        getOptionValues(schoolTypeOptions),
        getOptionValues(degreeOptions),
        fieldConfigs.abschluesse,
        fieldConfigs.vorhergehendeSchulform,
      ),
    [
      schoolLevelOptions,
      schoolTypeOptions,
      degreeOptions,
      fieldConfigs.abschluesse,
      fieldConfigs.vorhergehendeSchulform,
      getOptionValues,
    ],
  );

  // Track validation state changes (must be before early return)
  useEffect(() => {
    if (formikRef?.current && onValidationChange) {
      const { isValid, isValidating } = formikRef.current;
      if (!isValidating) {
        onValidationChange(isValid);
      }
    }
  }, [formikRef, onValidationChange]);

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      validateOnMount
      validateOnChange
      validateOnBlur
      onSubmit={(values) => {
        dispatch(updateStudentOnboardingData(values));
        // Pass values to parent to ensure immediate save to database
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
            fullWidth
            required
            error={
              touched.vorhergehendeSchule && Boolean(errors.vorhergehendeSchule)
            }
            helperText={
              touched.vorhergehendeSchule && errors.vorhergehendeSchule
            }
          />

          {/* vorhergehendeStufe - Dynamic Dropdown */}
          <FormControl fullWidth>
            <Field
              component={Select}
              name="vorhergehendeStufe"
              label={t("onboarding.preEducation.previousLevel")}
              variant="outlined"
              fullWidth
              required
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
          </FormControl>

          <FormikConfiguredAutocomplete
            name="vorhergehendeSchulform"
            fieldConfigKey="vorhergehendeSchulform"
            label={t("onboarding.preEducation.previousSchoolType")}
            options={schoolTypeOptions}
            fullWidth
          />

          <FormikConfiguredAutocomplete
            name="abschluesse"
            fieldConfigKey="abschluesse"
            label={t("onboarding.preEducation.qualifications")}
            options={degreeOptions}
            emptyValue="Kein"
            fullWidth
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default PreEducationForm;
