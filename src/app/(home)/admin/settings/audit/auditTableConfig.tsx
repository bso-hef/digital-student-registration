import ActionsTooltip from "@/components/atoms/ActionsTooltip";
import AuditStatus from "@/components/atoms/status/AuditStatus";
import { TABLE_ALIGN } from "@/constants/ui.constants";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Chip } from "@mui/material";
import dayjs from "dayjs";
import { TFunction } from "i18next";

import { AuditLogEntry } from "@/store/reducers/auditLog";

export const auditTableHeaders = (t: TFunction) => [
  {
    id: "timestamp",
    align: TABLE_ALIGN.LEFT,
    numeric: false,
    disablePadding: false,
    sortable: true,
    label: t("audit.timestamp"),
  },
  {
    id: "category",
    align: TABLE_ALIGN.LEFT,
    numeric: false,
    disablePadding: false,
    sortable: true,
    label: t("audit.categoryLabel"),
  },
  {
    id: "action",
    align: TABLE_ALIGN.LEFT,
    numeric: false,
    disablePadding: false,
    sortable: true,
    label: t("audit.action"),
  },
  {
    id: "status",
    align: TABLE_ALIGN.RIGHT,
    numeric: false,
    disablePadding: false,
    sortable: true,
    label: t("audit.statusLabel"),
  },
];

const getActionColor = (
  action: string,
): "primary" | "success" | "error" | "warning" | "info" | "default" => {
  if (action.includes("create")) return "success";
  if (action.includes("delete") || action.includes("clear")) return "error";
  if (action.includes("update") || action.includes("change")) return "info";
  return "default";
};

/**
 * Gets the display description for a log entry.
 * Handles both translated descriptions and raw translation keys (legacy entries).
 */
const getDisplayDescription = (
  description: string | undefined,
  t: TFunction,
): string | undefined => {
  if (!description) return undefined;

  // Check if description is a raw translation key (legacy entries)
  if (description.startsWith("audit.descriptions.")) {
    const translated = t(description);
    // Return translated value if found, otherwise the original description
    return translated !== description ? translated : description;
  }

  return description;
};

export const formatAuditTableData = (logs: AuditLogEntry[], t: TFunction) => {
  return logs.map((log) => {
    // Get translated action label, fallback to raw action if translation not found
    const translationKey = `audit.actions.${log.action}`;
    const translatedAction = t(translationKey);
    const displayAction =
      translatedAction !== translationKey ? translatedAction : log.action;

    // Get display description with translation fallback for legacy entries
    const displayDescription = getDisplayDescription(log.description, t);

    return {
      id: log._id,
      timestamp: dayjs(log.timestamp).format("DD.MM.YYYY HH:mm:ss"),
      category: (
        <Chip
          label={log.category}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
      action: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Chip
            label={displayAction}
            size="small"
            color={getActionColor(log.action)}
            variant="outlined"
          />
          {displayDescription && (
            <ActionsTooltip title={displayDescription} placement="top">
              <InfoOutlinedIcon
                sx={{
                  color: "text.secondary",
                  cursor: "pointer",
                  fontSize: 18,
                }}
              />
            </ActionsTooltip>
          )}
        </Box>
      ),
      status: (
        <AuditStatus status={log.status as "success" | "failure" | "partial"} />
      ),
    };
  });
};
