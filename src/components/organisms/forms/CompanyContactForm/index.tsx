import React, { useEffect, useMemo, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import FormikDropdown from "@/components/atoms/dropdowns/FormikDropdown";
import EnhancedCollapse from "@/components/molecules/EnhancedCollapse";
import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import { createValidateStudentCompanyContactData } from "@/lib/validate/student.validate";
import { updateStudentOnboardingData } from "@/store/actions/studentActions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { StudentData } from "@/types/student";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Box, styled } from "@mui/material";
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
  gap: "16px",
}));

const StyledFieldsContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "8px",
}));

interface FormValues {
  // Contact 1
  betriebApAnrede: string;
  betriebApName: string;
  betriebApTelefon1: string;
  betriebApEmail: string;
  // Contact 2
  betriebAp2Anrede: string;
  betriebAp2Name: string;
  betriebAp2Telefon1: string;
  betriebAp2Email: string;
}

interface CompanyContactFormProps {
  data?: Partial<StudentData>;
  onSubmit?: (values: FormValues) => void;
  formikRef?: React.RefObject<FormikProps<FormValues> | null>;
  onValidationChange?: (isValid: boolean) => void;
}

const MAX_COMPANY_CONTACTS = 2;

const CompanyContactForm: React.FC<CompanyContactFormProps> = ({
  data: dataProp,
  onSubmit,
  formikRef,
  onValidationChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { salutationOptions, getEnabledOptions, getOptionValues, loading } =
    useOnboardingSettings();

  // Get data from Redux if not provided via props
  const studentDataFromRedux = useAppSelector((state) => state.student.data);
  const data = dataProp || studentDataFromRedux;

  // State for managing visible contacts and expanded state
  const [visibleContacts, setVisibleContacts] = useState<number[]>(() => {
    const contacts = [1];
    // Show contact 2 if it has data
    if (data?.betriebAp2Name) {
      contacts.push(2);
    }
    return contacts;
  });

  const [expandedContact, setExpandedContact] = useState<number | null>(1);

  const initialValues: FormValues = {
    // Contact 1
    betriebApAnrede: data?.betriebApAnrede || "",
    betriebApName: data?.betriebApName || "",
    betriebApTelefon1: data?.betriebApTelefon1 || "",
    betriebApEmail: data?.betriebApEmail || "",
    // Contact 2
    betriebAp2Anrede: data?.betriebAp2Anrede || "",
    betriebAp2Name: data?.betriebAp2Name || "",
    betriebAp2Telefon1: data?.betriebAp2Telefon1 || "",
    betriebAp2Email: data?.betriebAp2Email || "",
  };

  // Create validation schema with salutation options
  const validationSchema = useMemo(
    () =>
      createValidateStudentCompanyContactData(
        getOptionValues(salutationOptions),
      ),
    [salutationOptions, getOptionValues],
  );

  // Track validation state changes (must be before early return)
  useEffect(() => {
    if (formikRef?.current && onValidationChange) {
      onValidationChange(formikRef.current.isValid);
    }
  });

  if (loading) {
    return <div>Loading settings...</div>;
  }

  const handleAddContact = () => {
    if (visibleContacts.length < MAX_COMPANY_CONTACTS) {
      setVisibleContacts([...visibleContacts, 2]);
      setExpandedContact(2);
    }
  };

  const handleRemoveContact = (
    contactNumber: number,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    // Clear contact 2 fields
    setFieldValue("betriebAp2Anrede", "");
    setFieldValue("betriebAp2Name", "");
    setFieldValue("betriebAp2Telefon1", "");
    setFieldValue("betriebAp2Email", "");
    // Remove from visible
    setVisibleContacts(visibleContacts.filter((c) => c !== contactNumber));
    setExpandedContact(1);
  };

  const toggleExpand = (contactNumber: number) => {
    setExpandedContact(
      expandedContact === contactNumber ? null : contactNumber,
    );
  };

  const renderContact1Fields = (
    errors: Record<string, string | undefined>,
    touched: Record<string, boolean | undefined>,
  ) => (
    <StyledFieldsContainer>
      {/* Salutation */}
      <FormikDropdown
        name="betriebApAnrede"
        label={t("onboarding.companyContact.salutation")}
        options={getEnabledOptions(salutationOptions)}
        required
      />

      {/* Name */}
      <Field
        component={TextField}
        name="betriebApName"
        label={t("onboarding.companyContact.name")}
        variant="outlined"
        margin="normal"
        fullWidth
        required
        error={touched.betriebApName && Boolean(errors.betriebApName)}
        helperText={touched.betriebApName && errors.betriebApName}
      />

      {/* Phone */}
      <Field
        component={TextField}
        name="betriebApTelefon1"
        label={t("onboarding.companyContact.phone")}
        variant="outlined"
        margin="normal"
        fullWidth
        required
        error={touched.betriebApTelefon1 && Boolean(errors.betriebApTelefon1)}
        helperText={touched.betriebApTelefon1 && errors.betriebApTelefon1}
      />

      {/* Email */}
      <Field
        component={TextField}
        name="betriebApEmail"
        label={t("onboarding.companyContact.email")}
        variant="outlined"
        margin="normal"
        fullWidth
        required
        type="email"
        error={touched.betriebApEmail && Boolean(errors.betriebApEmail)}
        helperText={touched.betriebApEmail && errors.betriebApEmail}
      />
    </StyledFieldsContainer>
  );

  const renderContact2Fields = (
    errors: Record<string, string | undefined>,
    touched: Record<string, boolean | undefined>,
  ) => (
    <StyledFieldsContainer>
      {/* Salutation */}
      <FormikDropdown
        name="betriebAp2Anrede"
        label={t("onboarding.companyContact.salutation")}
        options={getEnabledOptions(salutationOptions)}
        required
      />

      {/* Name */}
      <Field
        component={TextField}
        name="betriebAp2Name"
        label={t("onboarding.companyContact.name")}
        variant="outlined"
        margin="normal"
        fullWidth
        required
        error={touched.betriebAp2Name && Boolean(errors.betriebAp2Name)}
        helperText={touched.betriebAp2Name && errors.betriebAp2Name}
      />

      {/* Phone */}
      <Field
        component={TextField}
        name="betriebAp2Telefon1"
        label={t("onboarding.companyContact.phone")}
        variant="outlined"
        margin="normal"
        fullWidth
        required
        error={touched.betriebAp2Telefon1 && Boolean(errors.betriebAp2Telefon1)}
        helperText={touched.betriebAp2Telefon1 && errors.betriebAp2Telefon1}
      />

      {/* Email */}
      <Field
        component={TextField}
        name="betriebAp2Email"
        label={t("onboarding.companyContact.email")}
        variant="outlined"
        margin="normal"
        fullWidth
        required
        type="email"
        error={touched.betriebAp2Email && Boolean(errors.betriebAp2Email)}
        helperText={touched.betriebAp2Email && errors.betriebAp2Email}
      />
    </StyledFieldsContainer>
  );

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
      {({ errors, touched, values, setFieldValue }) => (
        <StyledForm>
          {/* Add Contact button at the top */}
          {visibleContacts.length < MAX_COMPANY_CONTACTS && (
            <GeneralButton
              label={t("onboarding.companyContact.addContact")}
              onAction={handleAddContact}
              isPrimary={false}
              startIcon={<AddRoundedIcon />}
              fullWidth
            />
          )}

          {/* Contact 1 - Always visible, cannot be deleted */}
          <Box sx={{ width: "100%" }}>
            <EnhancedCollapse
              title={t("onboarding.companyContact.contact1")}
              subtitle={values.betriebApName || undefined}
              expanded={expandedContact === 1}
              onAction={() => toggleExpand(1)}
              withArrow
            >
              {renderContact1Fields(errors, touched)}
            </EnhancedCollapse>
          </Box>

          {/* Contact 2 - Optional, can be deleted */}
          {visibleContacts.includes(2) && (
            <Box sx={{ width: "100%" }}>
              <EnhancedCollapse
                title={t("onboarding.companyContact.contact2")}
                subtitle={values.betriebAp2Name || undefined}
                expanded={expandedContact === 2}
                onAction={() => toggleExpand(2)}
                withArrow
                headerAction={
                  <SmallIconButton
                    icon={<DeleteRoundedIcon />}
                    customColor="#d32f2f"
                    hoverAllowed
                    noMargin
                    title={t("onboarding.companyContact.removeContact")}
                    placement="top"
                    onAction={() => handleRemoveContact(2, setFieldValue)}
                  />
                }
                onHeaderActionClick={() =>
                  handleRemoveContact(2, setFieldValue)
                }
              >
                {renderContact2Fields(errors, touched)}
              </EnhancedCollapse>
            </Box>
          )}
        </StyledForm>
      )}
    </Formik>
  );
};

export default CompanyContactForm;
