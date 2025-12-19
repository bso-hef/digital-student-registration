import React, { useEffect, useMemo } from "react";

import FormikDropdown from "@/components/atoms/dropdowns/FormikDropdown";
import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import {
  createValidateStudentTrainingData,
  validateStudentTrainingData,
} from "@/lib/validate/student.validate";
import { updateStudentOnboardingData } from "@/store/actions/studentActions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { StudentData } from "@/types/student";
import { styled } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { FormikProps } from "formik";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
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
  betriebEintritt: Dayjs | null;
  betriebName: string;
  betriebStraße: string;
  betriebHausNr: string;
  betriebPlz: string;
  betriebOrt: string;
  betriebTelefon1: string;
  betriebEmail: string;
}

interface TrainingFormProps {
  data?: Partial<StudentData>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (values: any) => void;
  formikRef?: React.RefObject<FormikProps<FormValues> | null>;
  onValidationChange?: (isValid: boolean) => void;
}

const TrainingForm: React.FC<TrainingFormProps> = ({
  data: dataProp,
  onSubmit,
  formikRef,
  onValidationChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // Get data from Redux if not provided via props
  const studentDataFromRedux = useAppSelector((state) => state.student.data);
  const data = dataProp || studentDataFromRedux;

  const {
    professionOptions,
    fieldConfigs,
    getOptionValues,
    getEnabledOptions,
    loading,
  } = useOnboardingSettings();

  const initialValues: FormValues = {
    beruf: data?.beruf || "",
    betriebEintritt: data?.betriebEintritt ? dayjs(data.betriebEintritt) : null,
    betriebName: data?.betriebName || "",
    betriebStraße: data?.betriebStraße || "",
    betriebHausNr: data?.betriebHausNr || "",
    betriebPlz: data?.betriebPlz || "",
    betriebOrt: data?.betriebOrt || "",
    betriebTelefon1: data?.betriebTelefon1 || "",
    betriebEmail: data?.betriebEmail || "",
  };

  // Create dynamic validation schema with settings
  const validationSchema = useMemo(() => {
    if (professionOptions.length > 0) {
      const allowCustom = fieldConfigs?.beruf?.allowCustom ?? true;
      return createValidateStudentTrainingData(
        getOptionValues(professionOptions),
        allowCustom,
      );
    }
    return validateStudentTrainingData;
  }, [professionOptions, fieldConfigs, getOptionValues]);

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
        // Convert Dayjs to string for storage
        const dataToSave = {
          ...values,
          betriebEintritt: values.betriebEintritt
            ? values.betriebEintritt.format("YYYY-MM-DD")
            : "",
        };
        dispatch(updateStudentOnboardingData(dataToSave));
        // Pass values to parent to ensure immediate save to database
        if (onSubmit) onSubmit(dataToSave);
      }}
      innerRef={formikRef}
    >
      {({ errors, touched, values, setFieldValue }) => (
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
              required
              error={touched.beruf && Boolean(errors.beruf)}
              helperText={touched.beruf && errors.beruf}
            />
          ) : (
            <FormikDropdown
              name="beruf"
              label={t("onboarding.training.profession")}
              options={getEnabledOptions(professionOptions)}
              required
            />
          )}

          {/* betriebEintritt */}
          <DatePicker
            value={values.betriebEintritt}
            onChange={(newValue) => setFieldValue("betriebEintritt", newValue)}
            label={t("onboarding.training.companyStartDate")}
            slotProps={{
              textField: {
                variant: "outlined",
                fullWidth: true,
                margin: "normal",
                required: true,
                error:
                  touched.betriebEintritt && Boolean(errors.betriebEintritt),
                helperText:
                  touched.betriebEintritt && errors.betriebEintritt
                    ? String(errors.betriebEintritt)
                    : undefined,
              },
            }}
          />

          {/* betriebName */}
          <Field
            component={TextField}
            name="betriebName"
            label={t("onboarding.training.companyName")}
            variant="outlined"
            margin="normal"
            fullWidth
            required
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
            required
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
            required
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
            required
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
            required
            error={touched.betriebOrt && Boolean(errors.betriebOrt)}
            helperText={touched.betriebOrt && errors.betriebOrt}
          />

          {/* betriebTelefon1 */}
          <Field
            component={TextField}
            name="betriebTelefon1"
            label={t("onboarding.training.phone")}
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebTelefon1 && Boolean(errors.betriebTelefon1)}
            helperText={touched.betriebTelefon1 && errors.betriebTelefon1}
          />

          {/* betriebEmail */}
          <Field
            component={TextField}
            name="betriebEmail"
            label={t("onboarding.training.email")}
            type="email"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            error={touched.betriebEmail && Boolean(errors.betriebEmail)}
            helperText={touched.betriebEmail && errors.betriebEmail}
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default TrainingForm;
