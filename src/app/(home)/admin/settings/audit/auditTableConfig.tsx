import AuditStatus from "@/components/atoms/status/AuditStatus";
import { TABLE_ALIGN } from "@/constants/ui.constants";
import { Chip } from "@mui/material";
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
    id: "description",
    align: TABLE_ALIGN.LEFT,
    numeric: false,
    disablePadding: false,
    sortable: false,
    label: t("audit.description"),
  },
  {
    id: "userName",
    align: TABLE_ALIGN.LEFT,
    numeric: false,
    disablePadding: false,
    sortable: true,
    label: t("audit.user"),
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

export const formatAuditTableData = (logs: AuditLogEntry[]) => {
  return logs.map((log) => ({
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
    action: log.action,
    description: log.description,
    userName: log.userName,
    status: (
      <AuditStatus status={log.status as "success" | "failure" | "partial"} />
    ),
  }));
};
