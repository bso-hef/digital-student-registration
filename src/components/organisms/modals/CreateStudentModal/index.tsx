"use client";

import React, { useState } from "react";

import ProgressIndicator from "@/components/atoms/ProgressIndicator";
import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import studentService from "@/lib/services/studentService";
import { validateManualCreationForm } from "@/lib/validate/student.validate";
import {
  errorNotification,
  successNotification,
} from "@/utils/notification.utils";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { Box, InputAdornment, TextField, styled } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import DuplicateWarningModal from "../DuplicateWarningModal";
import GeneralModal from "../GeneralModal";

const StyledForm = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
  padding: theme.spacing(1, 0),
}));

const FieldWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
}));

interface CreateStudentModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: Dayjs | null;
}

interface DuplicateData {
  exists: boolean;
  isRecentDuplicate: boolean;
  daysSinceUpdate?: number;
}

/**
 * CreateStudentModal component allows manual creation of student profiles
 * with duplicate checking and 5-step progress tracking
 */
const CreateStudentModal: React.FC<CreateStudentModalProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [duplicateWarningOpen, setDuplicateWarningOpen] = useState(false);
  const [duplicateData, setDuplicateData] = useState<DuplicateData | null>(
    null,
  );
  const [pendingFormValues, setPendingFormValues] = useState<FormValues | null>(
    null,
  );

  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    dateOfBirth: null,
  };

  const handleClose = () => {
    if (!isCreating) {
      onClose();
      // Reset state
      setProgress(0);
      setProgressLabel("");
      setDuplicateData(null);
      setPendingFormValues(null);
    }
  };

  const createStudent = async (values: FormValues) => {
    try {
      setIsCreating(true);

      // Step 3: Creating student (60%)
      setProgress(60);
      setProgressLabel(t("modals.createStudent.creatingStudent"));

      const { data } = await studentService.createPublic({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        dateOfBirth: values.dateOfBirth?.toDate() || null,
      });

      if (!data || !data.created || data.created.length === 0) {
        throw new Error("Failed to create student");
      }

      const createdStudent = data.created[0];
      const studentId = createdStudent._id;

      // Step 4: Preparing profile (80%)
      setProgress(80);
      setProgressLabel(t("modals.createStudent.preparingProfile"));
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 5: Redirecting (100%)
      setProgress(100);
      setProgressLabel(t("modals.createStudent.redirecting"));
      await new Promise((resolve) => setTimeout(resolve, 300));

      successNotification(t("modals.createStudent.success"));

      // Navigate to student onboarding page
      router.push(`/student/${studentId}`);
    } catch (error) {
      console.error("Error creating student:", error);
      errorNotification(t("modals.createStudent.error"));
      setIsCreating(false);
      setProgress(0);
      setProgressLabel("");
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsCreating(true);
      setProgress(0);

      // Step 1: Validating (20%)
      setProgress(20);
      setProgressLabel(t("modals.createStudent.validating"));
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Step 2: Checking duplicates (40%)
      setProgress(40);
      setProgressLabel(t("modals.createStudent.checkingDuplicates"));

      const { data: duplicateCheck } = await studentService.checkDuplicate(
        values.firstName.trim(),
        values.lastName.trim(),
        values.dateOfBirth?.toISOString() || "",
      );

      // If duplicate exists and is recent, show warning modal
      if (duplicateCheck.exists && duplicateCheck.isRecentDuplicate) {
        setDuplicateData(duplicateCheck);
        setPendingFormValues(values);
        setDuplicateWarningOpen(true);
        setIsCreating(false);
        setProgress(0);
        setProgressLabel("");
        return;
      }

      // No duplicate or old duplicate - proceed with creation
      await createStudent(values);
    } catch (error) {
      console.error("Error checking duplicate:", error);
      errorNotification(t("modals.createStudent.error"));
      setIsCreating(false);
      setProgress(0);
      setProgressLabel("");
    }
  };

  const handleDuplicateConfirm = async () => {
    setDuplicateWarningOpen(false);
    if (pendingFormValues) {
      await createStudent(pendingFormValues);
    }
  };

  const handleDuplicateCancel = () => {
    setDuplicateWarningOpen(false);
    setDuplicateData(null);
    setPendingFormValues(null);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validateManualCreationForm}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          submitForm,
          isValid,
          dirty,
        }) => (
          <GeneralModal
            open={open}
            onCloseModal={handleClose}
            customTitle={t("modals.createStudent.title")}
            subtitle={t("modals.createStudent.subtitle")}
            modalWidth={500}
            disableBackdropClick={isCreating}
            closeIcon={!isCreating}
            contentChildren={
              <Form>
                <StyledForm>
                  <FieldWrapper>
                    <Field
                      as={TextField}
                      name="firstName"
                      label={t("modals.createStudent.firstName")}
                      placeholder={t(
                        "modals.createStudent.firstNamePlaceholder",
                      )}
                      fullWidth
                      disabled={isCreating}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      variant="outlined"
                      size="medium"
                      style={{
                        height: "50px",
                        flexShrink: 0,
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonRoundedIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </FieldWrapper>

                  <FieldWrapper>
                    <Field
                      as={TextField}
                      name="lastName"
                      label={t("modals.createStudent.lastName")}
                      placeholder={t(
                        "modals.createStudent.lastNamePlaceholder",
                      )}
                      fullWidth
                      disabled={isCreating}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      variant="outlined"
                      size="medium"
                      style={{
                        height: "50px",
                        flexShrink: 0,
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonRoundedIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </FieldWrapper>

                  <FieldWrapper>
                    <DatePicker
                      label={t("modals.createStudent.dateOfBirth")}
                      value={values.dateOfBirth}
                      onChange={(date) => {
                        setFieldValue("dateOfBirth", date);
                        setFieldTouched("dateOfBirth", true);
                      }}
                      disabled={isCreating}
                      format="DD.MM.YYYY"
                      disableFuture
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error:
                            touched.dateOfBirth && Boolean(errors.dateOfBirth),
                          helperText:
                            touched.dateOfBirth &&
                            typeof errors.dateOfBirth === "string"
                              ? errors.dateOfBirth
                              : "",
                          variant: "outlined",
                          size: "medium",
                        },
                      }}
                    />
                  </FieldWrapper>

                  {isCreating && (
                    <ProgressIndicator
                      progress={progress}
                      label={progressLabel}
                    />
                  )}
                </StyledForm>
              </Form>
            }
            actionsChildren={
              <>
                <GeneralButton
                  label={t("modals.createStudent.cancel")}
                  isPrimary={false}
                  onAction={handleClose}
                  disabled={isCreating}
                />
                <GeneralButton
                  label={t("modals.createStudent.create")}
                  isPrimary={true}
                  onAction={submitForm}
                  disabled={isCreating || !isValid || !dirty}
                />
              </>
            }
          />
        )}
      </Formik>

      {duplicateData && pendingFormValues && (
        <DuplicateWarningModal
          open={duplicateWarningOpen}
          onClose={handleDuplicateCancel}
          onConfirm={handleDuplicateConfirm}
          studentData={{
            firstName: pendingFormValues.firstName,
            lastName: pendingFormValues.lastName,
            dateOfBirth: pendingFormValues.dateOfBirth?.toISOString() || "",
            daysSinceUpdate: duplicateData.daysSinceUpdate || 0,
          }}
        />
      )}
    </>
  );
};

export default CreateStudentModal;
