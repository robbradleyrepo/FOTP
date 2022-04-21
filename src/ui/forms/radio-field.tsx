import React, { ReactNode } from "react";
import { Field as FinalField } from "react-final-form";

import { ComponentStyleProps, s } from "@/common/ui/utils";

import type { FieldTransform } from "./field";
import Radio from "./radio";

type RadioFieldProps<
  FormValueType = string,
  InputValueType = string
> = ComponentStyleProps & {
  align?: "baseline" | "center";
  busy?: boolean;
  disabled?: boolean;
  inputCss?: ComponentStyleProps["_css"];
  label?: ReactNode;
  labelCss?: ComponentStyleProps["_css"];
  name: string;
  transform?: FieldTransform<FormValueType, InputValueType>;
  value: FormValueType;
};

const RadioField = <
  FormValueType extends unknown = string,
  InputValueType extends string = string
>({
  _css = {},
  align = "baseline",
  busy = false,
  disabled = false,
  inputCss = {},
  label,
  labelCss = {},
  name,
  transform,
  value,
}: RadioFieldProps<FormValueType, InputValueType>) => (
  <FinalField
    // The Final Form types don't match the actual radio field behaviour
    format={transform?.format as any} // eslint-disable-line @typescript-eslint/no-explicit-any
    name={name}
    parse={transform?.parse as any} // eslint-disable-line @typescript-eslint/no-explicit-any
    type="radio"
    value={value}
  >
    {({ input, meta: { active } }) => (
      <label
        css={s(
          {
            alignItems: align,
            display: "flex",
            opacity: disabled || busy ? 0.5 : 1,
            textAlign: "left",
            transition: "opacity 300ms",
          },
          _css
        )}
      >
        <Radio
          _css={s(
            (t) => ({
              flexShrink: 0,
              marginRight: t.spacing.sm,
              position: "relative",
              top: align === "baseline" ? 4 : null,
            }),
            inputCss
          )}
          // The Final Form types don't match the actual radio field behaviour
          {...(input as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
          active={active}
          disabled={disabled || busy}
          name={name}
          type="radio"
        />
        <div css={s({ flexGrow: 1 }, labelCss)}>{label}</div>
      </label>
    )}
  </FinalField>
);

export default RadioField;
