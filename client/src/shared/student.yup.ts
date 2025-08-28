import * as yup from "yup";

export const createTodoSchema = yup.object({
  title: yup.string().trim().min(1).max(100).required(),
});

export const listTodoQuerySchema = yup.object({
  // falls du Query-Parameter validieren willst
});
