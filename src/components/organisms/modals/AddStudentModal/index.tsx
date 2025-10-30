import React, { Fragment, useCallback, useEffect, useState } from "react";

import GeneralInput from "@/components/atoms/GeneralInput";
import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import { CreateStudentInput, StudentFormRow } from "@/types/student";
import { ParsedStudent } from "@/utils/csv.utils";
import { uuid_v4 } from "@/utils/string.utils";
import { applicationScrollbar } from "@/utils/styling.utils";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { Box, styled } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";

import GeneralModal from "../GeneralModal";

const StyledForm = styled(Box)(({ theme }) => ({
  height: "100%",
  maxHeight: 330,
  overflow: "hidden",
  overflowY: "auto",
  ...applicationScrollbar(theme),
}));

const StyledFormRow = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  margin: theme.spacing(0.75, 0, 2, 0),
}));

const StyledFormGroup = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(2),
  alignItems: "center",
}));

type AddStudentModalProps = {
  open: boolean;
  onClose: () => void;
  onAddStudents: (students: CreateStudentInput[]) => void;
  onUploadCSV: () => void;
  csvData?: ParsedStudent[];
};

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  open,
  onClose,
  onAddStudents,
  onUploadCSV,
  csvData = [],
}) => {
  const { t } = useTranslation();
  const [state, setState] = useState<StudentFormRow[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleAddStudent = useCallback(() => {
    setState([
      ...state,
      {
        id: uuid_v4(),
        firstName: "",
        lastName: "",
        dateOfBirth: null,
        isValid: false,
        touched: false,
      },
    ]);
  }, [state]);

  const handleTextChange =
    (id: string, key: "firstName" | "lastName") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setState((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, [key]: value, touched: true } : s,
        ),
      );
    };

  const handleRemoveStudent = useCallback(
    (id: string) => {
      const newList = state.filter(({ id: _id }) => id !== _id);
      setState(newList);
    },
    [state],
  );

  useEffect(() => {
    setState([
      ...state,
      {
        id: uuid_v4(),
        firstName: "",
        lastName: "",
        dateOfBirth: null,
        isValid: false,
        touched: false,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) {
      return setState([]);
    }

    setState([
      {
        id: uuid_v4(),
        firstName: "",
        lastName: "",
        dateOfBirth: null,
        isValid: false,
        touched: false,
      },
    ]);
  }, [open]);

  useEffect(() => {
    if (csvData?.length > 0) {
      const mappedData = csvData.map((item) => ({
        id: uuid_v4(),
        firstName: item.firstName || "",
        lastName: item.lastName || "",
        dateOfBirth: item.dateOfBirth ? new Date(item.dateOfBirth) : null,
        isValid: !!(item.firstName && item.lastName && item.dateOfBirth),
        touched: true,
      }));

      setState(mappedData);
    }
  }, [csvData]);

  useEffect(() => {
    // Check if all students are valid
    const allValid = state.every(
      (student) =>
        student.firstName.trim() !== "" &&
        student.lastName.trim() !== "" &&
        student.dateOfBirth !== null,
    );
    setIsFormValid(allValid);
  }, [state]);

  const handleAdd = useCallback(() => {
    onAddStudents(state);
  }, [onAddStudents, state]);

  const handleDobChange = (id: string) => (value: Dayjs | null) => {
    setState((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              dateOfBirth: value ? value.toDate() : null,
              touched: true,
            }
          : s,
      ),
    );
  };

  const contentChildren = (
    <StyledForm>
      {state?.map((item, index) => (
        <StyledFormRow key={item.id}>
          <StyledFormGroup>
            <GeneralInput
              type="text"
              placeholder={t("modals.addStudent.firstNamePlaceholder")}
              label={
                item.touched && !item.firstName
                  ? t("modals.addStudent.required")
                  : t("modals.addStudent.firstName")
              }
              onChange={handleTextChange(item.id, "firstName")}
              value={item.firstName}
              showUserStartIcon
              style={{
                height: "50px",
                flexShrink: 0,
              }}
              error={item.touched && !item.firstName}
            />
            <GeneralInput
              type="text"
              placeholder={t("modals.addStudent.lastNamePlaceholder")}
              label={
                item.touched && !item.lastName
                  ? t("modals.addStudent.required")
                  : t("modals.addStudent.lastName")
              }
              value={item.lastName}
              onChange={handleTextChange(item.id, "lastName")}
              showUserStartIcon
              style={{
                height: "50px",
                flexShrink: 0,
              }}
              error={item.touched && !item.lastName}
            />
            <DatePicker
              value={item.dateOfBirth ? dayjs(item.dateOfBirth) : null}
              label={
                item.touched && !item.dateOfBirth
                  ? t("modals.addStudent.required")
                  : t("modals.addStudent.dateOfBirth")
              }
              onChange={handleDobChange(item.id)}
              disableFuture
              views={["year", "month", "day"]}
              format="DD.MM.YYYY"
              slotProps={{
                textField: {
                  sx: { height: 50 },
                  InputProps: { sx: { height: 50 } },
                  size: "small",
                  error: item.touched && !item.dateOfBirth,
                },
              }}
            />
          </StyledFormGroup>
          {index < 1 ? (
            <SmallIconButton
              icon={<AddRoundedIcon />}
              onAction={handleAddStudent}
              hugeIcon
              noMargin
            />
          ) : (
            <SmallIconButton
              icon={<RemoveRoundedIcon />}
              onAction={() => handleRemoveStudent(item.id)}
              hugeIcon
              noMargin
            />
          )}
        </StyledFormRow>
      ))}
    </StyledForm>
  );

  const actionChildren = (
    <Fragment>
      <GeneralButton
        label={t("modals.addStudent.uploadCsv")}
        isPrimary={false}
        onAction={onUploadCSV}
        fullWidth={false}
      />
      <GeneralButton
        label={t("modals.addStudent.add")}
        disabled={!isFormValid}
        onAction={handleAdd}
        fullWidth={false}
      />
    </Fragment>
  );

  return (
    <GeneralModal
      open={open}
      onCloseModal={onClose}
      customTitle={t("modals.addStudent.title")}
      subtitle={t("modals.addStudent.subtitle")}
      modalWidth={960}
      modalMaxHeight={600}
      contentChildren={contentChildren}
      actionsChildren={actionChildren}
    />
  );
};

export default AddStudentModal;
