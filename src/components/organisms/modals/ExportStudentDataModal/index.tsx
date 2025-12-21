import React, { Fragment, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import { Student as StudentType } from "@/types/db";
import { downloadBlob } from "@/utils/general.utils";
import { buildStudentDataPdf } from "@/utils/pdf.utils";
import { sanitizeFilename } from "@/utils/string.utils";
import { buildZip } from "@/utils/zip.utils";
import CropLandscapeRoundedIcon from "@mui/icons-material/CropLandscapeRounded";
import CropPortraitRoundedIcon from "@mui/icons-material/CropPortraitRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import FolderZipRoundedIcon from "@mui/icons-material/FolderZipRounded";
import {
  Box,
  Divider,
  FormControlLabel,
  LinearProgress,
  Paper,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { RootState } from "@/store/reducers";

import GeneralModal from "../GeneralModal";

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

const StyledPreviewBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isPortrait",
})<{ isPortrait?: boolean }>(({ theme, isPortrait }) => ({
  width: "100%",
  height: "100%",
  minHeight: isPortrait ? 200 : 180,
  maxHeight: isPortrait ? undefined : 220,
  aspectRatio: isPortrait ? "210/297" : "297/210",
  borderRadius: theme.spacing(1),
  border: `1px dashed ${theme.palette.border.seperator}`,
  display: "flex",
  flexDirection: "column",
  alignItems: isPortrait ? "center" : "flex-start",
  justifyContent: "flex-start",
  padding: theme.spacing(2),
  paddingTop: theme.spacing(2),
  overflow: "auto",
  bgcolor: theme.palette.surface.interface.background,
}));

type ExportStudentDataModalProps = {
  open: boolean;
  onClose: () => void;
  students: StudentType[];
};

const ExportStudentDataModal: React.FC<ExportStudentDataModalProps> = ({
  open,
  onClose,
  students,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const locale = useSelector((state: RootState) => state.ui.locale) || "en";

  const [exportFormat, setExportFormat] = useState<"pdf" | "json" | "csv">(
    "pdf",
  );
  const [csvMode, setCsvMode] = useState<"separate" | "combined">("separate");
  const [pageSize, setPageSize] = useState<"A4" | "A5">("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait",
  );
  const [filenamePattern, setFilenamePattern] = useState(
    "{lastName}_{firstName}_{class}_data.pdf",
  );
  const [includeEmptyFields, setIncludeEmptyFields] = useState(false);

  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const count = students?.length || 0;
  const sample: StudentType = count
    ? students[Math.min(0, count - 1)]
    : ({
        firstName: "Max",
        lastName: "Muster",
        currentClassName: "7B",
        _id: "671c23e91f4a9a2d7c3e1b45",
        dateOfBirth: null,
        status: "imported" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as StudentType);

  const isPortrait = orientation === "portrait";

  const getClassName = (s: StudentType): string => {
    // Use cached class name if available, otherwise use class ID
    return s.currentClassName || s.currentClass || "";
  };

  const resolveFilename = (s: StudentType, format: "pdf" | "json" | "csv") => {
    const sid = String(s._id || "");
    const dateStr = dayjs().format("DD-MM-YYYY");
    const classNameStr = getClassName(s) || "ohne_klasse";

    const extension =
      format === "pdf" ? ".pdf" : format === "json" ? ".json" : ".csv";

    const map: Record<string, string> = {
      "{firstName}": sanitizeFilename(s.firstName || ""),
      "{lastName}": sanitizeFilename(s.lastName || ""),
      "{class}": sanitizeFilename(classNameStr),
      "{date}": dateStr,
      "{id}": sanitizeFilename(sid),
      "{shortId}": sanitizeFilename(sid.slice(0, 8)),
    };
    let name = filenamePattern;
    Object.keys(map).forEach((k) => (name = name.replaceAll(k, map[k])));

    name = name.replace(/\.(pdf|json|csv)$/i, "");
    name += extension;

    return name;
  };

  const generateExport = async () => {
    if (!students?.length) return;

    setBusy(true);
    setProgress(0);

    try {
      if (
        exportFormat === "csv" &&
        csvMode === "combined" &&
        students.length > 1
      ) {
        const { buildCombinedStudentDataCsv } = await import(
          "@/utils/csv.utils"
        );
        const blob = await buildCombinedStudentDataCsv(
          students as StudentType[],
          {
            includeEmptyFields,
            locale,
          },
        );
        setProgress(95);

        const dateStr = dayjs().format("DD-MM-YYYY");
        const filename = `student_data_export_${dateStr}.csv`;
        downloadBlob(filename, blob);
        setProgress(100);
      } else if (students.length === 1) {
        const s = students[0];
        let blob: Blob;

        if (exportFormat === "pdf") {
          const pdfSettings = {
            pageSize,
            orientation,
            locale,
            includeEmptyFields,
            translations: {
              title: t("pdf.studentData.title"),
              generatedOn: t("pdf.studentData.generatedOn"),
              pageOf: t("pdf.studentData.pageOf"),
            },
          };
          blob = await buildStudentDataPdf(s, pdfSettings);
        } else if (exportFormat === "json") {
          const { buildStudentDataJson } = await import("@/utils/json.utils");
          blob = await buildStudentDataJson(s, {
            includeEmptyFields,
            locale,
          });
        } else {
          const { buildStudentDataCsv } = await import("@/utils/csv.utils");
          blob = await buildStudentDataCsv(s, {
            includeEmptyFields,
            locale,
          });
        }

        const filename = resolveFilename(s, exportFormat);
        downloadBlob(filename, blob);
        setProgress(100);
      } else {
        const files: Array<{ name: string; blob: Blob }> = [];
        let done = 0;

        for (const s of students as StudentType[]) {
          let blob: Blob;

          if (exportFormat === "pdf") {
            const pdfSettings = {
              pageSize,
              orientation,
              locale,
              includeEmptyFields,
              translations: {
                title: t("pdf.studentData.title"),
                generatedOn: t("pdf.studentData.generatedOn"),
                pageOf: t("pdf.studentData.pageOf"),
              },
            };
            blob = await buildStudentDataPdf(s, pdfSettings);
          } else if (exportFormat === "json") {
            const { buildStudentDataJson } = await import("@/utils/json.utils");
            blob = await buildStudentDataJson(s, {
              includeEmptyFields,
              locale,
            });
          } else {
            const { buildStudentDataCsv } = await import("@/utils/csv.utils");
            blob = await buildStudentDataCsv(s, {
              includeEmptyFields,
              locale,
            });
          }

          files.push({ name: resolveFilename(s, exportFormat), blob });
          done += 1;
          setProgress(Math.round((done / students.length) * 95));
        }

        const dateStr = dayjs().format("DD-MM-YYYY");
        const zipBlob = await buildZip(files, (p) =>
          setProgress(95 + Math.round((p || 0) * 0.05)),
        );

        const formatName = exportFormat.toUpperCase();
        downloadBlob(
          `student_data_${formatName}_exports_${dateStr}.zip`,
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
    if (event.key === "Enter" && !event.shiftKey && count && !busy) {
      event.preventDefault();
      handleGenerate();
    }
  };

  const contentChildren = (
    <Fragment>
      {busy && (
        <Box sx={{ px: 3, pb: 1 }}>
          <LinearProgress
            variant={progress == null ? "indeterminate" : "determinate"}
            value={progress ?? 0}
            sx={{ borderRadius: 1 }}
          />
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            {progress == null
              ? t("modals.exportStudentData.creatingZip")
              : t("modals.exportStudentData.progress", {
                  progress: Math.round(progress),
                })}
          </Typography>
        </Box>
      )}

      <StyledContentStack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        divider={<Divider flexItem orientation="vertical" />}
        onKeyDown={handleKeyDown}
      >
        <Stack
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          spacing={2}
        >
          <Stack spacing={1}>
            <StyledOptionLabel>
              {t("modals.exportStudentData.format")}
            </StyledOptionLabel>
            <ToggleButtonGroup
              value={exportFormat}
              exclusive
              onChange={(_, v) => v && setExportFormat(v)}
              size="small"
            >
              <ToggleButton value="pdf">PDF</ToggleButton>
              <ToggleButton value="json">JSON</ToggleButton>
              <ToggleButton value="csv">CSV</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          {exportFormat === "csv" && (
            <Stack spacing={1}>
              <StyledOptionLabel>
                {t("modals.exportStudentData.csvMode")}
              </StyledOptionLabel>
              <ToggleButtonGroup
                value={csvMode}
                exclusive
                onChange={(_, v) => v && setCsvMode(v)}
                size="small"
              >
                <ToggleButton value="separate">
                  {t("modals.exportStudentData.csvModeSeparate")}
                </ToggleButton>
                <ToggleButton value="combined">
                  {t("modals.exportStudentData.csvModeCombined")}
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          )}

          {exportFormat === "pdf" && (
            <>
              <Stack spacing={1}>
                <StyledOptionLabel>
                  {t("modals.exportStudentData.pageSize")}
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
                  {t("modals.exportStudentData.orientation")}
                </StyledOptionLabel>
                <ToggleButtonGroup
                  value={orientation}
                  exclusive
                  onChange={(_, v) => v && setOrientation(v)}
                  size="small"
                >
                  <ToggleButton value="portrait">
                    <CropPortraitRoundedIcon sx={{ mr: 1 }} />
                    {t("modals.exportStudentData.portrait")}
                  </ToggleButton>
                  <ToggleButton value="landscape">
                    <CropLandscapeRoundedIcon sx={{ mr: 1 }} />
                    {t("modals.exportStudentData.landscape")}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </>
          )}

          <Stack>
            <StyledOptionLabel
              sx={{
                mb: 1,
              }}
            >
              {t("modals.exportStudentData.filenameSchema")}
            </StyledOptionLabel>

            <TextField
              value={filenamePattern}
              onChange={(e) => setFilenamePattern(e.target.value)}
              size="small"
              helperText={t("modals.exportStudentData.filenameSchemaExample")}
            />
          </Stack>

          <Stack>
            <StyledOptionLabel
              sx={{
                mb: 1,
              }}
            >
              {t("modals.exportStudentData.options")}
            </StyledOptionLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={includeEmptyFields}
                  onChange={(e) => setIncludeEmptyFields(e.target.checked)}
                />
              }
              label={t("modals.exportStudentData.includeEmptyFields")}
            />
          </Stack>
        </Stack>

        <Box sx={{ flex: 1, width: "50%" }}>
          <StyledHeadline>
            {t("modals.exportStudentData.preview")}
          </StyledHeadline>
          <Paper
            sx={{
              mt: 1,
              borderRadius: 3,
            }}
          >
            <StyledPreviewBox isPortrait={isPortrait}>
              <FileDownloadRoundedIcon
                sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {count}{" "}
                {count === 1 ? t("general.Student") : t("general.Students")}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 2 }}
              >
                {exportFormat.toUpperCase()}
                {exportFormat === "pdf" && (
                  <>
                    {" "}
                    • {pageSize} •{" "}
                    {isPortrait
                      ? t("modals.exportStudentData.portrait")
                      : t("modals.exportStudentData.landscape")}
                  </>
                )}
              </Typography>

              <Box sx={{ width: "100%", mt: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    fontWeight: 600,
                    mb: 1,
                    color: "text.default",
                  }}
                >
                  {t("modals.exportStudentData.sections")}
                </Typography>
                <Stack spacing={0.5}>
                  {[
                    "generalInfo",
                    "origin",
                    "address",
                    "contactPersons",
                    "education",
                    "training",
                    "agreements",
                  ].map((section) => (
                    <Typography
                      key={section}
                      variant="caption"
                      sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                    >
                      ✓ {t(`modals.exportStudentData.${section}`)}
                    </Typography>
                  ))}
                </Stack>
              </Box>

              <Box
                sx={{
                  width: "100%",
                  mt: 3,
                  pt: 2,
                  borderTop: `1px solid ${theme.palette.border.seperator}`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.disabled",
                    fontSize: "0.7rem",
                    wordBreak: "break-all",
                  }}
                >
                  {resolveFilename(sample, exportFormat)}
                </Typography>
              </Box>
            </StyledPreviewBox>
          </Paper>
        </Box>
      </StyledContentStack>
    </Fragment>
  );

  const actionsChildren = (
    <Fragment>
      <GeneralButton
        label={t("general.Cancel")}
        onAction={onClose}
        disabled={busy}
        isPrimary={false}
      />
      <GeneralButton
        label={t(
          count === 1 ||
            (exportFormat === "csv" && csvMode === "combined" && count > 1)
            ? `modals.exportStudentData.download${exportFormat.charAt(0).toUpperCase() + exportFormat.slice(1)}`
            : "modals.exportStudentData.createZip",
        )}
        onAction={handleGenerate}
        disabled={!count || busy}
        startIcon={
          count === 1 ||
          (exportFormat === "csv" && csvMode === "combined" && count > 1) ? (
            <DownloadRoundedIcon />
          ) : (
            <FolderZipRoundedIcon />
          )
        }
      />
    </Fragment>
  );

  return (
    <GeneralModal
      open={open}
      onCloseModal={onClose}
      modalWidth={960}
      customTitle={t("modals.exportStudentData.title")}
      contentChildren={contentChildren}
      actionsChildren={actionsChildren}
    />
  );
};

export default ExportStudentDataModal;
