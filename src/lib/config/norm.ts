export const deburr = (s: string) =>
  s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");

export const norm = (s: string) =>
  deburr(
    String(s || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " "),
  );

export const isISODate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

export const isoDateToUTC = (s: string) => new Date(`${s}T00:00:00.000Z`);
