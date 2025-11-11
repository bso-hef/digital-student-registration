import React, { useEffect, useMemo } from "react";

import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import {
  createValidateStudentPreviousSchoolData,
  validateStudentPreviousSchoolData,
} from "@/lib/validate/student.validate";
import { updateStudentOnboardingData } from "@/store/actions/studentActions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ClassInterface } from "@/types/class.d";
import {
  Autocomplete,
  FormControl,
  TextField as MUITextField,
  MenuItem,
  styled,
} from "@mui/material";
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
  // For grades 11-13, typically came from Gymnasium or Gesamtschule
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
    // Grades 11-13: Typically Gymnasium or Gesamtschule
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
  const validationSchema = useMemo(() => {
    if (
      schoolLevelOptions.length > 0 &&
      schoolTypeOptions.length > 0 &&
      degreeOptions.length > 0
    ) {
      return createValidateStudentPreviousSchoolData(
        getOptionValues(schoolLevelOptions),
        getOptionValues(schoolTypeOptions),
        getOptionValues(degreeOptions),
        true, // Always allow custom values in Autocomplete
      );
    }
    return validateStudentPreviousSchoolData;
  }, [schoolLevelOptions, schoolTypeOptions, degreeOptions, getOptionValues]);

  // Track validation state changes (must be before early return)
  useEffect(() => {
    if (formikRef?.current && onValidationChange) {
      // Validate form and report status
      formikRef.current.validateForm().then(() => {
        if (formikRef.current) {
          onValidationChange(formikRef.current.isValid);
        }
      });
    }
  });

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
      {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
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

          {/* vorhergehendeSchulform - Dynamic Dropdown */}
          <FormControl fullWidth>
            <Field
              component={Select}
              name="vorhergehendeSchulform"
              label={t("onboarding.preEducation.previousSchoolType")}
              variant="outlined"
              fullWidth
              required
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
          </FormControl>

          {/* Abschluesse - Autocomplete */}
          <Autocomplete
            options={getEnabledOptions(degreeOptions)}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.label
            }
            isOptionEqualToValue={(option, value) => {
              if (typeof option === "string" && typeof value === "string") {
                return option === value;
              }
              if (typeof option === "string" && typeof value !== "string") {
                return option === value.value;
              }
              if (typeof option !== "string" && typeof value === "string") {
                return option.value === value;
              }
              return option.value === value.value;
            }}
            value={
              getEnabledOptions(degreeOptions).find(
                (opt) => opt.value === values.abschluesse,
              ) ??
              (values.abschluesse || null)
            }
            onChange={(_, newValue) => {
              const newDegree =
                typeof newValue === "string"
                  ? newValue
                  : newValue?.value || "Kein";
              setFieldValue("abschluesse", newDegree);
            }}
            onBlur={() => setFieldTouched("abschluesse", true)}
            fullWidth
            freeSolo
            renderInput={(params) => (
              <MUITextField
                {...params}
                label={t("onboarding.preEducation.qualifications")}
                variant="outlined"
                fullWidth
                error={touched.abschluesse && Boolean(errors.abschluesse)}
                helperText={touched.abschluesse && errors.abschluesse}
              />
            )}
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default PreEducationForm;
