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
import GeneralModal from "@/components/organisms/modals/GeneralModal";
import { ClassCreateInput } from "@/types/class";
import { applicationScrollbar } from "@/utils/styling.utils";
import { Box, styled } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";

import AppleSwitch from "@/components/atoms/AppleSwitch";

const FormWrap = styled(Box)(({ theme }) => ({
  maxHeight: 520,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  ...applicationScrollbar(theme),
}));

const Grid2 = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(0.75),
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "1fr" },
}));

type Props = {
  open: boolean;
  onClose: () => void;
  onAddClass: (classes: ClassCreateInput[]) => void;
};

const AddSingleClassModal: React.FC<Props> = ({
  open,
  onClose,
  onAddClass,
}) => {
  const { t } = useTranslation();

  const defaultFrom = useMemo(() => dayjs().startOf("year"), []);
  const defaultTo = useMemo(() => dayjs().add(1, "year").startOf("year"), []);

  const [yearFrom, setYearFrom] = useState<Dayjs | null>(defaultFrom);
  const [yearTo, setYearTo] = useState<Dayjs | null>(defaultTo);

  const [name, setName] = useState("");
  const [grade, setGrade] = useState<number | null>(null);
  const [isVocational, setIsVocational] = useState(false);
  const [requiresEmployerInfo, setRequiresEmployerInfo] = useState(false);
  const [active, setActive] = useState(true);

  const [touched, setTouched] = useState({
    yearFrom: false,
    yearTo: false,
    name: false,
    grade: false,
  });

  useEffect(() => {
    if (!open) return;
    setYearFrom(defaultFrom);
    setYearTo(defaultTo);
    setName("");
    setGrade(null);
    setIsVocational(false);
    setRequiresEmployerInfo(false);
    setActive(true);
    setTouched({ yearFrom: false, yearTo: false, name: false, grade: false });
  }, [open, defaultFrom, defaultTo]);

  const handleFromChange = useCallback(
    (v: Dayjs | null) => {
      setYearFrom(v);
      setTouched((p) => ({ ...p, yearFrom: true }));
      if (v && yearTo && v.year() >= yearTo.year()) {
        setYearTo(
          dayjs()
            .year(v.year() + 1)
            .startOf("year"),
        );
      }
    },
    [yearTo],
  );

  const handleToChange = useCallback((v: Dayjs | null) => {
    setYearTo(v);
    setTouched((p) => ({ ...p, yearTo: true }));
  }, []);

  // Validation
  const yearsValid = Boolean(
    yearFrom && yearTo && yearTo.year() > yearFrom.year(),
  );
  const gradeValid = grade !== null && Number.isFinite(grade);
  const formValid = yearsValid && name.trim().length > 0 && gradeValid;

  const handleSubmit = useCallback(() => {
    if (!formValid || !yearFrom || !yearTo) return;

    const payload: ClassCreateInput = {
      schoolYearFrom: yearFrom.toDate(),
      schoolYearTo: yearTo.toDate(),
      name: name.trim(),
      grade,
      isVocational,
      requiresEmployerInfo,
      active,
    };

    onAddClass([payload]);
  }, [
    formValid,
    yearFrom,
    yearTo,
    name,
    grade,
    isVocational,
    requiresEmployerInfo,
    active,
    onAddClass,
  ]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey && formValid) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [formValid, handleSubmit],
  );

  const contentChildren = (
    <Box onKeyDown={handleKeyDown}>
      <FormWrap>
        <Grid2>
          <DatePicker
            views={["year"]}
            value={yearFrom}
            onChange={handleFromChange}
            format="YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
                label:
                  touched.yearFrom && !yearFrom
                    ? t("modals.addClass.required")
                    : t("modals.addClass.schoolYearFrom"),
                InputLabelProps: { shrink: true },
                size: "small",
                style: {
                  height: "50px",
                  marginTop: "6px",
                  marginBottom: "8px",
                },
                error: Boolean(touched.yearFrom && !yearFrom),
                sx: {
                  "& .MuiOutlinedInput-root": {
                    height: 50,
                    borderRadius: 10,
                    marginTop: 0.5,
                  },
                },
              },
            }}
          />
          <DatePicker
            views={["year"]}
            value={yearTo}
            onChange={handleToChange}
            format="YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
                label:
                  touched.yearTo &&
                  (!yearTo || !yearFrom || yearTo.year() <= yearFrom.year())
                    ? t("modals.addClass.yearOrderError")
                    : t("modals.addClass.schoolYearTo"),
                InputLabelProps: { shrink: true },
                size: "small",
                style: {
                  height: "50px",
                  marginTop: "6px",
                  marginBottom: "8px",
                },
                error: Boolean(
                  touched.yearTo &&
                    (!yearTo || !yearFrom || yearTo.year() <= yearFrom.year()),
                ),
                sx: {
                  "& .MuiOutlinedInput-root": {
                    height: 50,
                    borderRadius: 10,
                  },
                },
              },
            }}
          />
        </Grid2>
        <Grid2>
          <GeneralInput
            fullWidth
            label={
              touched.name && !name
                ? t("modals.addClass.required")
                : t("modals.addClass.className")
            }
            placeholder={t("modals.addClass.classNamePlaceholder")}
            style={{
              height: "50px",
              flexShrink: 0,
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, name: true }))}
            error={touched.name && !name}
          />
          <GeneralInput
            fullWidth
            label={
              touched.grade && !gradeValid
                ? t("modals.addClass.onlyNumbers")
                : t("modals.addClass.grade")
            }
            placeholder={t("modals.addClass.gradePlaceholder")}
            style={{
              height: "50px",
              flexShrink: 0,
            }}
            value={grade ?? ""}
            onChange={(e) => {
              const v = e.target.value.trim();
              if (v === "") {
                setGrade(null);
              } else {
                const n = Number(v);
                setGrade(Number.isFinite(n) ? n : grade); // nur setzen, wenn numerisch
              }
            }}
            onBlur={() => setTouched((p) => ({ ...p, grade: true }))}
            error={touched.grade && !gradeValid}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
        </Grid2>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            rowGap: 1.5,
            alignItems: "center",
            mt: 0.5,
          }}
        >
          <Box sx={{ fontWeight: 600 }}>
            {t("modals.addClass.companyClass")}
          </Box>
          <AppleSwitch
            checked={isVocational}
            onChange={(_, c) => setIsVocational(c)}
          />

          <Box sx={{ fontWeight: 600 }}>
            {t("modals.addClass.requiresEmployerInfo")}
          </Box>
          <AppleSwitch
            checked={requiresEmployerInfo}
            onChange={(_, c) => setRequiresEmployerInfo(c)}
          />

          <Box sx={{ fontWeight: 600 }}>{t("modals.addClass.active")}</Box>
          <AppleSwitch checked={active} onChange={(_, c) => setActive(c)} />
        </Box>
      </FormWrap>
    </Box>
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
        label={t("modals.addClass.createClasses")}
        onAction={handleSubmit}
        disabled={!formValid}
        fullWidth={false}
      />
    </Fragment>
  );

  return (
    <GeneralModal
      open={open}
      onCloseModal={onClose}
      customTitle={t("modals.addClass.title")}
      subtitle={t("modals.addClass.subtitleSingle")}
      modalWidth={720}
      modalMaxHeight={680}
      contentChildren={contentChildren}
      actionsChildren={actionsChildren}
    />
  );
};

export default AddSingleClassModal;
