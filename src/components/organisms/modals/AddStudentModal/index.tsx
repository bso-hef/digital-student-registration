import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import GeneralInput from "@/components/atoms/GeneralInput";
import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import SmallIconButton from "@/components/atoms/buttons/SmallIconButton";
import { CreateStudentInput, StudentFormRow } from "@/types/student";
import { ParsedStudent } from "@/utils/csv.utils";
import { uuid_v4 } from "@/utils/string.utils";
import { applicationScrollbar } from "@/utils/styling.utils";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Box, Chip, LinearProgress, Typography, styled } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";

import GeneralModal from "../GeneralModal";
import CSVStudentRow from "./CSVStudentRow";

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

const StyledPreviewContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const StyledSummaryBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  flexShrink: 0,
}));

const StyledRowsContainer = styled(Box)(({ theme }) => ({
  maxHeight: 400,
  overflow: "auto",
  paddingBottom: theme.spacing(1),
  ...applicationScrollbar(theme),
}));

const StyledLoadingOverlay = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(3),
  padding: theme.spacing(6),
  minHeight: 200,
}));

const StyledProgressBar = styled(LinearProgress)({
  width: "100%",
  maxWidth: 400,
  height: 8,
  borderRadius: 4,
});

type AddStudentModalProps = {
  open: boolean;
  onClose: () => void;
  onAddStudents: (students: CreateStudentInput[]) => void;
  onUploadCSV: () => void;
  csvData?: ParsedStudent[];
  isParsingCSV?: boolean;
  isImporting?: boolean;
};

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  open,
  onClose,
  onAddStudents,
  onUploadCSV,
  csvData = [],
  isParsingCSV = false,
  isImporting = false,
}) => {
  const { t } = useTranslation();
  const isLoading = isParsingCSV || isImporting;
  const [state, setState] = useState<StudentFormRow[]>([]);
  const [editableCsvData, setEditableCsvData] = useState<ParsedStudent[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  // Check if CSV data has comprehensive fields (more than just basic info)
  const isComprehensiveCSV = useMemo(() => {
    if (csvData.length === 0) return false;
    return csvData.some(
      (item) =>
        item.className ||
        item.employer?.companyName ||
        item.address?.city ||
        item.contactPersons?.length,
    );
  }, [csvData]);

  // Initialize editable CSV data when csvData changes
  useEffect(() => {
    if (csvData.length > 0 && isComprehensiveCSV) {
      setEditableCsvData([...csvData]);
    }
  }, [csvData, isComprehensiveCSV]);

  // Validation summary for CSV preview - use editable data
  const validationSummary = useMemo(() => {
    const dataToValidate = isComprehensiveCSV ? editableCsvData : csvData;
    const valid = dataToValidate.filter(
      (item) => item.firstName && item.lastName && item.dateOfBirth,
    ).length;
    const withWarnings = dataToValidate.filter(
      (item) =>
        item.firstName &&
        item.lastName &&
        item.dateOfBirth &&
        (!item.className || !item.employer?.companyName),
    ).length;
    const invalid = dataToValidate.length - valid;
    return { valid, withWarnings, invalid, total: dataToValidate.length };
  }, [csvData, editableCsvData, isComprehensiveCSV]);

  // Handle CSV row update
  const handleCsvRowChange = useCallback(
    (index: number, updatedStudent: ParsedStudent) => {
      setEditableCsvData((prev) => {
        const newData = [...prev];
        newData[index] = updatedStudent;
        return newData;
      });
    },
    [],
  );

  // Handle CSV row deletion
  const handleCsvRowDelete = useCallback((index: number) => {
    setEditableCsvData((prev) => prev.filter((_, i) => i !== index));
  }, []);

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
      setState([]);
      setEditableCsvData([]);
      return;
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
    if (isComprehensiveCSV && editableCsvData.length > 0) {
      // For comprehensive CSV, check editable data
      const allValid = editableCsvData.every(
        (student) =>
          student.firstName?.trim() !== "" &&
          student.lastName?.trim() !== "" &&
          student.dateOfBirth?.trim() !== "",
      );
      setIsFormValid(allValid && editableCsvData.length > 0);
    } else {
      // For simple form, check state
      const allValid = state.every(
        (student) =>
          student.firstName.trim() !== "" &&
          student.lastName.trim() !== "" &&
          student.dateOfBirth !== null,
      );
      setIsFormValid(allValid);
    }
  }, [state, editableCsvData, isComprehensiveCSV]);

  const handleAdd = useCallback(() => {
    // If comprehensive CSV, pass the editable data instead of just the form state
    if (isComprehensiveCSV && editableCsvData.length > 0) {
      onAddStudents(editableCsvData as unknown as CreateStudentInput[]);
    } else {
      onAddStudents(state);
    }
  }, [onAddStudents, state, isComprehensiveCSV, editableCsvData]);

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

  // Loading content
  const loadingContent = (
    <StyledLoadingOverlay>
      <Typography variant="h6" color="text.primary">
        {isParsingCSV
          ? t("modals.addStudent.parsingCSV")
          : t("modals.addStudent.importingStudents")}
      </Typography>
      <StyledProgressBar />
      <Typography variant="body2" color="text.secondary">
        {t("modals.addStudent.pleaseWait")}
      </Typography>
    </StyledLoadingOverlay>
  );

  // CSV Preview with editable collapsible rows
  const csvPreviewContent = (
    <StyledPreviewContainer>
      <StyledSummaryBox>
        <Chip
          icon={<CheckCircleOutlineRoundedIcon />}
          label={`${validationSummary.valid} ${t("modals.addStudent.validStudents")}`}
          color="success"
          size="small"
          variant="outlined"
        />
        {validationSummary.withWarnings > 0 && (
          <Chip
            icon={<WarningAmberRoundedIcon />}
            label={`${validationSummary.withWarnings} ${t("modals.addStudent.withWarnings")}`}
            color="warning"
            size="small"
            variant="outlined"
          />
        )}
        {validationSummary.invalid > 0 && (
          <Chip
            label={`${validationSummary.invalid} ${t("modals.addStudent.invalid")}`}
            color="error"
            size="small"
            variant="outlined"
          />
        )}
        <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
          {t("modals.addStudent.totalStudents", {
            count: validationSummary.total,
          })}
        </Typography>
      </StyledSummaryBox>

      <Typography variant="caption" color="text.secondary">
        {t("modals.addStudent.clickToExpand")}
      </Typography>

      <StyledRowsContainer>
        {editableCsvData.map((student, index) => (
          <CSVStudentRow
            key={index}
            student={student}
            index={index}
            onChange={handleCsvRowChange}
            onDelete={handleCsvRowDelete}
          />
        ))}
      </StyledRowsContainer>
    </StyledPreviewContainer>
  );

  // Simple form for manual entry
  const manualEntryContent = (
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

  const contentChildren = isLoading
    ? loadingContent
    : isComprehensiveCSV
      ? csvPreviewContent
      : manualEntryContent;

  const actionChildren = (
    <Fragment>
      <GeneralButton
        label={
          isComprehensiveCSV
            ? t("modals.addStudent.uploadDifferentCsv")
            : t("modals.addStudent.uploadCsv")
        }
        isPrimary={false}
        onAction={onUploadCSV}
        fullWidth={false}
        disabled={isLoading}
      />
      <GeneralButton
        label={
          isImporting
            ? t("modals.addStudent.importing")
            : isComprehensiveCSV
              ? t("modals.addStudent.importStudents", {
                  count: validationSummary.valid,
                })
              : t("modals.addStudent.add")
        }
        disabled={!isFormValid || isLoading}
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
      subtitle={
        isComprehensiveCSV
          ? t("modals.addStudent.csvPreviewSubtitle")
          : t("modals.addStudent.subtitle")
      }
      modalWidth={isComprehensiveCSV ? 1100 : 960}
      modalMaxHeight={isComprehensiveCSV ? 700 : 600}
      contentChildren={contentChildren}
      actionsChildren={actionChildren}
      maxWidth="xl"
    />
  );
};

export default AddStudentModal;
