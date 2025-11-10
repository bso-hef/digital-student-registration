import React, { useEffect } from "react";

import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import { validateStudentCompanyData } from "@/lib/validate/student.validate";
import { updateStudentOnboardingData } from "@/store/actions/studentActions";
import { useAppDispatch } from "@/store/store";
import { StudentData } from "@/types/student";
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
  betriebApAnrede: string;
  betriebApVorname: string;
  betriebApNachname: string;
  betriebApTelefon1: string;
}

interface CompanyContactFormProps {
  data?: Partial<StudentData>;
  onSubmit?: (values: FormValues) => void;
  formikRef?: React.RefObject<FormikProps<FormValues> | null>;
  onValidationChange?: (isValid: boolean) => void;
}

const CompanyContactForm: React.FC<CompanyContactFormProps> = ({
  data,
  onSubmit,
  formikRef,
  onValidationChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { salutationOptions, getEnabledOptions, loading } =
    useOnboardingSettings();

  const initialValues: FormValues = {
    betriebApAnrede: data?.betriebApAnrede || "",
    betriebApVorname: data?.betriebApVorname || "",
    betriebApNachname: data?.betriebApNachname || "",
    betriebApTelefon1: data?.betriebApTelefon1 || "",
  };

  // Track validation state changes (must be before early return)
  useEffect(() => {
    if (formikRef?.current && onValidationChange) {
      onValidationChange(formikRef.current.isValid);
    }
  });

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validateStudentCompanyData}
      onSubmit={(values) => {
        dispatch(updateStudentOnboardingData(values));
        // Pass values to parent to ensure immediate save to database
        if (onSubmit) onSubmit(values);
      }}
      innerRef={formikRef}
    >
      {({ errors, touched }) => (
        <StyledForm>
          {/* betriebApAnrede - Dynamic Dropdown */}
          <Field
            component={Select}
            name="betriebApAnrede"
            label={t("onboarding.companyContact.salutation")}
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebApAnrede && Boolean(errors.betriebApAnrede)}
          >
            {getEnabledOptions(salutationOptions).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field>

          {/* betriebApVorname */}
          <Field
            component={TextField}
            name="betriebApVorname"
            label={t("onboarding.companyContact.firstName")}
            variant="outlined"
            margin="normal"
            fullWidth
            error={touched.betriebApVorname && Boolean(errors.betriebApVorname)}
            helperText={touched.betriebApVorname && errors.betriebApVorname}
          />

          {/* betriebApNachname */}
          <Field
            component={TextField}
            name="betriebApNachname"
            label={t("onboarding.companyContact.lastName")}
            variant="outlined"
            margin="normal"
            fullWidth
            error={
              touched.betriebApNachname && Boolean(errors.betriebApNachname)
            }
            helperText={touched.betriebApNachname && errors.betriebApNachname}
          />

          {/* betriebApTelefon1 */}
          <Field
            component={TextField}
            name="betriebApTelefon1"
            label={t("onboarding.companyContact.phone")}
            variant="outlined"
            margin="normal"
            fullWidth
            error={
              touched.betriebApTelefon1 && Boolean(errors.betriebApTelefon1)
            }
            helperText={touched.betriebApTelefon1 && errors.betriebApTelefon1}
          />
        </StyledForm>
      )}
    </Formik>
  );
};

export default CompanyContactForm;
