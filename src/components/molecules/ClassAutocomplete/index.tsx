"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { updateStudentClass } from "@/store/actions/studentActions";
import { AppDispatch } from "@/store/store";
import { ClassInterface } from "@/types/class";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Tooltip,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  minWidth: 200,
  backgroundColor: "transparent",
  maxWidth: 300,
  "& .MuiInputBase-root": {
    fontSize: "14px",
    color: theme.palette.text.default,
    backgroundColor: "transparent",
  },
  "& .MuiAutocomplete-input": {
    backgroundColor: "transparent",
    padding: "2px 4px !important",
  },
}));

const StyledCheckIcon = styled(Box)(({ theme }) => ({
  fontSize: "18px",
  height: 22,
  color: theme.palette.icon.primary,
  marginLeft: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  "& svg": {
    height: 18,
    width: 18,
    fontSize: "18px",
  },
  "& path": {
    fill: theme.palette.icon.primary,
  },
}));

const StyledExpandIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.icon.secondary,
  display: "flex",
  alignItems: "center",
  "& svg": {
    fontSize: "20px",
  },
}));

const StyledEmployerIcon = styled(Box)(({ theme }) => ({
  fontSize: "16px",
  height: 20,
  color: theme.palette.warning.main,
  marginLeft: theme.spacing(0.5),
  marginRight: theme.spacing(0.5),
  display: "flex",
  alignItems: "center",
  "& svg": {
    height: 16,
    width: 16,
    fontSize: "16px",
  },
}));

type ClassOption =
  (Pick<ClassInterface, "_id" | "name"> & Partial<ClassInterface>) | null;

const UNLINKED_CLASS_PREFIX = "unlinked-class:";

type Props = {
  studentId: string;
  currentClass: { _id: string; name: string } | string | null | undefined;
  currentClassName?: string;
  availableClasses: ClassInterface[];
  compact?: boolean;
};

const ClassAutocomplete: React.FC<Props> = ({
  studentId,
  currentClass,
  currentClassName,
  availableClasses,
  compact = true,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();

  const getCurrentClassId = (): string | null => {
    if (!currentClass) return null;
    if (typeof currentClass === "string") return currentClass;
    return currentClass._id;
  };

  const currentClassId = getCurrentClassId();
  const resolvedCurrentClass = useMemo<ClassOption>(() => {
    const classFromOptions = availableClasses.find(
      (classItem) => classItem._id === currentClassId,
    );
    if (classFromOptions) return classFromOptions;

    if (currentClass && typeof currentClass === "object") {
      return currentClass;
    }

    if (currentClassName) {
      return (
        availableClasses.find(
          (classItem) => classItem.name === currentClassName,
        ) || {
          _id: currentClassId || `${UNLINKED_CLASS_PREFIX}${currentClassName}`,
          name: currentClassName,
        }
      );
    }

    return null;
  }, [availableClasses, currentClass, currentClassId, currentClassName]);

  const [selectedClass, setSelectedClass] =
    useState<ClassOption>(resolvedCurrentClass);
  const [loading, setLoading] = useState(false);

  // Ref to track previous value for rollback without causing re-renders
  const previousClassRef = useRef<ClassOption>(resolvedCurrentClass);

  useEffect(() => {
    if (loading) return;

    previousClassRef.current = resolvedCurrentClass;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronize the controlled value after students and classes finish loading independently
    setSelectedClass((previousClass) =>
      previousClass?._id === resolvedCurrentClass?._id &&
      previousClass?.name === resolvedCurrentClass?.name
        ? previousClass
        : resolvedCurrentClass,
    );
  }, [loading, resolvedCurrentClass]);

  const formatClassOption = (classItem: NonNullable<ClassOption>): string => {
    return classItem.name;
  };

  const handleChange = useCallback(
    async (newValue: ClassOption) => {
      const previousClass = previousClassRef.current;
      const newClassId = newValue?._id || null;

      if (newClassId?.startsWith(UNLINKED_CLASS_PREFIX)) return;

      // Update ref and state for optimistic update
      previousClassRef.current = newValue;
      setSelectedClass(newValue);
      setLoading(true);

      try {
        await dispatch(updateStudentClass(studentId, newClassId));
      } catch {
        // Rollback on error
        previousClassRef.current = previousClass;
        setSelectedClass(previousClass);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, studentId],
  );

  const options: ClassOption[] = [
    null,
    ...(selectedClass &&
    !availableClasses.some((classItem) => classItem._id === selectedClass._id)
      ? [selectedClass]
      : []),
    ...availableClasses,
  ];

  return (
    <StyledAutocomplete
      value={selectedClass}
      onChange={(_, newValue) => handleChange(newValue as ClassOption)}
      options={options}
      getOptionLabel={(option) =>
        option && typeof option === "object" && "name" in option
          ? formatClassOption(option as NonNullable<ClassOption>)
          : "-"
      }
      isOptionEqualToValue={(option, value) => {
        const opt = option as ClassOption;
        const val = value as ClassOption;
        if (!opt && !val) return true;
        if (!opt || !val) return false;
        return opt?._id === val?._id;
      }}
      popupIcon={
        <StyledExpandIcon>
          <ExpandMoreRoundedIcon />
        </StyledExpandIcon>
      }
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        const opt = option as ClassOption;
        const isSelected = opt?._id === selectedClass?._id;

        return (
          <Box
            component="li"
            key={key}
            {...otherProps}
            sx={{
              borderBottom: (theme) =>
                `1px solid ${theme.palette.border.seperator}`,
              "&:last-child": {
                borderBottom: "none",
              },
              height: 40,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                py: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexGrow: 1,
                }}
              >
                <Box component="span">{opt ? formatClassOption(opt) : "-"}</Box>
                {opt?.requiresEmployerInfo && (
                  <Tooltip
                    title={t("classAutocomplete.requiresEmployerInfo")}
                    placement="right"
                  >
                    <StyledEmployerIcon>
                      <BusinessRoundedIcon />
                    </StyledEmployerIcon>
                  </Tooltip>
                )}
              </Box>
              {isSelected && (
                <StyledCheckIcon>
                  <CheckRoundedIcon />
                </StyledCheckIcon>
              )}
            </Box>
          </Box>
        );
      }}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="-"
          size="small"
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={16} /> : null}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
          }}
          fullWidth
          style={{
            backgroundColor: "transparent",
          }}
        />
      )}
      disabled={loading}
      size={compact ? "small" : "medium"}
      sx={{ flex: 1 }}
    />
  );
};

// Memoize to prevent re-renders when parent re-renders with same props
export default React.memo(ClassAutocomplete, (prevProps, nextProps) => {
  return (
    prevProps.studentId === nextProps.studentId &&
    prevProps.compact === nextProps.compact &&
    prevProps.currentClassName === nextProps.currentClassName &&
    // Compare class IDs instead of object references
    (prevProps.currentClass === nextProps.currentClass ||
      (typeof prevProps.currentClass === "object" &&
        typeof nextProps.currentClass === "object" &&
        prevProps.currentClass?._id === nextProps.currentClass?._id &&
        prevProps.currentClass?.name === nextProps.currentClass?.name)) &&
    // Compare availableClasses by length and IDs for stability
    prevProps.availableClasses.length === nextProps.availableClasses.length &&
    prevProps.availableClasses.every(
      (c, i) =>
        c._id === nextProps.availableClasses[i]?._id &&
        c.name === nextProps.availableClasses[i]?.name,
    )
  );
});
