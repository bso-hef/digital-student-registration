import { TABLE_ALIGN } from "@/constants/ui.constants";
import { TFunction } from "i18next";

export const classTableHeaders = (t: TFunction) => [
  {
    id: "name",
    align: TABLE_ALIGN.LEFT,
    numeric: false,
    disablePadding: false,
    sortable: true,
    clickable: true,
    label: t("settings.manageClass.className"),
  },
  {
    id: "schoolYear",
    align: TABLE_ALIGN.LEFT,
    numeric: false,
    disablePadding: false,
    sortable: true,
    label: t("settings.manageClass.schoolYear"),
  },
  {
    id: "grade",
    align: TABLE_ALIGN.LEFT,
    numeric: true,
    disablePadding: false,
    sortable: true,
    label: t("settings.manageClass.grade"),
  },
  {
    id: "studentCount",
    align: TABLE_ALIGN.LEFT,
    numeric: true,
    disablePadding: false,
    sortable: true,
    label: t("settings.manageClass.numberOfStudents"),
  },
  {
    id: "isVocational",
    align: TABLE_ALIGN.LEFT,
    numeric: false,
    disablePadding: false,
    sortable: false,
    label: t("settings.manageClass.companyClass"),
  },
  {
    id: "status",
    align: TABLE_ALIGN.RIGHT,
    numeric: false,
    disablePadding: false,
    sortable: true,
    label: t("settings.manageClass.isClassActive"),
  },
];

export const mockClassesTableData = [
  {
    id: 1,
    name: "LF101",
    studentCount: 25,
  },
  {
    id: 2,
    name: "LF102",
    studentCount: 30,
  },
  {
    id: 3,
    name: "LF103",
    studentCount: 28,
  },
];
