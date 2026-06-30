"use client";

import React, { Fragment, useCallback, useEffect, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import GeneralModal from "@/components/organisms/modals/GeneralModal";
import studentService from "@/lib/services/studentService";
import { Student } from "@/types/db";
import { applicationScrollbar } from "@/utils/styling.utils";
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const FormWrap = styled(Box)(({ theme }) => ({
  maxHeight: 520,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  ...applicationScrollbar(theme),
}));

// Extended type for students with populated currentClass
type StudentWithClass = Student & {
  currentClass?: { _id: string; name: string } | string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onAddStudents: (studentIds: string[]) => void;
  classId: string;
};

const AddStudentsToClassModal: React.FC<Props> = ({
  open,
  onClose,
  onAddStudents,
  classId,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<StudentWithClass[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<StudentWithClass[]>(
    [],
  );

  // Helper to get class ID from populated or string currentClass
  const getStudentClassId = (student: StudentWithClass): string | null => {
    if (!student.currentClass) return null;
    if (typeof student.currentClass === "string") return student.currentClass;
    return (student.currentClass as { _id: string; name: string })._id;
  };

  // Helper to get class name from populated currentClass
  const getStudentClassName = (student: StudentWithClass): string | null => {
    if (!student.currentClass) return null;
    if (typeof student.currentClass === "string") return null;
    return (student.currentClass as { _id: string; name: string }).name;
  };

  // Fetch all active students when modal opens
  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets the user-editable selection when the modal closes; this effect also triggers an async fetch on open, so it is genuine synchronization, not derived state
      setSelectedStudents([]);
      return;
    }

    const fetchStudentsForAssignment = async () => {
      setLoading(true);
      try {
        const { data } = await studentService.getForAssignment();
        setStudents(data.students || []);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsForAssignment();
  }, [open]);

  const handleSubmit = useCallback(() => {
    if (selectedStudents.length === 0) return;
    const studentIds = selectedStudents.map((student) => student._id);
    onAddStudents(studentIds);
    onClose();
  }, [selectedStudents, onAddStudents, onClose]);

  const formatStudentOption = (student: StudentWithClass) => {
    const dob = student.dateOfBirth
      ? new Date(student.dateOfBirth).toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "-";
    const className = getStudentClassName(student);
    const base = `${student.firstName} ${student.lastName} (${dob})`;
    return className ? `${base} - ${className}` : base;
  };

  // Filter out students already in the target class
  const availableStudents = students.filter(
    (student) => getStudentClassId(student) !== classId,
  );

  const contentChildren = (
    <FormWrap>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Fragment>
          <Autocomplete
            multiple
            options={availableStudents}
            value={selectedStudents}
            onChange={(_, newValue) => setSelectedStudents(newValue)}
            getOptionLabel={formatStudentOption}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("modals.addStudentsToClass.searchPlaceholder")}
                placeholder={t("modals.addStudentsToClass.searchPlaceholder")}
                variant="outlined"
                size="small"
                margin="normal"
              />
            )}
            renderOption={(props, student) => {
              const className = getStudentClassName(student);
              const dob = student.dateOfBirth
                ? new Date(student.dateOfBirth).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "-";
              return (
                <li {...props} key={student._id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                      {student.firstName} {student.lastName} ({dob})
                    </Typography>
                    {className && (
                      <Chip
                        size="small"
                        label={className}
                        color="warning"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                </li>
              );
            }}
            renderValue={(value, getItemProps) =>
              value.map((option, index) => (
                <Chip
                  {...getItemProps({ index })}
                  key={option._id}
                  label={`${option.firstName} ${option.lastName}`}
                  size="small"
                />
              ))
            }
            noOptionsText={t("modals.addStudentsToClass.noOptions")}
            loading={loading}
            disabled={loading}
            sx={{ width: "100%" }}
          />

          {selectedStudents.length > 0 && (
            <Box sx={{ mt: 1, color: "text.secondary", fontSize: "14px" }}>
              {t("modals.addStudentsToClass.selectedCount", {
                count: selectedStudents.length,
              })}
            </Box>
          )}
        </Fragment>
      )}
    </FormWrap>
  );

  const actionsChildren = (
    <Fragment>
      <GeneralButton
        label={t("general.Cancel")}
        isPrimary={false}
        onAction={onClose}
        fullWidth={false}
      />
      <GeneralButton
        label={t("modals.addStudentsToClass.addButton")}
        onAction={handleSubmit}
        disabled={selectedStudents.length === 0 || loading}
        fullWidth={false}
      />
    </Fragment>
  );

  return (
    <GeneralModal
      open={open}
      onCloseModal={onClose}
      customTitle={t("modals.addStudentsToClass.title")}
      subtitle={t("modals.addStudentsToClass.subtitle")}
      modalWidth={720}
      modalMaxHeight={680}
      contentChildren={contentChildren}
      actionsChildren={actionsChildren}
    />
  );
};

export default AddStudentsToClassModal;
