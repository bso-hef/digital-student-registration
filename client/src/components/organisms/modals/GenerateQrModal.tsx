import React, { Fragment, useState } from "react";

import GeneralButton from "@/components/atoms/buttons/GeneralButton";
import { WIZZARD_URL } from "@/constants/general.constants";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import CropLandscapeRoundedIcon from "@mui/icons-material/CropLandscapeRounded";
import CropPortraitRoundedIcon from "@mui/icons-material/CropPortraitRounded";
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

import GeneralModal from "./GeneralModal";

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

type GenerateQrModalProps = {
  open: boolean;
  onClose: () => void;
  students?: {
    _id: string;
    firstName: string;
    lastName: string;
    className?: string;
    wizardUrl?: string;
  }[];
  onGenerate?: (options: {
    pageSize: "A4" | "A5";
    orientation: "portrait" | "landscape";
    filenamePattern: string;
    includeClass: boolean;
    shortenId: boolean;
  }) => Promise<void>;
  busy: boolean;
  progress: number | null;
  previewIndex?: number;
};

const GenerateQrDialog: React.FC<GenerateQrModalProps> = ({
  open,
  onClose,
  students = [],
  onGenerate,
  busy = false,
  progress = null,
  previewIndex = 0,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [pageSize, setPageSize] = useState<"A4" | "A5">("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait",
  );
  const [filenamePattern, setFilenamePattern] = useState(
    "{nachname}_{vorname}_{klasse}.pdf",
  );
  const [includeClass, setIncludeClass] = useState(true);
  const [shortenId, setShortenId] = useState(true);

  const count = students.length;
  const sample = students[Math.max(0, Math.min(previewIndex, count - 1))] || {
    firstName: "Max",
    lastName: "Muster",
    className: "7B",
    wizardUrl: WIZZARD_URL,
    _id: "671c23e91f4a9a2d7c3e1b45",
  };

  const shortId = sample._id?.slice(0, 8) || "";
  const url = shortenId
    ? (WIZZARD_URL || "").replace("{short-id}", shortId)
    : (WIZZARD_URL || "").replace("{short-id}", sample._id || shortId);

  const isPortrait = orientation === "portrait";

  const handleGenerate = async () => {
    if (onGenerate) {
      await onGenerate({
        pageSize,
        orientation,
        filenamePattern,
        includeClass,
        shortenId,
      });
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
              ? "Erzeuge ZIP…"
              : `Fortschritt: ${Math.round(progress)}%`}
          </Typography>
        </Box>
      )}

      <StyledContentStack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        divider={<Divider flexItem orientation="vertical" />}
      >
        {/* Linke Spalte: Optionen / Zusammenfassung */}
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
            <StyledOptionLabel>Seitenformat</StyledOptionLabel>
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
            <StyledOptionLabel>Ausrichtung</StyledOptionLabel>
            <ToggleButtonGroup
              value={orientation}
              exclusive
              onChange={(_, v) => v && setOrientation(v)}
              size="small"
            >
              <ToggleButton value="portrait">
                <CropPortraitRoundedIcon sx={{ mr: 1 }} />
                Hochformat
              </ToggleButton>
              <ToggleButton value="landscape">
                <CropLandscapeRoundedIcon sx={{ mr: 1 }} />
                Querformat
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Stack>
            <StyledOptionLabel
              sx={{
                mb: 1,
              }}
            >
              Dateinamensschema
            </StyledOptionLabel>

            <TextField
              value={filenamePattern}
              onChange={(e) => setFilenamePattern(e.target.value)}
              size="small"
              helperText="Beispiel: {nachname}_{vorname}_{klasse}.pdf"
            />
          </Stack>

          <Stack>
            <StyledOptionLabel
              sx={{
                mb: 1,
              }}
            >
              Optionen
            </StyledOptionLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={includeClass}
                  onChange={(e) => setIncludeClass(e.target.checked)}
                />
              }
              label="Klasse auf PDF anzeigen"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={shortenId}
                  onChange={(e) => setShortenId(e.target.checked)}
                />
              }
              label="ID im Link kürzen (erste 8 Zeichen)"
            />
          </Stack>
        </Stack>

        {/* Rechte Spalte: Live-Vorschau (Mock) */}
        <Box sx={{ flex: 1, width: "50%" }}>
          <StyledHeadline>Vorschau (Mock):</StyledHeadline>

          <Paper
            sx={{
              mt: 1,
              borderRadius: 3,
            }}
          >
            {/* Simulierte PDF-Seite */}
            <Box
              sx={{
                aspectRatio:
                  orientation === "portrait" ? "1/1.4142" : "1.4142/1",
                borderRadius: 2,
                border: `1px dashed ${theme.palette.border.seperator}`,
                p: 3,
                // display: "grid",
                // gridTemplateRows: "auto 1fr auto",
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
                  <Typography variant="subtitle2">Onboarding-Wizard</Typography>
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "minmax(140px, 220px) 1fr", // linke Spalte fix/klappbar
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
                    {/* QR Platzhalter */}
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        maxWidth: isPortrait ? 180 : 140,
                        maxHeight: isPortrait ? 180 : 140,
                        aspectRatio: "1 / 1",
                        borderRadius: 2,
                        border: `2px dashed ${theme.palette.primary.main}`,
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 700,
                        letterSpacing: 2,
                        userSelect: "none",
                      }}
                    >
                      QR
                    </Box>

                    {/* Textinfos */}
                    <Stack spacing={0.75} sx={{ minWidth: 0 }}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 800, textTransform: "capitalize" }}
                      >
                        {sample.firstName} {sample.lastName}
                      </Typography>
                      {includeClass && (
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          Klasse: <b>{sample.className}</b>
                        </Typography>
                      )}
                      <Typography
                        variant="caption"
                        sx={{ color: "text.disabled" }}
                      >
                        ID: {shortenId ? shortId : sample._id}
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
                    {isPortrait ? "Hochformat" : "Querformat"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {sample?.lastName}_{sample.firstName}
                    {includeClass ? `_${sample.className}` : ""}.pdf
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
        label="ZIP erzeugen"
        onAction={handleGenerate}
        disabled={!count || busy}
        startIcon={<ArchiveRoundedIcon />}
      />
    </Fragment>
  );

  return (
    <GeneralModal
      open={open}
      onCloseModal={onClose}
      modalWidth={960}
      customTitle="QR-PDFs für ausgewählte Schüler erzeugen"
      contentChildren={contentChildren}
      actionsChildren={actionsChildren}
    />
  );
};

export default GenerateQrDialog;
