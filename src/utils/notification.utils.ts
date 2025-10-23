import { toast } from "sonner";

export const successNotification = (
  message: string,
  duration: number = 5000,
) => {
  toast.success(message, { duration });
};

export const errorNotification = (message: string, duration: number = 5000) => {
  toast.error(message, { duration });
};

export const infoNotification = (message: string, duration: number = 5000) => {
  toast.info(message, { duration });
};

export const warningNotification = (
  message: string,
  duration: number = 5000,
) => {
  toast.warning(message, { duration });
};

export const loadingNotification = (
  message: string,
  duration: number = 5000,
) => {
  toast.loading(message, { duration });
};

export const defaultNotification = (
  message: string,
  duration: number = 5000,
) => {
  toast(message, { duration });
};
