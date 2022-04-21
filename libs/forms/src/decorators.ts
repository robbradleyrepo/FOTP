import { captureDetailedException } from "@sss/sentry";
import { AnyObject, FORM_ERROR } from "final-form";

import { FieldErrors } from "./types";

export const withUnhandledError = (
  fn: (formData: AnyObject) => Promise<Record<string, FieldErrors> | undefined>,
  message: string
) => async (formData: AnyObject) => {
  try {
    return await fn(formData);
  } catch (err) {
    captureDetailedException(new Error("Unhandled form submit error"), {
      ...formData,
    });

    return { [FORM_ERROR]: [message] };
  }
};
