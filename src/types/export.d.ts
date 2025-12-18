export type ExportFormat = "pdf" | "json" | "csv";

export type ExportSettings = {
  includeEmptyFields?: boolean;
  locale?: string;
};

export type PdfExportSettings = ExportSettings & {
  pageSize: "A4" | "A5";
  orientation: "portrait" | "landscape";
  translations?: {
    title: string;
    generatedOn: string;
    pageOf: string;
  };
};
