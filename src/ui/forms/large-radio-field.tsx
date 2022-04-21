import { rgba } from "polished";
import React, { FC } from "react";
import { Field } from "react-final-form";

import { ComponentStyleProps, s } from "@/common/ui/utils";

interface LargeRadioFieldProps extends ComponentStyleProps {
  busy?: boolean;
  disabled?: boolean;
  inputCss?: ComponentStyleProps["_css"];
  name: string;
  value: string;
}

const LargeRadioField: FC<LargeRadioFieldProps> = ({
  _css = {},
  busy,
  disabled,
  children,
  inputCss = {},
  name,
  value,
}) => (
  <Field name={name} type="radio" value={value}>
    {({ input, meta }) => (
      <label
        css={s(
          (t) => ({
            "&::hover": {
              borderColor: t.color.background.light,
            },
            alignItems: "center",
            backgroundColor: input.checked ? t.color.background.feature1 : null,
            borderRadius: t.radius.sm,
            boxShadow: `inset 0 0 0 1px ${t.color.border.light}`,
            display: "flex",
            opacity: disabled || busy ? 0.5 : 1,
            padding: t.spacing.sm,
            position: "relative",
            transition:
              "background-color 300ms, border-color 300ms, box-shadow 300ms",
          }),
          _css
        )}
      >
        <input
          css={s(
            {
              height: 0,
              opacity: 0,
              position: "absolute",
              width: 0,
            },
            inputCss
          )}
          disabled={disabled || busy}
          {...input}
        />
        {children}
        <div
          css={s((t) => ({
            borderRadius: "inherit",
            bottom: 0,
            boxShadow: input.checked
              ? `${
                  meta.active
                    ? `${rgba(t.color.background.light, 0.3)} 0 0 6px, `
                    : ""
                }inset ${t.color.background.light} 0 0 0 1px`
              : null,
            height: "100%",
            left: 0,
            position: "absolute",
            right: 0,
            top: 0,
            width: "100%",
          }))}
        />
      </label>
    )}
  </Field>
);

export default LargeRadioField;
