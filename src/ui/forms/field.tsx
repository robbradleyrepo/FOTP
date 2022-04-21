import { FieldErrors, Validator } from "@sss/forms";
import { useLocale } from "@sss/i18n";
import React, { FC, PropsWithChildren, ReactNode } from "react";
import { Field as FinalField } from "react-final-form";

import { ComponentStyleProps, s } from "@/common/ui/utils";

import { bodyTextSmall } from "../base/typography";
import { FieldRenderProps } from "./final-form";
import { input } from "./input";
import { select } from "./select";

export interface FieldTransform<FormValueType, InputValueType> {
  format: (value: FormValueType, name: string) => InputValueType;
  parse: (value: InputValueType, name: string) => FormValueType;
}

type FieldProps<FormValueType, InputValueType> = ComponentStyleProps &
  InputFieldProps<FormValueType, InputValueType>;
interface InputFieldProps<FormValueType = string, InputValueType = string> {
  ariaLabel?: string;
  autoComplete?: string;
  busy?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: React.ComponentType<any>;
  inputCss?: ComponentStyleProps["_css"];
  label?: ReactNode;
  labelCss?: ComponentStyleProps["_css"];
  labelWrapperCss?: ComponentStyleProps["_css"];
  max?: number | string;
  min?: number | string;
  name: string;
  disabled?: boolean;
  initialValue?: FormValueType;
  optional?: boolean;
  placeholder?: string;
  transform?: FieldTransform<FormValueType, InputValueType>;
  type?: string;
  validate?: Validator;
}

type InputSwitcherProps = ComponentStyleProps &
  Pick<InputFieldProps, "component" | "type"> & {
    [key: string]: unknown;
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InputSwitcher: FC<InputSwitcherProps> = ({
  _css = {},
  component: Component,
  children,
  ...rest
}) => {
  if (Component) {
    return <Component {...rest} />;
  }

  switch (rest.type) {
    case "select":
      return (
        <select css={s(select(rest), _css)} {...rest}>
          {children}
        </select>
      );
    default:
      return <input css={s(input(rest), _css)} {...rest} />;
  }
};

const enUsResource = {
  optional: "optional",
};

const Field = <
  FormValueType extends unknown = string,
  InputValueType extends string = string
>({
  _css = {},
  label,
  ariaLabel,
  autoComplete,
  busy = false,
  children,
  component: Component,
  disabled = false,
  initialValue,
  inputCss = {},
  labelCss = {},
  labelWrapperCss = {},
  max,
  min,
  name,
  optional = false,
  transform,
  type = "text",
  validate,
  placeholder,
}: PropsWithChildren<FieldProps<FormValueType, InputValueType>>) => {
  // Use a runtime check instead of relying on types as requiring `ariaLabel`
  // or `label` breaks type inference for the `t` function
  if (process.env.NODE_ENV !== "production" && !(ariaLabel || label)) {
    throw new Error("A `Field` must have either a `label` or `ariaLabel`");
  }

  const { i18n, t } = useLocale();
  i18n.addResourceBundle("en-US", "field", enUsResource);

  return (
    <FinalField
      initialValue={initialValue}
      format={transform?.format}
      name={name}
      parse={transform?.parse}
      type={type}
      validate={validate}
    >
      {({
        input,
        meta: {
          active,
          dirtySinceLastSubmit,
          error = [],
          pristine,
          submitError = [],
          submitFailed,
        },
      }: FieldRenderProps) => {
        let visibleErrors: FieldErrors = [];

        // Show client-side errors after a failed submission or once the user
        // has changed the field
        if (submitFailed || (!pristine && !active)) {
          visibleErrors = [...visibleErrors, ...error];
        }

        // Show server-side errors if the value has not changes since the last
        // submission
        if (!dirtySinceLastSubmit) {
          visibleErrors = [...visibleErrors, ...submitError];
        }

        const shouldShowError = !!visibleErrors.length;

        const InputFragment = (
          <InputSwitcher
            _css={inputCss}
            active={active}
            aria-label={ariaLabel}
            autoComplete={autoComplete}
            component={Component}
            disabled={disabled || busy}
            error={shouldShowError}
            max={max}
            min={min}
            placeholder={placeholder}
            {...input}
          >
            {children}
          </InputSwitcher>
        );

        return (
          <div css={s(_css, { textAlign: "left" })}>
            {label ? (
              <label css={s(labelWrapperCss)}>
                <span
                  css={s(
                    bodyTextSmall,
                    (t) => ({
                      color: t.color.text.dark.base,
                      display: "inline-block",
                      fontFamily: t.font.secondary.family,
                      fontSize: 14,
                      fontWeight: 700,
                      marginBottom: t.spacing.xxs,
                    }),
                    labelCss
                  )}
                >
                  {optional ? `${label} (${t("field:optional")})` : label}
                </span>
                {InputFragment}
              </label>
            ) : (
              InputFragment
            )}
            {shouldShowError && (
              <ul
                css={s(bodyTextSmall, (t) => ({
                  color: t.color.text.dark.error,
                  display: "inline-block",
                  fontSize: 14,
                  fontWeight: 600,
                  marginTop: t.spacing.xs,
                }))}
              >
                {visibleErrors.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            )}
          </div>
        );
      }}
    </FinalField>
  );
};

export default Field;

export const formFieldStyle = s((t) => ({
  marginBottom: t.spacing.md,
}));

export const FormField = <
  FormValueType extends unknown = string,
  InputValueType extends string = string
>({
  _css = {},
  children,
  ...rest
}: PropsWithChildren<FieldProps<FormValueType, InputValueType>>) => (
  <Field _css={s(formFieldStyle, _css)} {...rest}>
    {children}
  </Field>
);
