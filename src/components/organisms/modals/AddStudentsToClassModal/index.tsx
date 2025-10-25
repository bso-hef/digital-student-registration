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

type Props = {
  open: boolean;
  onClose: () => void;
  onAddStudents: (studentIds: string[]) => void;
};

const AddStudentsToClassModal: React.FC<Props> = ({
  open,
  onClose,
  onAddStudents,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

  // Fetch unassigned students when modal opens
  useEffect(() => {
    if (!open) {
      setSelectedStudents([]);
      return;
    }

    const fetchUnassignedStudents = async () => {
      setLoading(true);
      try {
        const { data } = await studentService.getUnassigned();
        setStudents(data.students || []);
      } catch (error) {
        console.error("Failed to fetch unassigned students:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUnassignedStudents();
  }, [open]);

  const handleSubmit = useCallback(() => {
    if (selectedStudents.length === 0) return;
    const studentIds = selectedStudents.map((student) => student._id);
    onAddStudents(studentIds);
    onClose();
  }, [selectedStudents, onAddStudents, onClose]);

  const formatStudentOption = (student: Student) => {
    const dob = student.dateOfBirth
      ? new Date(student.dateOfBirth).toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "-";
    return `${student.firstName} ${student.lastName} (${dob})`;
  };

  const contentChildren = (
    <FormWrap>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Fragment>
          <Autocomplete
            multiple
            options={students}
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
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
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
