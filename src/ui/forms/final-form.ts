import { FieldErrors, FormErrors } from "@sss/forms";
import {
  FieldInputProps,
  FieldMetaState,
  FormProps as FinalFormProps,
  FormRenderProps as FinalFormRenderProps,
} from "react-final-form";

export interface FieldRenderProps<
  FieldValue = string,
  T extends HTMLElement = HTMLElement
> {
  input: FieldInputProps<FieldValue, T>;
  meta: Omit<FieldMetaState<FieldValue>, "error" | "submitError"> & {
    error?: FieldErrors;
    submitError?: FieldErrors;
  };
}

export type FormProps = Omit<FinalFormProps, "onSubmit"> & {
  onSubmit: (
    ...args: Parameters<FinalFormProps["onSubmit"]>
  ) => Promise<FormErrors | undefined | void> | FormErrors | undefined | void;
};

export type FormRenderProps = Omit<
  FinalFormRenderProps,
  "error" | "errors" | "submitError" | "submitErrors"
> & {
  error?: FieldErrors;
  errors?: FormErrors;
  submitError?: FieldErrors;
  submitErrors?: FormErrors;
};
