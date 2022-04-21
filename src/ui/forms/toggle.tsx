import React, { FC, FocusEventHandler, FormEventHandler } from "react";

import {
  ComponentStyleProps,
  greedy,
  s,
  size,
  StyleFn,
} from "@/common/ui/utils";

interface ToggleProps extends ComponentStyleProps {
  active?: boolean;
  checked?: boolean;
  disabled?: boolean;
  error?: boolean;
  name?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange: FormEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  type?: "checkbox";
  value?: string;
}

export const toggle = ({
  disabled,
  checked,
  error,
}: Pick<ToggleProps, "active" | "checked" | "disabled" | "error">): StyleFn => (
  t
) => {
  const color = error ? t.color.state.error : t.color.background.dark;

  return {
    "&:before": {
      backgroundColor: checked ? t.color.background.base : color,
      borderRadius: t.radius.xxl,
      content: "''",
      display: "block",
      left: 2,
      ...size(16),
      position: "absolute",
      top: 2,
      transform: checked ? "translateX(16px)" : null,
      transition: "background-color 500ms, transform 500ms",
    },
    backgroundColor: checked ? color : t.color.background.base,
    borderColor: color,
    borderRadius: t.radius.xxl,
    borderStyle: "solid",
    borderWidth: 1,
    height: 22,
    opacity: disabled ? 0.3 : 1,
    position: "relative",
    transition: "background-color 500ms, opacity 500ms",
    width: 38,
  };
};

const Toggle: FC<ToggleProps> = ({
  _css = {},
  active,
  checked,
  disabled,
  error,
  name,
  onBlur,
  onChange,
  onFocus,
  type = "checkbox",
  value,
}) => (
  <div css={s(toggle({ active, checked, disabled, error }), _css)}>
    <input
      css={s(greedy, { opacity: 0, outline: "none" })}
      checked={checked}
      disabled={disabled}
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      type={type}
      value={value}
    />
  </div>
);

export default Toggle;
