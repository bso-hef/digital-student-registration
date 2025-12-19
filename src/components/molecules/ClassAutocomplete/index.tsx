"use client";

import React, { useCallback, useState } from "react";

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
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

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

type ClassOption = ClassInterface | null;

type Props = {
  studentId: string;
  currentClass: { _id: string; name: string } | string | null | undefined;
  availableClasses: ClassInterface[];
  compact?: boolean;
};

const ClassAutocomplete: React.FC<Props> = ({
  studentId,
  currentClass,
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
  const initialValue =
    availableClasses.find((c) => c._id === currentClassId) || null;

  const [selectedClass, setSelectedClass] = useState<ClassOption>(initialValue);
  const [loading, setLoading] = useState(false);

  const formatClassOption = (classItem: ClassInterface): string => {
    return classItem.name;
  };

  const handleChange = useCallback(
    async (newValue: ClassOption) => {
      const previousClass = selectedClass;
      const newClassId = newValue?._id || null;

      setSelectedClass(newValue); // Optimistic update
      setLoading(true);

      try {
        await dispatch(updateStudentClass(studentId, newClassId));
      } catch {
        setSelectedClass(previousClass); // Rollback on error
      } finally {
        setLoading(false);
      }
    },
    [dispatch, studentId, selectedClass],
  );

  const options: ClassOption[] = [null, ...availableClasses];

  return (
    <StyledAutocomplete
      value={selectedClass}
      onChange={(_, newValue) => handleChange(newValue as ClassOption)}
      options={options}
      getOptionLabel={(option) =>
        option && typeof option === "object" && "name" in option
          ? formatClassOption(option as ClassInterface)
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
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={16} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
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

export default ClassAutocomplete;
