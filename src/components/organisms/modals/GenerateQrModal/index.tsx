import React, { Fragment, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import { WIZZARD_URL } from "@/constants/general.constants";
import { downloadBlob } from "@/utils/general.utils";
import { buildPdfForStudent } from "@/utils/pdf.utils";
import { sanitizeFilename } from "@/utils/string.utils";
import { buildZip } from "@/utils/zip.utils";
import CropLandscapeRoundedIcon from "@mui/icons-material/CropLandscapeRounded";
import CropPortraitRoundedIcon from "@mui/icons-material/CropPortraitRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FolderZipRoundedIcon from "@mui/icons-material/FolderZipRounded";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
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
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

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
};

const GenerateQrDialog: React.FC<GenerateQrModalProps> = ({
  open,
  onClose,
  students,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const locale = useSelector((state: any) => state.ui.locale) || "en";

  const [pageSize, setPageSize] = useState<"A4" | "A5">("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait",
  );
  const [filenamePattern, setFilenamePattern] = useState(
    "{nachname}_{vorname}_{klasse}.pdf",
  );
  const [includeClass, setIncludeClass] = useState(true);
  const [shortenId, setShortenId] = useState(true);

  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

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

  const generateExport = async () => {
    if (!students?.length) return;

    setBusy(true);
    setProgress(0);

    try {
      if (students.length === 1) {
        const s = students[0];
        const pdf = await buildPdfForStudent(s, {
          pageSize,
          orientation,
          includeClass,
          shortenId,
          wizardUrlTemplate: WIZZARD_URL,
          locale,
        });
        const filename = resolveFilename(s);
        downloadBlob(filename, pdf);
        setProgress(100);
      } else {
        const files: Array<{ name: string; blob: Blob }> = [];
        let done = 0;

        for (const s of students as Student[]) {
          const pdf = await buildPdfForStudent(s, {
            pageSize,
            orientation,
            includeClass,
            shortenId,
            wizardUrlTemplate: WIZZARD_URL,
            locale,
          });
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
              ? t("modals.generateQrModal.creatingZip")
              : t("modals.generateQrModal.progress", {
                  progress: Math.round(progress),
                })}
          </Typography>
        </Box>
      )}

      <StyledContentStack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        divider={<Divider flexItem orientation="vertical" />}
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
              helperText={t("modals.generateQrModal.filenameSchemaExample")}
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
          </Stack>
        </Stack>

        <Box sx={{ flex: 1, width: "50%" }}>
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
                p: 3,
                gap: 2,
                bgcolor: theme.palette.surface.interface.background,
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateRows: "auto 1fr auto",
                  gap: 2,
                  height: "100%",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <QrCode2RoundedIcon />
                  <Typography variant="subtitle2">
                    {t("modals.generateQrModal.onboardingWizard")}
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "minmax(140px, 220px) 1fr",
                    },
                    alignItems: "start",
                    gap: 2,
                    minHeight: 0,
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems="stretch"
                    sx={{ minHeight: 0 }}
                  >
                    <StyledQRPreviewBox isPortrait={isPortrait}>
                      QR
                    </StyledQRPreviewBox>

                    <Stack spacing={0.75} sx={{ minWidth: 0 }}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 800, textTransform: "capitalize" }}
                      >
                        {sample.firstName} {sample.lastName}
                      </Typography>
                      {includeClass && getClassName(sample) && (
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {t("modals.generateQrModal.class")}{" "}
                          <b>{getClassName(sample)}</b>
                        </Typography>
                      )}
                      {sample.verificationCode && (
                        <Typography
                          variant="body1"
                          sx={{ color: "text.primary", fontWeight: 700 }}
                        >
                          {t("modals.generateQrModal.verificationCode")}{" "}
                          <b>{sample.verificationCode}</b>
                        </Typography>
                      )}
                      <Typography
                        variant="caption"
                        sx={{ color: "text.disabled", fontSize: "0.7rem" }}
                      >
                        {t("modals.generateQrModal.id")}{" "}
                        {shortenId
                          ? (sample._id || "").slice(0, 8)
                          : sample._id}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ pt: 1 }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {pageSize?.toUpperCase()} •{" "}
                    {isPortrait
                      ? t("modals.generateQrModal.portrait")
                      : t("modals.generateQrModal.landscape")}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
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
          count === 1
            ? "modals.generateQrModal.downloadPdf"
            : "modals.generateQrModal.createZip",
        )}
        onAction={handleGenerate}
        disabled={!count || busy}
        startIcon={
          count === 1 ? <DownloadRoundedIcon /> : <FolderZipRoundedIcon />
        }
      />
    </Fragment>
  );

  return (
    <GeneralModal
      open={open}
      onCloseModal={onClose}
      modalWidth={960}
      customTitle={t("modals.generateQrModal.title")}
      contentChildren={contentChildren}
      actionsChildren={actionsChildren}
    />
  );
};

export default GenerateQrDialog;
