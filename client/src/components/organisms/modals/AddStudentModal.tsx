import React, { Fragment, useCallback, useEffect, useState } from "react";

import GeneralInput from "@/components/atoms/GeneralInput";
import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import { uuid_v4 } from "@/utils/string.utils";
import { applicationScrollbar } from "@/utils/styling.utils";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { Box, styled } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";

import GeneralModal from "./GeneralModal";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  isValid: boolean;
  touched: boolean;
};

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

type CsvStudent = {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
};

type AddStudentModalProps = {
  open: boolean;
  onClose: () => void;
  onAddStudents: () => void;
  onUploadCSV: () => void;
  csvData?: CsvStudent[];
};

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  open,
  onClose,
  onAddStudents,
  onUploadCSV,
  csvData = [],
}) => {
  const { t } = useTranslation();
  const [state, setState] = useState<Student[]>([]);
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

  const handleStudentChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { id, name, value } = event.target;
      const newList = state.map((item) => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            [name]: value,
            touched: true,
          };

          return updatedItem;
        }
        return item;
      });

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
    const allValid =
      state.length > 0 &&
      state.every(
        (student) =>
          student.firstName.trim() !== "" &&
          student.lastName.trim() !== "" &&
          student.dateOfBirth !== null,
      );
    setIsFormValid(allValid);
  }, [state]);

  const handleInvite = useCallback(() => {
    onAddStudents();
  }, [onAddStudents]);

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
      {state?.map((item, index) =>
        state.length > 1 ? (
          <StyledFormRow key={item.id}>
            <StyledFormGroup>
              <GeneralInput
                type="text"
                placeholder="John"
                label="Vorname"
                onChange={handleTextChange(item.id, "firstName")}
                value={item.firstName}
                showUserStartIcon
                style={{
                  height: "50px",
                  flexShrink: 0,
                }}
              />
              <GeneralInput
                type="text"
                placeholder="Doe"
                label="Nachname"
                onChange={handleTextChange(item.id, "lastName")}
                value={item.lastName}
                showUserStartIcon
                style={{
                  height: "50px",
                  flexShrink: 0,
                }}
              />
              <DatePicker
                value={item.dateOfBirth ? dayjs(item.dateOfBirth) : null}
                label="Geburtsdatum"
                onChange={handleDobChange(item.id)}
                disableFuture
                views={["year", "month", "day"]}
                format="DD.MM.YYYY"
                slotProps={{
                  textField: {
                    sx: { height: 50 },
                    InputProps: { sx: { height: 50 } },
                    size: "small",
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
        ) : (
          <StyledFormRow key={item.id}>
            <StyledFormGroup>
              <GeneralInput
                type="text"
                placeholder="John"
                label="Vorname"
                onChange={handleTextChange(item.id, "firstName")}
                value={item.firstName}
                showUserStartIcon
                style={{
                  height: "50px",
                  flexShrink: 0,
                }}
              />
              <GeneralInput
                type="text"
                placeholder="Doe"
                label="Nachname"
                onChange={handleTextChange(item.id, "lastName")}
                value={item.lastName}
                showUserStartIcon
                style={{
                  height: "50px",
                  flexShrink: 0,
                }}
              />
              <DatePicker
                value={item.dateOfBirth ? dayjs(item.dateOfBirth) : null}
                label="Geburtsdatum"
                onChange={handleDobChange(item.id)}
                disableFuture
                views={["year", "month", "day"]}
                format="DD.MM.YYYY"
                slotProps={{
                  textField: {
                    sx: { height: 50 },
                    InputProps: { sx: { height: 50 } },
                    size: "small",
                  },
                }}
              />
            </StyledFormGroup>
            <SmallIconButton
              icon={<AddRoundedIcon />}
              onAction={handleAddStudent}
              hugeIcon
              noMargin
            />
          </StyledFormRow>
        ),
      )}
    </StyledForm>
  );

  const actionChildren = (
    <Fragment>
      <GeneralButton
        // label={t("queue.upload csv")}
        label="Upload CSV"
        isPrimary={false}
        onAction={onUploadCSV}
        fullWidth={false}
      />
      <GeneralButton
        // label={t("queue.invite")}
        label="Invite"
        disabled={!isFormValid}
        onAction={handleInvite}
        fullWidth={false}
      />
    </Fragment>
  );

  return (
    <GeneralModal
      open={open}
      onCloseModal={onClose}
      customTitle="Add Student"
      subtitle="Add students manually or via csv import"
      modalWidth={960}
      modalMaxHeight={600}
      contentChildren={contentChildren}
      actionsChildren={actionChildren}
    />
  );
};

export default AddStudentModal;
