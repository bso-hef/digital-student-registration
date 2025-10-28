import React from "react";

import { FieldConfig } from "@/types/settings";
import {
  Box,
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const Container = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
}));

interface FieldConfigItem {
  name: string;
  label: string;
  description?: string;
  config: FieldConfig;
}

interface FieldConfigurationPanelProps {
  fields: FieldConfigItem[];
  onChange: (fieldName: string, config: FieldConfig) => void;
}

const FieldConfigurationPanel: React.FC<FieldConfigurationPanelProps> = ({
  fields,
  onChange,
}) => {
  const { t } = useTranslation();

  const handleToggle = (
    fieldName: string,
    config: FieldConfig,
    property: keyof FieldConfig,
  ) => {
    onChange(fieldName, {
      ...config,
      [property]: !config[property],
    });
  };

  return (
    <Container elevation={0}>
      <StyledTableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>{t("settings.onboarding.table.field")}</strong>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={t("settings.onboarding.table.requiredTooltip")}>
                  <strong>{t("settings.onboarding.table.required")}</strong>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={t("settings.onboarding.table.visibleTooltip")}>
                  <strong>{t("settings.onboarding.table.visible")}</strong>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <Tooltip
                  title={t("settings.onboarding.table.allowCustomTooltip")}
                >
                  <strong>{t("settings.onboarding.table.allowCustom")}</strong>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.name} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {field.label}
                    </Typography>
                    {field.description && (
                      <Typography variant="caption" color="text.secondary">
                        {field.description}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field?.config?.required}
                        onChange={() =>
                          handleToggle(field?.name, field?.config, "required")
                        }
                        size="small"
                        disabled={!field?.config?.visible}
                      />
                    }
                    label=""
                  />
                </TableCell>
                <TableCell align="center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field?.config?.visible}
                        onChange={() =>
                          handleToggle(field?.name, field?.config, "visible")
                        }
                        size="small"
                      />
                    }
                    label=""
                  />
                </TableCell>
                <TableCell align="center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field?.config?.allowCustom}
                        onChange={() =>
                          handleToggle(
                            field?.name,
                            field?.config,
                            "allowCustom",
                          )
                        }
                        size="small"
                        disabled={!field?.config?.visible}
                      />
                    }
                    label=""
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Container>
  );
};

export default FieldConfigurationPanel;
