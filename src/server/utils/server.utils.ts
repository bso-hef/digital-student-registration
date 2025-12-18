import Logger from "@/lib/server-logger";

const logger = new Logger("Utils <<<===>>> Server");

type HeaderValue = string | string[] | undefined;

export type MinimalRequest = {
  headers: Record<string, HeaderValue> & {
    authorization?: HeaderValue;
    "x-access-token"?: HeaderValue;
    "cf-ipcountry"?: HeaderValue;
    "user-agent"?: HeaderValue;
    "x-forwarded-for"?: HeaderValue;
  };
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
};

type HttpResponder = {
  status: (code: number) => { json: (body: unknown) => void };
};

export const getHyphenatedString = (str: string): string =>
  str
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

export const getBrowserInfo = (req: MinimalRequest): string | undefined => {
  const ua = req.headers["user-agent"];
  return Array.isArray(ua) ? ua[0] : ua;
};

export const buildErrObject = (code: number, message: string) => ({
  code,
  message,
});

export const buildSuccObject = (message: string) => ({ msg: message });

export const isIDGood = (id: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const goodID = String(id).match(/^[0-9a-fA-F]{24}$/);
    return goodID ? resolve(id) : reject(buildErrObject(422, "ID_MALFORMED"));
  });

export const encodeBase64 = (str = "string"): string =>
  Buffer.from(str).toString("base64");

export const itemNotFound = <T>(
  err: unknown,
  item: T | null | undefined,
  reject: (reason?: unknown) => never,
  message = "NOT_FOUND",
): void => {
  if (err instanceof Error) {
    reject(buildErrObject(422, err.message));
  }
  if (!item) {
    reject(buildErrObject(404, message));
  }
};

export const handleError = (
  res: HttpResponder,
  err?: { code?: number; message?: string },
) => {
  if (process.env.NODE_ENV === "development") {
    logger.error("Error occured:", err);
  }

  const code: number | string = err?.code ?? 500;
  const message = err?.message ?? "error";

  res.status(Number(code)).json({ errors: { msg: message } });
};

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
