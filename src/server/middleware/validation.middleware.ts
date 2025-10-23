import type { NextRequest } from "next/server";
import type { AnyObjectSchema, InferType, ValidationError } from "yup";

export type ValidationSuccess<T> = { ok: true; data: T };
export type ValidationFailure = { ok: false; res: Response };
export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export function validateJsonBody<TSchema extends AnyObjectSchema>(
  schema: TSchema,
) {
  return async function validate(
    req: Pick<Request | NextRequest, "json">,
  ): Promise<ValidationResult<InferType<TSchema>>> {
    try {
      const body = await req.json();
      const data = (await schema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      })) as InferType<TSchema>;
      return { ok: true, data };
    } catch (e) {
      const err = e as ValidationError;

      const details =
        Array.isArray(err.inner) && err.inner.length > 0
          ? err.inner.map(({ path, message }) => ({
              path: path ?? "",
              message,
            }))
          : [{ path: err.path ?? "", message: err.message }];

      return {
        ok: false,
        res: new Response(JSON.stringify({ errors: details }), {
          status: 400,
          headers: { "content-type": "application/json" },
        }),
      };
    }
  };
}
