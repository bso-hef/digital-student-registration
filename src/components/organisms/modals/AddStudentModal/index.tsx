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
import ImportProgressIndicator, {
  ImportStep,
} from "@/components/molecules/ImportProgressIndicator";
import classService from "@/lib/services/classService";
import { addClass } from "@/store/actions/classActions";
import { AppDispatch } from "@/store/store";
import { CreateStudentInput, StudentFormRow } from "@/types/student";
import { extractGradeFromName } from "@/utils/classCSV.utils";
import { ParsedStudent } from "@/utils/csv.utils";
import { uuid_v4 } from "@/utils/string.utils";
import { applicationScrollbar } from "@/utils/styling.utils";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Box, Chip, Typography, styled } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import GeneralModal from "../GeneralModal";
import MissingClassesWarningModal from "../MissingClassesWarningModal";
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
  const dispatch: AppDispatch = useDispatch();
  const [state, setState] = useState<StudentFormRow[]>([]);
  const [editableCsvData, setEditableCsvData] = useState<ParsedStudent[]>([]);
  const [missingClassesModalOpen, setMissingClassesModalOpen] = useState(false);
  const [missingClasses, setMissingClasses] = useState<string[]>([]);
  const [isCheckingClasses, setIsCheckingClasses] = useState(false);
  const [isCreatingClasses, setIsCreatingClasses] = useState(false);
  const [currentProgressStep, setCurrentProgressStep] =
    useState<ImportStep>("parsing");

  const isLoading =
    isParsingCSV || isImporting || isCheckingClasses || isCreatingClasses;

  // Update progress step based on current loading state
  useEffect(() => {
    if (isParsingCSV) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sticky progress step synced from loading flags; retains last step when all flags are false, so not derivable
      setCurrentProgressStep("parsing");
    } else if (isCheckingClasses) {
      setCurrentProgressStep("checking_classes");
    } else if (isCreatingClasses) {
      setCurrentProgressStep("creating_classes");
    } else if (isImporting) {
      setCurrentProgressStep("importing_students");
    }
  }, [isParsingCSV, isCheckingClasses, isCreatingClasses, isImporting]);

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
      // eslint-disable-next-line react-hooks/set-state-in-effect -- seeds editable working copy from csvData prop; user then mutates it independently, so it can't be derived
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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- seeds an initial empty editable form row on mount
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
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets editable form state when the modal closes/opens (open prop flip)
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

      // eslint-disable-next-line react-hooks/set-state-in-effect -- seeds editable form rows from csvData prop; rows are edited independently afterwards, so not derivable
      setState(mappedData);
    }
  }, [csvData]);

  // Check if all students are valid (derived from form state during render)
  const isFormValid = useMemo(() => {
    if (isComprehensiveCSV && editableCsvData.length > 0) {
      // For comprehensive CSV, check editable data
      const allValid = editableCsvData.every(
        (student) =>
          student.firstName?.trim() !== "" &&
          student.lastName?.trim() !== "" &&
          student.dateOfBirth?.trim() !== "",
      );
      return allValid && editableCsvData.length > 0;
    }
    // For simple form, check state
    return state.every(
      (student) =>
        student.firstName.trim() !== "" &&
        student.lastName.trim() !== "" &&
        student.dateOfBirth !== null,
    );
  }, [state, editableCsvData, isComprehensiveCSV]);

  // Actually perform the import
  const performImport = useCallback(() => {
    if (isComprehensiveCSV && editableCsvData.length > 0) {
      onAddStudents(editableCsvData as unknown as CreateStudentInput[]);
    } else {
      onAddStudents(state);
    }
  }, [onAddStudents, state, isComprehensiveCSV, editableCsvData]);

  // Handle add button - check for missing classes first
  const handleAdd = useCallback(async () => {
    // For comprehensive CSV, check if classes exist before importing
    if (isComprehensiveCSV && editableCsvData.length > 0) {
      // Extract unique class names from CSV data
      const classNames = [
        ...new Set(
          editableCsvData
            .map((s) => s.className?.trim())
            .filter((name): name is string => !!name),
        ),
      ];

      // If no class names in CSV, proceed directly
      if (classNames.length === 0) {
        performImport();
        return;
      }

      try {
        setIsCheckingClasses(true);
        const response = await classService.checkClasses(classNames);
        const { missing } = response.data;

        if (missing.length > 0) {
          // Show warning modal with missing classes
          setMissingClasses(missing);
          setMissingClassesModalOpen(true);
        } else {
          // All classes exist, proceed with import
          performImport();
        }
      } catch (error) {
        console.error("Failed to check classes:", error);
        // On error, proceed with import anyway
        performImport();
      } finally {
        setIsCheckingClasses(false);
      }
    } else {
      // Simple form, no class checking needed
      performImport();
    }
  }, [isComprehensiveCSV, editableCsvData, performImport]);

  // Get default school year dates based on current date
  const getDefaultSchoolYear = useCallback(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed, August = 7

    // If we're in August or later, school year is current year to next year
    // Otherwise, school year is previous year to current year
    if (currentMonth >= 7) {
      // August or later
      return {
        schoolYearFrom: new Date(currentYear, 7, 1), // August 1 of current year
        schoolYearTo: new Date(currentYear + 1, 6, 31), // July 31 of next year
      };
    } else {
      return {
        schoolYearFrom: new Date(currentYear - 1, 7, 1), // August 1 of previous year
        schoolYearTo: new Date(currentYear, 6, 31), // July 31 of current year
      };
    }
  }, []);

  // Handle "Create Classes and Import" action
  const handleCreateClassesFirst = useCallback(async () => {
    if (missingClasses.length === 0) {
      performImport();
      return;
    }

    try {
      setIsCreatingClasses(true);
      const { schoolYearFrom, schoolYearTo } = getDefaultSchoolYear();

      // Create classes with default school year
      const classesToCreate = missingClasses.map((name) => {
        const grade = extractGradeFromName(name);
        return {
          name,
          schoolYearFrom,
          schoolYearTo,
          grade,
          isVocational: true, // Default to vocational since this is a vocational school context
          requiresEmployerInfo: false,
          active: true,
          incomplete: grade === null, // Mark as incomplete if grade cannot be extracted
        };
      });

      // Use Redux action to create classes - this updates Redux state automatically
      await dispatch(addClass(classesToCreate));

      // Close the missing classes modal and proceed with import
      setMissingClassesModalOpen(false);
      performImport();
    } catch (error) {
      console.error("Failed to create classes:", error);
      // On error, keep the modal open so user can try again or import anyway
    } finally {
      setIsCreatingClasses(false);
    }
  }, [missingClasses, getDefaultSchoolYear, performImport, dispatch]);

  // Handle "Import Anyway" action
  const handleImportAnyway = useCallback(() => {
    setMissingClassesModalOpen(false);
    performImport();
  }, [performImport]);

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

  // Loading content with progress indicator
  const loadingContent = (
    <ImportProgressIndicator currentStep={currentProgressStep} />
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
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", ml: "auto" }}
        >
          {t("modals.addStudent.totalStudents", {
            count: validationSummary.total,
          })}
        </Typography>
      </StyledSummaryBox>

      <Typography variant="caption" sx={{ color: "text.secondary" }}>
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
                  slotProps: { input: { sx: { height: 50 } } },
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
    <>
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
      <MissingClassesWarningModal
        open={missingClassesModalOpen}
        onClose={() => setMissingClassesModalOpen(false)}
        onCreateClasses={handleCreateClassesFirst}
        onImportAnyway={handleImportAnyway}
        missingClasses={missingClasses}
        isCreatingClasses={isCreatingClasses}
      />
    </>
  );
};

export default AddStudentModal;
