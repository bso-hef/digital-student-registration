import React, { Fragment, useEffect, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import classService from "@/lib/services/classService";
import { ClassInterface } from "@/types/class";
import {
  ClassWithStudents,
  buildClassZipExport,
  buildMultiClassQrPdf,
  generateClassExportFilename,
} from "@/utils/classPdf.utils";
import { downloadBlob } from "@/utils/general.utils";
import {
  buildCombinedQrPdf,
  buildNewRegistrationPdf,
  buildPdfForStudent,
} from "@/utils/pdf.utils";
import { sanitizeFilename } from "@/utils/string.utils";
import { buildZip } from "@/utils/zip.utils";
import CropLandscapeRoundedIcon from "@mui/icons-material/CropLandscapeRounded";
import CropPortraitRoundedIcon from "@mui/icons-material/CropPortraitRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FolderZipRoundedIcon from "@mui/icons-material/FolderZipRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  FormControlLabel,
  LinearProgress,
  Paper,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { RootState } from "@/store/reducers";

import GeneralModal from "../GeneralModal";

// Stable empty array references to prevent infinite re-renders
// when these props are not provided by parent
const EMPTY_CLASS_IDS: string[] = [];
const EMPTY_CLASSES: ClassInterface[] = [];

const StyledContentStack = styled(Stack)(({}) => ({
  width: "100%",
}));

const StyledHeadline = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "16px !important",
  lineHeight: "24px !important",
  color: theme.palette.text.default,
  marginBottom: theme.spacing(1),
}));

const StyledOptionLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "14px !important",
  lineHeight: "20px !important",
  color: theme.palette.text.information,
}));

const StyledQRPreviewBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isPortrait",
})<{ isPortrait?: boolean }>(({ theme, isPortrait }) => ({
  width: "100%",
  height: "100%",
  maxWidth: isPortrait ? 180 : 140,
  maxHeight: isPortrait ? 180 : 140,
  aspectRatio: "1 / 1",
  borderRadius: theme.spacing(1),
  border: `2px dashed ${theme.palette.primary.main}`,
  display: "grid",
  placeItems: "center",
  fontWeight: 700,
  letterSpacing: 2,
  userSelect: "none",
}));

type Student = {
  _id: string;
  firstName: string;
  lastName: string;
  className?: string;
  currentClassName?: string;
  currentClass?: { name?: string } | string | null;
  verificationCode?: string;
};

type GenerateQrModalProps = {
  open: boolean;
  onClose: () => void;
  students: Student[];
  // Class mode props - for generating QR codes from the class management page
  classMode?: boolean;
  selectedClassIds?: string[];
  classes?: ClassInterface[];
};

const GenerateQrDialog: React.FC<GenerateQrModalProps> = ({
  open,
  onClose,
  students,
  classMode = false,
  selectedClassIds = EMPTY_CLASS_IDS,
  classes = EMPTY_CLASSES,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const locale = useSelector((state: RootState) => state.ui.locale) || "en";
  const wlanSettings = useSelector(
    (state: RootState) => state.appSettings.data?.system?.wlan,
  );

  // Check if WLAN is configured and available
  const isWlanConfigured =
    wlanSettings?.enabled && wlanSettings?.ssid && wlanSettings.ssid.length > 0;

  const [pageSize, setPageSize] = useState<"A4" | "A5">("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait",
  );
  const [filenamePattern, setFilenamePattern] = useState(
    "{nachname}_{vorname}_{klasse}.pdf",
  );
  const [includeClass, setIncludeClass] = useState(true);
  const [shortenId, setShortenId] = useState(true);
  const [exportMode, setExportMode] = useState<"zip" | "combined">("combined");
  const [includeWlan, setIncludeWlan] = useState(true);
  const [newRegistrationFilename, setNewRegistrationFilename] = useState(
    "neue_schueler_registrierung",
  );

  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [wizardUrlTemplate, setWizardUrlTemplate] = useState<string>();
  const [runtimeConfigError, setRuntimeConfigError] = useState(false);

  // Class mode state
  const [includeCoverPages, setIncludeCoverPages] = useState(true);
  const [classesWithStudents, setClassesWithStudents] = useState<
    ClassWithStudents[]
  >([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const loadStudentsForClasses = async () => {
    setLoadingStudents(true);
    try {
      const results: ClassWithStudents[] = [];

      for (const classId of selectedClassIds) {
        const classInfo = classes.find((c) => c._id === classId);
        if (classInfo) {
          const response = await classService.getStudentsInClass(classId);
          results.push({
            classInfo,
            students: response.data?.students || [],
          });
        }
      }

      setClassesWithStudents(results);
    } catch (error) {
      console.error("Failed to load students for classes:", error);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Load students when in class mode
  useEffect(() => {
    if (open && classMode && selectedClassIds.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs local class-student cache to external "modal open" state; loads on open, clears on close
      loadStudentsForClasses();
    } else if (!open) {
      // Reset state when modal closes (only if not already empty to prevent re-renders)
      setClassesWithStudents((prev) => (prev.length > 0 ? [] : prev));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, classMode, selectedClassIds]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const controller = new AbortController();
    Promise.resolve()
      .then(() => {
        if (controller.signal.aborted) {
          return undefined;
        }

        setWizardUrlTemplate(undefined);
        setRuntimeConfigError(false);

        return fetch("/api/config/public", {
          cache: "no-store",
          signal: controller.signal,
        });
      })
      .then(async (response) => {
        if (!response) {
          return undefined;
        }

        if (!response.ok) {
          throw new Error("Runtime configuration could not be loaded");
        }

        return (await response.json()) as { appUrl: string };
      })
      .then((config) => {
        if (!config) {
          return;
        }

        const { appUrl } = config;
        setWizardUrlTemplate(`${appUrl}/student/{short-id}`);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Failed to load QR code runtime configuration:", error);
        setRuntimeConfigError(true);
      });

    return () => controller.abort();
  }, [open]);

  const runtimeConfigLoading =
    open && !wizardUrlTemplate && !runtimeConfigError;

  // Calculate total students in class mode
  const totalClassStudents = classesWithStudents.reduce(
    (sum, c) => sum + c.students.length,
    0,
  );

  const count = students?.length || 0;
  const sample = count
    ? students[Math.min(0, count - 1)]
    : {
        firstName: "Max",
        lastName: "Muster",
        className: "7B",
        _id: "671c23e91f4a9a2d7c3e1b45",
        verificationCode: "A1B2C3",
      };

  const isPortrait = orientation === "portrait";

  const getClassName = (s: Student): string => {
    return (
      s.currentClassName ||
      (s.currentClass && typeof s.currentClass === "object"
        ? s.currentClass.name || ""
        : s.currentClass || "") ||
      s.className ||
      ""
    );
  };

  const resolveFilename = (s: Student) => {
    const sid = s._id || "";
    const map: Record<string, string> = {
      "{vorname}": sanitizeFilename(s.firstName),
      "{nachname}": sanitizeFilename(s.lastName),
      "{klasse}": sanitizeFilename(s.className || "ohne_klasse"),
      "{id}": sanitizeFilename(sid),
      "{shortId}": sanitizeFilename(sid.slice(0, 8)),
    };
    let name = filenamePattern;
    Object.keys(map).forEach((k) => (name = name.replaceAll(k, map[k])));
    if (!name.toLowerCase().endsWith(".pdf")) name += ".pdf";
    return name;
  };

  const isNewRegistrationMode = !students?.length && !classMode;

  const generateExport = async () => {
    if (!wizardUrlTemplate) {
      return;
    }

    setBusy(true);
    setProgress(0);

    const pdfSettings = {
      pageSize,
      orientation,
      includeClass,
      shortenId,
      wizardUrlTemplate,
      locale,
      hidePageLabel: true, // Hide the A4/Portrait label in actual exports
      includeWlan: includeWlan && isWlanConfigured,
      wlanSettings: isWlanConfigured ? wlanSettings : undefined,
    };

    try {
      // Class mode: generate PDFs for all students in selected classes
      if (classMode && classesWithStudents.length > 0) {
        const classPdfSettings = {
          ...pdfSettings,
          includeCoverPages,
          includeNumbering: true, // Always enabled in class mode
        };

        if (exportMode === "zip") {
          // ZIP mode: separate PDF per class
          const zipBlob = await buildClassZipExport(
            classesWithStudents,
            classPdfSettings,
            (p) => setProgress(p),
          );
          downloadBlob(generateClassExportFilename("zip", locale), zipBlob);
        } else {
          // Combined mode: all classes in one PDF
          const pdf = await buildMultiClassQrPdf(
            classesWithStudents,
            classPdfSettings,
            (p) => setProgress(p),
          );
          downloadBlob(generateClassExportFilename("combined", locale), pdf);
        }
      } else if (isNewRegistrationMode) {
        // New registration mode: generate a PDF with QR code linking to /student
        const pdf = await buildNewRegistrationPdf({
          pageSize,
          orientation,
          wizardUrlTemplate,
          locale,
          includeWlan: includeWlan && isWlanConfigured,
          wlanSettings: isWlanConfigured ? wlanSettings : undefined,
        });
        const filename = `${sanitizeFilename(newRegistrationFilename)}.pdf`;
        downloadBlob(filename, pdf);
        setProgress(100);
      } else if (students.length === 1) {
        // Single student: download individual PDF
        const s = students[0];
        const pdf = await buildPdfForStudent(s, pdfSettings);
        const filename = resolveFilename(s);
        downloadBlob(filename, pdf);
        setProgress(100);
      } else if (exportMode === "combined") {
        // Multiple students with combined mode: single multi-page PDF
        const pdf = await buildCombinedQrPdf(
          students as Student[],
          pdfSettings,
          (p) => setProgress(p),
        );
        downloadBlob(
          `schueler_qr_pdfs_combined_${pageSize}_${orientation}.pdf`,
          pdf,
        );
      } else {
        // Multiple students with ZIP mode: separate PDFs in a ZIP
        const files: Array<{ name: string; blob: Blob }> = [];
        let done = 0;

        for (const s of students as Student[]) {
          const pdf = await buildPdfForStudent(s, pdfSettings);
          files.push({ name: resolveFilename(s), blob: pdf });
          done += 1;
          setProgress(Math.round((done / students.length) * 95));
        }

        const zipBlob = await buildZip(files, (p) =>
          setProgress(95 + Math.round((p || 0) * 0.05)),
        );

        downloadBlob(
          `schueler_qr_pdfs_${pageSize}_${orientation}.zip`,
          zipBlob,
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
      setProgress(null);
      onClose?.();
    }
  };

  const handleGenerate = async () => {
    await generateExport();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !busy &&
      wizardUrlTemplate
    ) {
      event.preventDefault();
      handleGenerate();
    }
  };

  const contentChildren = (
    <Fragment>
      {runtimeConfigError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Die QR-Code-URL konnte nicht aus der Laufzeitkonfiguration geladen
          werden.
        </Alert>
      )}

      {busy && (
        <Box sx={{ px: 3, pb: 1 }}>
          <LinearProgress
            variant={progress == null ? "indeterminate" : "determinate"}
            value={progress ?? 0}
            sx={{ borderRadius: 1 }}
          />
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            {progress == null
              ? t("modals.generateQrModal.creatingPdf")
              : t("modals.generateQrModal.progress", {
                  progress: Math.round(progress),
                })}
          </Typography>
        </Box>
      )}

      {classMode && loadingStudents && (
        <Box sx={{ pb: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress size={20} />
          <Typography variant="body2">
            {t("modals.generateQrModal.loadingStudents")}
          </Typography>
        </Box>
      )}

      {classMode && !loadingStudents && classesWithStudents.length > 0 && (
        <Box sx={{ pb: 2 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {t("modals.generateQrModal.totalStudents", {
              count: totalClassStudents,
            })}
            {" • "}
            {t("modals.generateQrModal.classCount", {
              count: classesWithStudents.length,
            })}
          </Typography>
        </Box>
      )}

      {isNewRegistrationMode ? (
        // New Registration Mode UI
        <StyledContentStack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          divider={<Divider flexItem orientation="vertical" />}
          onKeyDown={handleKeyDown}
        >
          <Stack
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
            spacing={2}
          >
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
              {t("modals.generateQrModal.newRegistration.description")}
            </Typography>

            <Stack spacing={1}>
              <StyledOptionLabel>
                {t("modals.generateQrModal.pageSize")}
              </StyledOptionLabel>
              <ToggleButtonGroup
                value={pageSize}
                exclusive
                onChange={(_, v) => v && setPageSize(v)}
                size="small"
              >
                <ToggleButton value="A4">A4</ToggleButton>
                <ToggleButton value="A5">A5</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            <Stack spacing={1}>
              <StyledOptionLabel>
                {t("modals.generateQrModal.orientation")}
              </StyledOptionLabel>
              <ToggleButtonGroup
                value={orientation}
                exclusive
                onChange={(_, v) => v && setOrientation(v)}
                size="small"
              >
                <ToggleButton value="portrait">
                  <CropPortraitRoundedIcon sx={{ mr: 1 }} />
                  {t("modals.generateQrModal.portrait")}
                </ToggleButton>
                <ToggleButton value="landscape">
                  <CropLandscapeRoundedIcon sx={{ mr: 1 }} />
                  {t("modals.generateQrModal.landscape")}
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            {isWlanConfigured && (
              <Stack spacing={1}>
                <StyledOptionLabel>
                  {t("modals.generateQrModal.options")}
                </StyledOptionLabel>
                <Tooltip
                  title={t("modals.generateQrModal.includeWlanTooltip", {
                    ssid: wlanSettings?.ssid,
                  })}
                  placement="right"
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={includeWlan}
                        onChange={(e) => setIncludeWlan(e.target.checked)}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <WifiRoundedIcon fontSize="small" color="primary" />
                        {t("modals.generateQrModal.includeWlan")}
                      </Box>
                    }
                  />
                </Tooltip>
              </Stack>
            )}
            <Stack spacing={1}>
              <StyledOptionLabel>
                {t("modals.generateQrModal.filename")}
              </StyledOptionLabel>
              <TextField
                value={newRegistrationFilename}
                onChange={(e) => setNewRegistrationFilename(e.target.value)}
                size="small"
                helperText={t(
                  "modals.generateQrModal.newRegistration.filenameHelper",
                )}
              />
            </Stack>
          </Stack>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <StyledHeadline>
              {t("modals.generateQrModal.previewMock")}
            </StyledHeadline>
            <Paper
              sx={{
                mt: 1,
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  aspectRatio:
                    orientation === "portrait" ? "1/1.4142" : "1.4142/1",
                  borderRadius: 2,
                  border: `1px dashed ${theme.palette.border.seperator}`,
                  p: 2,
                  gap: 1,
                  bgcolor: theme.palette.surface.interface.background,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateRows: "auto 1fr auto",
                    gap: 1,
                    height: "100%",
                    width: "100%",
                    boxSizing: "border-box",
                    overflow: "hidden",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <QrCode2RoundedIcon sx={{ fontSize: 18 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {t("modals.generateQrModal.newRegistration.pdfTitle")}
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      minHeight: 0,
                      overflow: "hidden",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: "flex-start" }}
                    >
                      <StyledQRPreviewBox isPortrait={isPortrait}>
                        QR
                      </StyledQRPreviewBox>

                      <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {t("modals.generateQrModal.newRegistration.pdfTitle")}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", fontSize: "0.65rem" }}
                        >
                          {t(
                            "modals.generateQrModal.newRegistration.description",
                          )}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.disabled",
                            fontSize: "0.6rem",
                          }}
                        >
                          URL: /student
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Instruction Box Preview */}
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: (t) =>
                          t.palette.mode === "dark" ? "grey.800" : "grey.100",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        flexShrink: 0,
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {includeWlan && isWlanConfigured && (
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px dashed",
                              borderColor: "grey.400",
                              borderRadius: 0.5,
                              flexShrink: 0,
                            }}
                          >
                            <WifiRoundedIcon
                              sx={{ color: "grey.500", fontSize: 16 }}
                            />
                          </Box>
                        )}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: "bold",
                              display: "block",
                              fontSize: "0.65rem",
                            }}
                          >
                            {t(
                              "modals.generateQrModal.newRegistration.pdfInstructions.title",
                            )}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              display: "block",
                              fontSize: "0.6rem",
                            }}
                          >
                            {t(
                              "modals.generateQrModal.newRegistration.pdfInstructions.option1Title",
                            )}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              display: "block",
                              fontSize: "0.6rem",
                            }}
                          >
                            {t(
                              "modals.generateQrModal.newRegistration.pdfInstructions.option2Title",
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontSize: "0.65rem" }}
                    >
                      {pageSize?.toUpperCase()} •{" "}
                      {isPortrait
                        ? t("modals.generateQrModal.portrait")
                        : t("modals.generateQrModal.landscape")}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontSize: "0.65rem" }}
                    >
                      {newRegistrationFilename}.pdf
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </Paper>
          </Box>
        </StyledContentStack>
      ) : (
        // Existing Student QR Code Mode UI
        <StyledContentStack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          divider={<Divider flexItem orientation="vertical" />}
          onKeyDown={handleKeyDown}
        >
          <Stack
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
            spacing={2}
          >
            <Stack spacing={1}>
              <StyledOptionLabel>
                {t("modals.generateQrModal.pageSize")}
              </StyledOptionLabel>
              <ToggleButtonGroup
                value={pageSize}
                exclusive
                onChange={(_, v) => v && setPageSize(v)}
                size="small"
              >
                <ToggleButton value="A4">A4</ToggleButton>
                <ToggleButton value="A5">A5</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            <Stack spacing={1}>
              <StyledOptionLabel>
                {t("modals.generateQrModal.orientation")}
              </StyledOptionLabel>
              <ToggleButtonGroup
                value={orientation}
                exclusive
                onChange={(_, v) => v && setOrientation(v)}
                size="small"
              >
                <ToggleButton value="portrait">
                  <CropPortraitRoundedIcon sx={{ mr: 1 }} />
                  {t("modals.generateQrModal.portrait")}
                </ToggleButton>
                <ToggleButton value="landscape">
                  <CropLandscapeRoundedIcon sx={{ mr: 1 }} />
                  {t("modals.generateQrModal.landscape")}
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            {(count >= 2 || classMode) && (
              <Stack spacing={1}>
                <StyledOptionLabel>
                  {t("modals.generateQrModal.exportMode")}
                </StyledOptionLabel>
                <ToggleButtonGroup
                  value={exportMode}
                  exclusive
                  onChange={(_, v) => v && setExportMode(v)}
                  size="small"
                >
                  <ToggleButton value="zip">
                    <FolderZipRoundedIcon sx={{ mr: 1 }} />
                    {t("modals.generateQrModal.separateFiles")}
                  </ToggleButton>
                  <ToggleButton value="combined">
                    <PictureAsPdfRoundedIcon sx={{ mr: 1 }} />
                    {t("modals.generateQrModal.combinedPdf")}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            )}

            <Stack>
              <StyledOptionLabel
                sx={{
                  mb: 1,
                }}
              >
                {t("modals.generateQrModal.filenameSchema")}
              </StyledOptionLabel>

              <TextField
                value={filenamePattern}
                onChange={(e) => setFilenamePattern(e.target.value)}
                size="small"
                helperText={`${t("modals.generateQrModal.availableOptions")}: {vorname}, {nachname}, {klasse}, {id}, {shortId}`}
              />
            </Stack>

            <Stack>
              <StyledOptionLabel
                sx={{
                  mb: 1,
                }}
              >
                {t("modals.generateQrModal.options")}
              </StyledOptionLabel>
              <FormControlLabel
                control={
                  <Switch
                    checked={includeClass}
                    onChange={(e) => setIncludeClass(e.target.checked)}
                  />
                }
                label={t("modals.generateQrModal.showClassOnPdf")}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={shortenId}
                    onChange={(e) => setShortenId(e.target.checked)}
                  />
                }
                label={t("modals.generateQrModal.shortenIdInLink")}
              />
              {isWlanConfigured && (
                <Tooltip
                  title={t("modals.generateQrModal.includeWlanTooltip", {
                    ssid: wlanSettings?.ssid,
                  })}
                  placement="right"
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={includeWlan}
                        onChange={(e) => setIncludeWlan(e.target.checked)}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <WifiRoundedIcon fontSize="small" color="primary" />
                        {t("modals.generateQrModal.includeWlan")}
                      </Box>
                    }
                  />
                </Tooltip>
              )}
              {classMode && (
                <Tooltip
                  title={t("modals.generateQrModal.includeCoverPagesTooltip")}
                  placement="right"
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={includeCoverPages}
                        onChange={(e) => setIncludeCoverPages(e.target.checked)}
                      />
                    }
                    label={t("modals.generateQrModal.includeCoverPages")}
                  />
                </Tooltip>
              )}
            </Stack>
          </Stack>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <StyledHeadline>
              {t("modals.generateQrModal.previewMock")}
            </StyledHeadline>
            <Paper
              sx={{
                mt: 1,
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  aspectRatio:
                    orientation === "portrait" ? "1/1.4142" : "1.4142/1",
                  borderRadius: 2,
                  border: `1px dashed ${theme.palette.border.seperator}`,
                  p: 2,
                  gap: 1,
                  bgcolor: theme.palette.surface.interface.background,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateRows: "auto 1fr auto",
                    gap: 1,
                    height: "100%",
                    width: "100%",
                    boxSizing: "border-box",
                    overflow: "hidden",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <QrCode2RoundedIcon sx={{ fontSize: 18 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {t("modals.generateQrModal.onboardingWizard")}
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      minHeight: 0,
                      overflow: "hidden",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: "flex-start" }}
                    >
                      <StyledQRPreviewBox isPortrait={isPortrait}>
                        QR
                      </StyledQRPreviewBox>

                      <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 800, textTransform: "capitalize" }}
                        >
                          {sample.firstName} {sample.lastName}
                        </Typography>
                        {includeClass && getClassName(sample) && (
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {t("modals.generateQrModal.class")}{" "}
                            <b>{getClassName(sample)}</b>
                          </Typography>
                        )}
                        {sample.verificationCode && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.primary",
                              fontWeight: 600,
                              fontSize: "0.7rem",
                            }}
                          >
                            {t("modals.generateQrModal.verificationCode")}{" "}
                            <b>{sample.verificationCode}</b>
                          </Typography>
                        )}
                        <Typography
                          variant="caption"
                          sx={{ color: "text.disabled", fontSize: "0.65rem" }}
                        >
                          {t("modals.generateQrModal.id")}{" "}
                          {shortenId
                            ? (sample._id || "").slice(0, 8)
                            : sample._id}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Instruction Box Preview */}
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: (t) =>
                          t.palette.mode === "dark" ? "grey.800" : "grey.100",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        flexShrink: 0,
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {includeWlan && isWlanConfigured && (
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px dashed",
                              borderColor: "grey.400",
                              borderRadius: 0.5,
                              flexShrink: 0,
                            }}
                          >
                            <WifiRoundedIcon
                              sx={{ color: "grey.500", fontSize: 16 }}
                            />
                          </Box>
                        )}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: "bold",
                              display: "block",
                              fontSize: "0.65rem",
                            }}
                          >
                            {t("modals.generateQrModal.pdfInstructions.title")}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              display: "block",
                              fontSize: "0.6rem",
                            }}
                          >
                            {t(
                              "modals.generateQrModal.pdfInstructions.option1Title",
                            )}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              display: "block",
                              fontSize: "0.6rem",
                            }}
                          >
                            {t(
                              "modals.generateQrModal.pdfInstructions.option2Title",
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontSize: "0.65rem" }}
                    >
                      {pageSize?.toUpperCase()} •{" "}
                      {isPortrait
                        ? t("modals.generateQrModal.portrait")
                        : t("modals.generateQrModal.landscape")}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontSize: "0.65rem" }}
                    >
                      {sample?.lastName}_{sample.firstName}
                      {includeClass && getClassName(sample)
                        ? `_${getClassName(sample)}`
                        : ""}
                      .pdf
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </Paper>
          </Box>
        </StyledContentStack>
      )}
    </Fragment>
  );

  // Determine button label and icon based on count, export mode, and class mode
  const getButtonLabel = () => {
    if (classMode) {
      if (loadingStudents) {
        return t("modals.generateQrModal.loadingStudents");
      }
      if (totalClassStudents === 0) {
        return t("modals.generateQrModal.noStudents");
      }
      if (exportMode === "combined") {
        return t("modals.generateQrModal.downloadCombinedPdf");
      }
      return t("modals.generateQrModal.createZip");
    }
    if (isNewRegistrationMode) {
      return t("modals.generateQrModal.downloadPdf");
    }
    if (count === 1) {
      return t("modals.generateQrModal.downloadPdf");
    }
    if (exportMode === "combined") {
      return t("modals.generateQrModal.downloadCombinedPdf");
    }
    return t("modals.generateQrModal.createZip");
  };

  const getButtonIcon = () => {
    if (classMode) {
      if (loadingStudents) {
        return <CircularProgress size={20} />;
      }
      if (exportMode === "combined") {
        return <PictureAsPdfRoundedIcon />;
      }
      return <FolderZipRoundedIcon />;
    }
    if (isNewRegistrationMode || count === 1) {
      return <DownloadRoundedIcon />;
    }
    if (exportMode === "combined") {
      return <PictureAsPdfRoundedIcon />;
    }
    return <FolderZipRoundedIcon />;
  };

  const getModalTitle = () => {
    if (classMode) {
      return t("modals.generateQrModal.classTitle", {
        count: selectedClassIds.length,
      });
    }
    if (isNewRegistrationMode) {
      return t("modals.generateQrModal.newRegistration.title");
    }
    return t("modals.generateQrModal.title");
  };

  const actionsChildren = (
    <Fragment>
      <GeneralButton
        label={t("general.Cancel")}
        onAction={onClose}
        disabled={busy}
        isPrimary={false}
      />
      <GeneralButton
        label={getButtonLabel()}
        onAction={handleGenerate}
        disabled={
          busy ||
          runtimeConfigLoading ||
          !wizardUrlTemplate ||
          loadingStudents ||
          (classMode && totalClassStudents === 0)
        }
        startIcon={getButtonIcon()}
      />
    </Fragment>
  );

  return (
    <GeneralModal
      open={open}
      onCloseModal={onClose}
      modalWidth={1000}
      maxWidth="xl"
      customTitle={getModalTitle()}
      contentChildren={contentChildren}
      actionsChildren={actionsChildren}
    />
  );
};

export default GenerateQrDialog;
