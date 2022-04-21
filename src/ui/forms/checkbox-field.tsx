import React, { ReactNode } from "react";
import { Field as FinalField } from "react-final-form";

import { ComponentStyleProps, s } from "@/common/ui/utils";

import Checkbox from "./checkbox";
import type { FieldTransform } from "./field";

type CheckboxFieldProps<
  FormValueType,
  InputValueType extends boolean | string
> = ComponentStyleProps & {
  busy?: boolean;
  disabled?: boolean;
  inputCss?: ComponentStyleProps["_css"];
  label?: ReactNode;
  labelCss?: ComponentStyleProps["_css"];
  name: string;
} & (InputValueType extends string
    ? {
        transform?: FieldTransform<FormValueType, InputValueType[]>;
        value: string;
      }
    : {
        transform?: FieldTransform<FormValueType, boolean>;
      });

const CheckboxField = <
  FormValueType,
  InputValueType extends boolean | string = boolean
>({
  _css = {},
  busy = false,
  disabled = false,
  inputCss = {},
  label,
  labelCss = {},
  name,
  transform,
  ...rest
}: CheckboxFieldProps<FormValueType, InputValueType>) => (
  <FinalField
    // The Final Form types don't match the actual checkbox field behaviour
    format={transform?.format as any} // eslint-disable-line @typescript-eslint/no-explicit-any
    name={name}
    parse={transform?.parse as any} // eslint-disable-line @typescript-eslint/no-explicit-any
    type="checkbox"
    {...rest}
  >
    {({ input, meta: { active } }) => (
      <label
        css={s(
          {
            alignItems: "baseline",
            display: "flex",
            opacity: disabled || busy ? 0.5 : 1,
            textAlign: "left",
            transition: "opacity 300ms",
          },
          _css
        )}
      >
        <Checkbox
          _css={s(
            (t) => ({
              flexShrink: 0,
              marginRight: t.spacing.sm,
              position: "relative",
            }),
            inputCss
          )}
          {...input}
          active={active}
          disabled={disabled || busy}
          name={name}
          type="checkbox"
        />
        <div css={s({ flexGrow: 1 }, labelCss)}>{label}</div>
      </label>
    )}
  </FinalField>
);

export default CheckboxField;
