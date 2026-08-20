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

const HeaderText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.default,
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.default,
}));

const FieldDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.information,
}));

interface FieldConfigItem {
  name: string;
  label: string;
  description?: string;
  config: FieldConfig;
  allowCustom?: boolean;
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
                <HeaderText>{t("settings.onboarding.table.field")}</HeaderText>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={t("settings.onboarding.table.requiredTooltip")}>
                  <HeaderText>
                    {t("settings.onboarding.table.required")}
                  </HeaderText>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={t("settings.onboarding.table.visibleTooltip")}>
                  <HeaderText>
                    {t("settings.onboarding.table.visible")}
                  </HeaderText>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <Tooltip
                  title={t("settings.onboarding.table.allowCustomTooltip")}
                >
                  <HeaderText>
                    {t("settings.onboarding.table.allowCustom")}
                  </HeaderText>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.name} hover>
                <TableCell>
                  <Box>
                    <FieldLabel variant="body2">{field.label}</FieldLabel>
                    {field.description && (
                      <FieldDescription variant="caption">
                        {field.description}
                      </FieldDescription>
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
                  {field.allowCustom === false ? (
                    <Typography aria-hidden="true">—</Typography>
                  ) : (
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
                  )}
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
