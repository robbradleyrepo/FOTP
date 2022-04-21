import { UserError } from "@sss/ecommerce/common";
import { FORM_ERROR } from "final-form";

import { FormErrors } from "./types";

export interface ErrorMap {
  [key: string]: ErrorMap | string;
}

const findErrorKey = (
  field: string[] | null,
  errorMap: ErrorMap
): string | undefined => {
  if (field === null) {
    return FORM_ERROR;
  }

  const [first, ...rest] = field;
  const branch = errorMap[first];

  if (branch) {
    return typeof branch === "string" ? branch : findErrorKey(rest, branch);
  }
};

export const getUserErrorsMapper = (errorMap: ErrorMap) => (
  userErrors: UserError[]
) => {
  const errors: FormErrors = {};
  const unmappedErrors: UserError[] = [];

  userErrors.forEach((error: UserError) => {
    const { field, message } = error;
    const key = findErrorKey(field, errorMap);

    if (!key) {
      unmappedErrors.push(error);

      return;
    }

    const currentMessages = errors[key] || [];

    errors[key] = [...currentMessages, message];
  });

  if (unmappedErrors.length) {
    throw new Error(
      `Customer user errors contained unmapped fields:\n  ${unmappedErrors.map(
        (error) => `${JSON.stringify(error)}\n`
      )}`
    );
  }

  return errors;
};
