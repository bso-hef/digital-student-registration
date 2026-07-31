import React, { useEffect, useMemo, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import FormikDropdown from "@/components/atoms/dropdowns/FormikDropdown";
import EnhancedCollapse from "@/components/molecules/EnhancedCollapse";
import { useOnboardingSettings } from "@/hooks/useOnboardingSettings";
import { createValidateStudentContactPersonData } from "@/lib/validate/student.validate";
import { updateStudentOnboardingData } from "@/store/actions/studentActions";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { StudentData } from "@/types/student";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Alert, Box, styled } from "@mui/material";
import dayjs from "dayjs";
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
  // Contact Person 1
  ansprechpartner1Art: string;
  ansprechpartner1Vorname: string;
  ansprechpartner1Nachname: string;
  ansprechpartner1Plz: string;
  ansprechpartner1Ort: string;
  ansprechpartner1Straße: string;
  ansprechpartner1HausNr: string;
  ansprechpartner1Mobil: string;
  ansprechpartner1Telefon1: string;
  ansprechpartner1Email: string;
  // Contact Person 2
  ansprechpartner2Art: string;
  ansprechpartner2Vorname: string;
  ansprechpartner2Nachname: string;
  ansprechpartner2Plz: string;
  ansprechpartner2Ort: string;
  ansprechpartner2Straße: string;
  ansprechpartner2HausNr: string;
  ansprechpartner2Mobil: string;
  ansprechpartner2Telefon1: string;
  ansprechpartner2Email: string;
  // Contact Person 3
  ansprechpartner3Art: string;
  ansprechpartner3Vorname: string;
  ansprechpartner3Nachname: string;
  ansprechpartner3Plz: string;
  ansprechpartner3Ort: string;
  ansprechpartner3Straße: string;
  ansprechpartner3HausNr: string;
  ansprechpartner3Mobil: string;
  ansprechpartner3Telefon1: string;
  ansprechpartner3Email: string;
}

interface ParentsFormProps {
  data?: Partial<StudentData>;
  onSubmit?: (values: FormValues) => void;
  formikRef?: React.RefObject<FormikProps<FormValues> | null>;
  onValidationChange?: (isValid: boolean) => void;
}

const ParentsForm: React.FC<ParentsFormProps> = ({
  data: dataProp,
  onSubmit,
  formikRef,
  onValidationChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    contactPersonTypeOptions,
    getEnabledOptions,
    loading,
    maxContactPersons,
  } = useOnboardingSettings();

  // Get data from Redux if not provided via props
  const studentDataFromRedux = useAppSelector((state) => state.student.data);
  const data = dataProp || studentDataFromRedux;

  // Calculate age from geburtsdatum
  const age = useMemo(() => {
    if (!data?.geburtsdatum) return 0;
    return dayjs().diff(dayjs(data.geburtsdatum), "year");
  }, [data.geburtsdatum]);

  const isAdult = age >= 18;

  // State for managing visible contacts and expanded state
  const [visibleContacts, setVisibleContacts] = useState<number[]>(() => {
    // Determine initially visible contacts based on existing data
    const contacts = [1];
    if (data?.ansprechpartner2Vorname || data?.ansprechpartner2Nachname) {
      contacts.push(2);
    }
    if (data?.ansprechpartner3Vorname || data?.ansprechpartner3Nachname) {
      contacts.push(3);
    }
    return contacts;
  });

  const [expandedContact, setExpandedContact] = useState<number | null>(1);

  const initialValues: FormValues = {
    // Contact Person 1
    ansprechpartner1Art: data?.ansprechpartner1Art || "",
    ansprechpartner1Vorname: data?.ansprechpartner1Vorname || "",
    ansprechpartner1Nachname: data?.ansprechpartner1Nachname || "",
    ansprechpartner1Plz: data?.ansprechpartner1Plz || "",
    ansprechpartner1Ort: data?.ansprechpartner1Ort || "",
    ansprechpartner1Straße: data?.ansprechpartner1Straße || "",
    ansprechpartner1HausNr: data?.ansprechpartner1HausNr || "",
    ansprechpartner1Mobil: data?.ansprechpartner1Mobil || "",
    ansprechpartner1Telefon1: data?.ansprechpartner1Telefon1 || "",
    ansprechpartner1Email: data?.ansprechpartner1Email || "",
    // Contact Person 2
    ansprechpartner2Art: data?.ansprechpartner2Art || "",
    ansprechpartner2Vorname: data?.ansprechpartner2Vorname || "",
    ansprechpartner2Nachname: data?.ansprechpartner2Nachname || "",
    ansprechpartner2Plz: data?.ansprechpartner2Plz || "",
    ansprechpartner2Ort: data?.ansprechpartner2Ort || "",
    ansprechpartner2Straße: data?.ansprechpartner2Straße || "",
    ansprechpartner2HausNr: data?.ansprechpartner2HausNr || "",
    ansprechpartner2Mobil: data?.ansprechpartner2Mobil || "",
    ansprechpartner2Telefon1: data?.ansprechpartner2Telefon1 || "",
    ansprechpartner2Email: data?.ansprechpartner2Email || "",
    // Contact Person 3
    ansprechpartner3Art: data?.ansprechpartner3Art || "",
    ansprechpartner3Vorname: data?.ansprechpartner3Vorname || "",
    ansprechpartner3Nachname: data?.ansprechpartner3Nachname || "",
    ansprechpartner3Plz: data?.ansprechpartner3Plz || "",
    ansprechpartner3Ort: data?.ansprechpartner3Ort || "",
    ansprechpartner3Straße: data?.ansprechpartner3Straße || "",
    ansprechpartner3HausNr: data?.ansprechpartner3HausNr || "",
    ansprechpartner3Mobil: data?.ansprechpartner3Mobil || "",
    ansprechpartner3Telefon1: data?.ansprechpartner3Telefon1 || "",
    ansprechpartner3Email: data?.ansprechpartner3Email || "",
  };

  // Use dynamic validation based on age
  const validationSchema = useMemo(
    () => createValidateStudentContactPersonData(age),
    [age],
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
    const nextContact = visibleContacts.length + 1;
    if (nextContact <= maxContactPersons) {
      setVisibleContacts([...visibleContacts, nextContact]);
      setExpandedContact(nextContact);
    }
  };

  const handleRemoveContact = (contactNumber: number) => {
    setVisibleContacts(visibleContacts.filter((c) => c !== contactNumber));
    if (expandedContact === contactNumber) {
      setExpandedContact(visibleContacts[0] || null);
    }
  };

  const toggleExpand = (contactNumber: number) => {
    setExpandedContact(
      expandedContact === contactNumber ? null : contactNumber,
    );
  };

  const renderContactFields = (
    contactNumber: number,
    errors: Record<string, string | undefined>,
    touched: Record<string, boolean | undefined>,
    isRequired: boolean,
  ) => {
    const prefix = `ansprechpartner${contactNumber}`;
    return (
      <StyledFieldsContainer>
        {/* Contact Type */}
        <FormikDropdown
          name={`${prefix}Art`}
          label={t("onboarding.legalGuardian.contactType")}
          options={getEnabledOptions(contactPersonTypeOptions)}
          required={isRequired}
        />

        {/* First Name */}
        <Field
          component={TextField}
          name={`${prefix}Vorname`}
          label={t("onboarding.legalGuardian.firstName")}
          variant="outlined"
          margin="normal"
          fullWidth
          required={isRequired}
          error={
            touched[`${prefix}Vorname`] && Boolean(errors[`${prefix}Vorname`])
          }
          helperText={touched[`${prefix}Vorname`] && errors[`${prefix}Vorname`]}
        />

        {/* Last Name */}
        <Field
          component={TextField}
          name={`${prefix}Nachname`}
          label={t("onboarding.legalGuardian.lastName")}
          variant="outlined"
          margin="normal"
          fullWidth
          required={isRequired}
          error={
            touched[`${prefix}Nachname`] && Boolean(errors[`${prefix}Nachname`])
          }
          helperText={
            touched[`${prefix}Nachname`] && errors[`${prefix}Nachname`]
          }
        />

        {/* Postal Code */}
        <Field
          component={TextField}
          name={`${prefix}Plz`}
          label={t("onboarding.legalGuardian.postalCode")}
          variant="outlined"
          margin="normal"
          fullWidth
          required={isRequired}
          error={touched[`${prefix}Plz`] && Boolean(errors[`${prefix}Plz`])}
          helperText={touched[`${prefix}Plz`] && errors[`${prefix}Plz`]}
        />

        {/* City */}
        <Field
          component={TextField}
          name={`${prefix}Ort`}
          label={t("onboarding.legalGuardian.city")}
          variant="outlined"
          margin="normal"
          fullWidth
          required={isRequired}
          error={touched[`${prefix}Ort`] && Boolean(errors[`${prefix}Ort`])}
          helperText={touched[`${prefix}Ort`] && errors[`${prefix}Ort`]}
        />

        {/* Street */}
        <Field
          component={TextField}
          name={`${prefix}Straße`}
          label={t("onboarding.legalGuardian.street")}
          variant="outlined"
          margin="normal"
          fullWidth
          required={isRequired}
          error={
            touched[`${prefix}Straße`] && Boolean(errors[`${prefix}Straße`])
          }
          helperText={touched[`${prefix}Straße`] && errors[`${prefix}Straße`]}
        />

        {/* House Number */}
        <Field
          component={TextField}
          name={`${prefix}HausNr`}
          label={t("onboarding.legalGuardian.houseNumber")}
          variant="outlined"
          margin="normal"
          fullWidth
          required={isRequired}
          error={
            touched[`${prefix}HausNr`] && Boolean(errors[`${prefix}HausNr`])
          }
          helperText={touched[`${prefix}HausNr`] && errors[`${prefix}HausNr`]}
        />

        {/* Mobile Number */}
        <Field
          component={TextField}
          name={`${prefix}Mobil`}
          label={t("onboarding.legalGuardian.mobileNumber")}
          variant="outlined"
          margin="normal"
          fullWidth
          error={touched[`${prefix}Mobil`] && Boolean(errors[`${prefix}Mobil`])}
          helperText={touched[`${prefix}Mobil`] && errors[`${prefix}Mobil`]}
        />

        {/* Phone Number */}
        <Field
          component={TextField}
          name={`${prefix}Telefon1`}
          label={t("onboarding.legalGuardian.phoneNumber")}
          variant="outlined"
          margin="normal"
          fullWidth
          error={
            touched[`${prefix}Telefon1`] && Boolean(errors[`${prefix}Telefon1`])
          }
          helperText={
            touched[`${prefix}Telefon1`] && errors[`${prefix}Telefon1`]
          }
        />

        {/* Email */}
        <Field
          component={TextField}
          name={`${prefix}Email`}
          type="email"
          label={t("onboarding.legalGuardian.email")}
          variant="outlined"
          margin="normal"
          fullWidth
          error={touched[`${prefix}Email`] && Boolean(errors[`${prefix}Email`])}
          helperText={touched[`${prefix}Email`] && errors[`${prefix}Email`]}
        />
      </StyledFieldsContainer>
    );
  };

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
          {/* Show info alert for adults indicating fields are optional */}
          {isAdult && (
            <Alert severity="info" sx={{ width: "100%", mb: 2 }}>
              {t("onboarding.legalGuardian.adultOptionalInfo")}
            </Alert>
          )}

          {/* Add Contact button at the top */}
          {visibleContacts.length < maxContactPersons && (
            <GeneralButton
              label={t("onboarding.legalGuardian.addContact")}
              onAction={handleAddContact}
              isPrimary={false}
              startIcon={<AddRoundedIcon />}
              fullWidth
              withTooltip
              tooltipLabel={t("onboarding.legalGuardian.addContactTooltip")}
              tooltipPlacement="top"
            />
          )}

          {/* Render visible contacts with EnhancedCollapse */}
          {visibleContacts.map((contactNumber) => (
            <Box key={contactNumber} sx={{ width: "100%" }}>
              <EnhancedCollapse
                title={t(
                  `onboarding.legalGuardian.contactPerson${contactNumber}`,
                )}
                subtitle={
                  values[
                    `ansprechpartner${contactNumber}Vorname` as keyof FormValues
                  ] &&
                  values[
                    `ansprechpartner${contactNumber}Nachname` as keyof FormValues
                  ]
                    ? `${values[`ansprechpartner${contactNumber}Vorname` as keyof FormValues]} ${values[`ansprechpartner${contactNumber}Nachname` as keyof FormValues]}`
                    : undefined
                }
                expanded={expandedContact === contactNumber}
                onAction={() => toggleExpand(contactNumber)}
                withArrow
                headerAction={
                  contactNumber > 1 ? (
                    <SmallIconButton
                      icon={<DeleteRoundedIcon />}
                      customColor="#d32f2f"
                      hoverAllowed
                      noMargin
                      title={t("onboarding.legalGuardian.removeContactTooltip")}
                      placement="top"
                      onAction={() => handleRemoveContact(contactNumber)}
                    />
                  ) : undefined
                }
                onHeaderActionClick={
                  contactNumber > 1
                    ? () => {
                        // Clear all fields for this contact
                        const prefix = `ansprechpartner${contactNumber}`;
                        setFieldValue(`${prefix}Art`, "");
                        setFieldValue(`${prefix}Vorname`, "");
                        setFieldValue(`${prefix}Nachname`, "");
                        setFieldValue(`${prefix}Plz`, "");
                        setFieldValue(`${prefix}Ort`, "");
                        setFieldValue(`${prefix}Straße`, "");
                        setFieldValue(`${prefix}HausNr`, "");
                        setFieldValue(`${prefix}Mobil`, "");
                        setFieldValue(`${prefix}Telefon1`, "");
                        setFieldValue(`${prefix}Email`, "");
                        handleRemoveContact(contactNumber);
                      }
                    : undefined
                }
              >
                {renderContactFields(
                  contactNumber,
                  errors,
                  touched,
                  !isAdult && contactNumber === 1,
                )}
              </EnhancedCollapse>
            </Box>
          ))}
        </StyledForm>
      )}
    </Formik>
  );
};

export default ParentsForm;
