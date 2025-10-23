export interface AppError {
  message: string;
  statusCode?: number;
  details?: unknown;
}
