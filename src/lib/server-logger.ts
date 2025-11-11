import { COLORS } from "@/constants/general.constants";
import winston from "winston";

export const hexToAnsi = (hex: string) => {
  if (!/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex)) {
    throw new Error("Invalid hex color format. Use #RRGGBB or #RGB.");
  }

  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `\x1b[38;2;${r};${g};${b}m`;
};

const dateFormat = () => {
  const now = new Date();

  return now.toLocaleString("en", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const levelColors: Record<"info" | "error" | "debug" | "warn", string> = {
  info: hexToAnsi(COLORS.INFO),
  error: hexToAnsi(COLORS.ERROR),
  debug: hexToAnsi(COLORS.WARNING),
  warn: hexToAnsi(COLORS.WARNING),
};

const resetColor = "\x1b[0m";

class Logger {
  private log_data: unknown;
  private route: string;
  private logger: winston.Logger;

  constructor(route: string) {
    this.log_data = null;
    this.route = route;

    // Check if we're in edge runtime (no process.version in edge)
    const isEdgeRuntime = typeof process === "undefined" || !process.version;

    // In edge runtime, only use Console transport
    // In Node.js runtime, use both Console and File transports
    const transports: winston.transport[] = [new winston.transports.Console()];

    if (!isEdgeRuntime) {
      transports.push(
        new winston.transports.File({
          filename: `./logs/server-logs/${route}.log`,
        }),
      );
    }

    const logger = winston.createLogger({
      transports,
      format: winston.format.printf((info) => {
        const color = levelColors[info.level as keyof typeof levelColors] || "";
        const level = `${color}${info.level.toUpperCase()}${resetColor}`;
        let message = `${dateFormat()} | ${level} | ${route}.log | ${info.message} | `;
        message = info.obj
          ? message + `data:${JSON.stringify(info.obj)} | `
          : message;
        message = this.log_data
          ? message + `log_data:${JSON.stringify(this.log_data)} | `
          : message;
        return message;
      }),
    });
    this.logger = logger;
  }

  setLogData(log_data: unknown) {
    this.log_data = log_data;
  }

  async info(message: string, obj?: unknown) {
    this.logger.log("info", message, obj ? { obj } : undefined);
  }

  async debug(message: string, obj?: unknown) {
    this.logger.log("debug", message, obj ? { obj } : undefined);
  }

  async warn(message: string, obj?: unknown) {
    this.logger.log("warn", message, obj ? { obj } : undefined);
  }

  async error(message: string, obj?: unknown) {
    this.logger.log("error", message, obj ? { obj } : undefined);
  }
}

export default Logger;
