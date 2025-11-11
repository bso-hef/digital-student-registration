"use client";

import React, { useEffect } from "react";

import DynamicMuiIcon from "@/components/atoms/DynamicMuiIcon";
import { useAgreementSettings } from "@/hooks/useAgreementSettings";
import { updateStudentOnboardingData } from "@/store/actions/studentActions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Box, Checkbox, Typography, styled } from "@mui/material";
import { Form, Formik, FormikProps } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

// Styled components for new card design
const StyledForm = styled(Form)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "center",
  width: "100%",
  height: "auto",
  gap: theme.spacing(2),
}));

const AgreementCard = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.surface.interface.base,
  border: `1px solid ${theme.palette.border.seperator}`,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.surface.button.hoverLight,
  },
}));

const CheckboxContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  paddingTop: theme.spacing(0.5),
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.icon.secondary,
  paddingTop: theme.spacing(1),
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  gap: theme.spacing(0.5),
  textAlign: "left",
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: "0.75rem",
  marginTop: theme.spacing(0.5),
  paddingLeft: theme.spacing(7),
}));

interface FormValues {
  [key: string]: boolean;
}

interface AgreementsFormProps {
  data?: Partial<FormValues>;
  onSubmit?: (values: FormValues) => void;
  formikRef?: React.RefObject<FormikProps<FormValues> | null>;
  onValidationChange?: (isValid: boolean) => void;
}

const AgreementsForm: React.FC<AgreementsFormProps> = ({
  data: dataProp,
  onSubmit,
  formikRef,
  onValidationChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const {
    enabledAgreements,
    loading,
    getAgreementLabel,
    getAgreementDescription,
  } = useAgreementSettings();

  const studentDataFromRedux = useAppSelector((state) => state.student.data);
  const data = dataProp || studentDataFromRedux;

  const initialValues: FormValues = {};
  enabledAgreements.forEach((agreement) => {
    const fieldName = agreement.key;
    initialValues[fieldName] =
      (data as Record<string, boolean>)?.[fieldName] || false;
  });

  const validationSchema = Yup.object(
    enabledAgreements.reduce(
      (schema, agreement) => {
        if (agreement.required) {
          schema[agreement.key] = Yup.boolean()
            .oneOf([true], t("onboarding.agreements.required"))
            .required(t("onboarding.agreements.required"));
        } else {
          schema[agreement.key] = Yup.boolean();
        }
        return schema;
      },
      {} as Record<string, Yup.BooleanSchema>,
    ),
  );

  // Track validation changes whenever form values change
  useEffect(() => {
    if (formikRef?.current && onValidationChange) {
      const validateAndNotify = async () => {
        const errors = await formikRef.current?.validateForm();
        // Form is valid if there are no errors (empty object or undefined)
        const isValid = !errors || Object.keys(errors).length === 0;
        onValidationChange(isValid);
      };
      validateAndNotify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formikRef?.current?.values, enabledAgreements, onValidationChange]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" padding={4}>
        <Typography variant="body2" color="text.secondary">
          {t("general.loading")}...
        </Typography>
      </Box>
    );
  }

  if (enabledAgreements.length === 0) {
    return (
      <Box display="flex" justifyContent="center" padding={4}>
        <Typography variant="body2" color="text.secondary">
          {t("onboarding.agreements.noAgreements")}
        </Typography>
      </Box>
    );
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
        if (onSubmit) onSubmit(values);
      }}
      innerRef={formikRef}
    >
      {({
        errors,
        touched,
        values,
        setFieldValue,
        setFieldTouched,
        validateField,
      }) => (
        <StyledForm>
          {enabledAgreements.map((agreement) => {
            const fieldName = agreement.key;
            const label = getAgreementLabel(agreement);
            const description = getAgreementDescription(agreement);
            const hasError = touched[fieldName] && errors[fieldName];
            const isChecked = values[fieldName] || false;

            return (
              <Box key={agreement.id}>
                <AgreementCard>
                  {/* Large Checkbox on Left */}
                  <CheckboxContainer>
                    <Checkbox
                      checked={isChecked}
                      onChange={async (e) => {
                        const newValue = e.target.checked;
                        await setFieldValue(fieldName, newValue, false);
                        setFieldTouched(fieldName, true, false);
                        // Immediately validate this field to clear/show errors
                        await validateField(fieldName);
                        // Also trigger full form validation to update parent
                        if (formikRef?.current && onValidationChange) {
                          const errors = await formikRef.current.validateForm();
                          const isValid =
                            !errors || Object.keys(errors).length === 0;
                          onValidationChange(isValid);
                        }
                      }}
                      size="large"
                    />
                  </CheckboxContainer>

                  {/* Icon (if provided) */}
                  {agreement.icon && (
                    <IconContainer>
                      <DynamicMuiIcon
                        iconName={agreement.icon}
                        fontSize="large"
                      />
                    </IconContainer>
                  )}

                  {/* Title and Description on Right */}
                  <ContentContainer>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, lineHeight: 1.4 }}
                    >
                      {label}
                    </Typography>
                    {description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {description}
                      </Typography>
                    )}
                  </ContentContainer>
                </AgreementCard>

                {/* Error Message */}
                {hasError && <ErrorText>{errors[fieldName]}</ErrorText>}
              </Box>
            );
          })}
        </StyledForm>
      )}
    </Formik>
  );
};

export default AgreementsForm;
