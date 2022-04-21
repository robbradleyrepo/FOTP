import { AnyObject } from "final-form";
import { ReactNode } from "react";

export type FieldErrors = ReactNode[];

export type FormErrors = Record<string, FieldErrors>;

export type Validator = (
  value: unknown,
  values: AnyObject
) => FieldErrors | undefined;
