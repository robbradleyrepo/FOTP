import { StripeElementChangeEvent } from "@stripe/stripe-js";
import emailValidator from "email-validator";

import { FieldErrors, Validator } from "./types";

const isString = (message: unknown): message is string =>
  typeof message === "string";

export const optional = (validator: Validator): Validator => (
  value,
  values
) => {
  if (!isString(value) || !value.trim()) {
    return;
  }
  return validator(value, values);
};

export const validateEmail = (message: string): Validator => (value) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isString(value) && (emailValidator as any).validate(value)
    ? undefined
    : [message];

export const validateMatch = (message: string, field: string): Validator => (
  value,
  values
) => {
  return value === values[field] ? undefined : [message];
};

export const validatePassword = (message: string): Validator => (value) =>
  isString(value) && value.length >= 5 && value.length <= 40
    ? undefined
    : [message];

export const validateRequired = (message: string): Validator => (value) => {
  if (isString(value) && !value.trim()) {
    return [message];
  }
  return value ? undefined : [message];
};

export const validateStripe = (): Validator => (value: unknown) => {
  const stripeValue = value as StripeElementChangeEvent;
  if (stripeValue?.error?.message) {
    return [stripeValue.error.message];
  }
};

// https://www.regexpal.com/93671 with some tweaks for spaceless numbers
const US_PHONE_FORMAT = /^[(]?\d{3}[)]?[(\s)?.-]?\d{3}[\s.-]?\d{4}$/;

export const validateUSPhoneNumber = (message: string): Validator => (value) =>
  !isString(value) || value.match(US_PHONE_FORMAT) ? undefined : [message];

export const composeValidators = (...validators: Validator[]): Validator => (
  value,
  values
) => {
  const messages = validators
    .map((validator) => validator(value, values))
    .reduce<FieldErrors>(
      (accum, messages) => [...accum, ...(messages ?? [])],
      []
    );

  if (messages.length > 0) {
    return messages;
  }
};
