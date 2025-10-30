import { TABLE_ALIGN } from "@/constants/ui.constants";
import { TFunction } from "i18next";

export const manageTableHeaders = (t: TFunction) => [
  {
    id: "firstName",
    align: TABLE_ALIGN.LEFT,
    numeric: false,
    disablePadding: false,
    sortable: true,
    label: t("settings.manageClass.student.firstName"),
  },
  {
    id: "lastName",
    align: TABLE_ALIGN.LEFT,
    numeric: false,
    sortable: true,
    disablePadding: false,
    label: t("settings.manageClass.student.lastName"),
  },
  {
    id: "dateOfBirth",
    align: TABLE_ALIGN.LEFT,
    numeric: false,
    disablePadding: false,
    label: t("settings.manageClass.student.dateOfBirth"),
  },
  {
    id: "gender",
    align: TABLE_ALIGN.LEFT,
    numeric: false,
    disablePadding: false,
    label: t("settings.manageClass.student.gender"),
  },
  {
    id: "status",
    align: TABLE_ALIGN.RIGHT,
    numeric: false,
    disablePadding: false,
    label: t("settings.manageClass.student.status"),
  },
];
