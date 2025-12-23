"use client";

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
import ClassStatus from "@/components/atoms/status/ClassStatus";
import { ClassCreateInput, ClassInterface } from "@/types/class";
import { extractGradeFromName } from "@/utils/classCSV.utils";
import { applicationScrollbar } from "@/utils/styling.utils";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { Box, Typography, styled } from "@mui/material";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import ConfirmationModal from "../ConfirmationModal";
import GeneralModal from "../GeneralModal";

const StyledContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  minHeight: 400,
}));

const StyledFormRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
  gap: theme.spacing(1),
}));

const StyledListContainer = styled(Box)(({ theme }) => ({
  minHeight: 0,
  maxHeight: 350,
  overflow: "auto",
  ...applicationScrollbar(theme),
}));

const StyledClassRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child": {
    borderBottom: "none",
  },
}));

const StyledClassInfo = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 16,
  flex: 1,
});

const StyledEmptyState = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(6),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

type TeacherQuickManageModalProps = {
  open: boolean;
  onClose: () => void;
  classes: ClassInterface[];
  onAddClass: (classData: ClassCreateInput[]) => void;
  onDeleteClass: (ids: string[]) => void;
};

const TeacherQuickManageModal: React.FC<TeacherQuickManageModalProps> = ({
  open,
  onClose,
  classes,
  onAddClass,
  onDeleteClass,
}) => {
  const { t } = useTranslation();

  // Simplified form state - only class name needed
  const [name, setName] = useState("");

  // Delete confirmation state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<ClassInterface | null>(
    null,
  );

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setName("");
    }
  }, [open]);

  // Validation - only name required
  const formValid = name.trim().length > 0;

  const handleAddClass = useCallback(() => {
    if (!formValid) return;

    const trimmedName = name.trim();
    const extractedGrade = extractGradeFromName(trimmedName);

    // Auto-compute default school year (current year to next year)
    const schoolYearFrom = dayjs().startOf("year").toDate();
    const schoolYearTo = dayjs().add(1, "year").startOf("year").toDate();

    const payload: ClassCreateInput = {
      schoolYearFrom,
      schoolYearTo,
      name: trimmedName,
      grade: extractedGrade,
      isVocational: false,
      requiresEmployerInfo: false,
      active: true,
      incomplete: extractedGrade === null, // Mark as incomplete if grade cannot be extracted
    };

    onAddClass([payload]);

    // Reset form
    setName("");
  }, [formValid, name, onAddClass]);

  const handleDeleteClick = useCallback((classItem: ClassInterface) => {
    setClassToDelete(classItem);
    setDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (classToDelete) {
      onDeleteClass([classToDelete._id]);
      setClassToDelete(null);
      setDeleteModalOpen(false);
    }
  }, [classToDelete, onDeleteClass]);

  const handleCancelDelete = useCallback(() => {
    setClassToDelete(null);
    setDeleteModalOpen(false);
  }, []);

  const formatSchoolYear = (c: ClassInterface): string => {
    const from = c.schoolYearFrom
      ? new Date(c.schoolYearFrom).getFullYear()
      : null;
    const to = c.schoolYearTo ? new Date(c.schoolYearTo).getFullYear() : null;
    if (from && to) return `${from}/${to}`;
    return "-";
  };

  const sortedClasses = useMemo(() => {
    return [...classes].sort((a, b) => {
      // Sort by school year (newest first), then by name
      const aFrom = a.schoolYearFrom ? new Date(a.schoolYearFrom).getTime() : 0;
      const bFrom = b.schoolYearFrom ? new Date(b.schoolYearFrom).getTime() : 0;
      if (aFrom !== bFrom) return bFrom - aFrom;
      return a.name.localeCompare(b.name);
    });
  }, [classes]);

  const contentChildren = (
    <StyledContent>
      {/* Minimal Add Form */}
      <StyledFormRow>
        <GeneralInput
          label={t("modals.quickManage.classNameLabel")}
          placeholder={t("modals.quickManage.classNameHint")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          inputProps={{
            onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter" && formValid) {
                handleAddClass();
              }
            },
          }}
          style={{ marginTop: 8 }}
        />
        <SmallIconButton
          icon={<AddRoundedIcon />}
          onAction={handleAddClass}
          title={t("modals.quickManage.addNewClass")}
          disabled={!formValid}
          hugeIcon
        />
      </StyledFormRow>

      {/* Class List Section */}
      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {t("modals.quickManage.existingClasses")} ({classes.length})
        </Typography>

        <StyledListContainer>
          {sortedClasses.length === 0 ? (
            <StyledEmptyState>
              <SchoolRoundedIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
              <Typography variant="body2">
                {t("modals.quickManage.noClasses")}
              </Typography>
            </StyledEmptyState>
          ) : (
            sortedClasses.map((classItem) => (
              <StyledClassRow key={classItem._id}>
                <StyledClassInfo>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{ minWidth: 100 }}
                  >
                    {classItem.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ minWidth: 70 }}
                  >
                    {formatSchoolYear(classItem)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ minWidth: 50 }}
                  >
                    {classItem.grade !== null ? `Gr. ${classItem.grade}` : "-"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ minWidth: 60 }}
                  >
                    {classItem.studentCount ?? 0}{" "}
                    {t("modals.quickManage.students")}
                  </Typography>
                  <ClassStatus active={Boolean(classItem.active)} />
                </StyledClassInfo>
                <SmallIconButton
                  icon={<DeleteOutlineRoundedIcon />}
                  onAction={() => handleDeleteClick(classItem)}
                  title={t("modals.quickManage.deleteClass")}
                />
              </StyledClassRow>
            ))
          )}
        </StyledListContainer>
      </Box>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirmation={handleConfirmDelete}
        title={t("modals.quickManage.confirmDeleteTitle")}
        message={t("modals.quickManage.confirmDeleteMessage", {
          name: classToDelete?.name,
        })}
      />
    </StyledContent>
  );

  const actionsChildren = (
    <Fragment>
      <GeneralButton
        label={t("general.Close")}
        isPrimary={false}
        onAction={onClose}
        fullWidth={false}
      />
    </Fragment>
  );

  return (
    <GeneralModal
      open={open}
      onCloseModal={onClose}
      customTitle={t("modals.quickManage.title")}
      subtitle={t("modals.quickManage.subtitle")}
      modalWidth={800}
      modalMaxHeight={700}
      contentChildren={contentChildren}
      actionsChildren={actionsChildren}
      maxWidth="lg"
    />
  );
};

export default TeacherQuickManageModal;
