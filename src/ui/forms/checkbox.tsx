import React, { FC, FocusEventHandler, FormEventHandler } from "react";

import { ComponentStyleProps, greedy, s, size } from "@/common/ui/utils";

import Icon from "../base/icon";
import tick from "../icons/tick";
import { input } from "./input";

interface CheckboxProps extends ComponentStyleProps {
  active?: boolean;
  checked?: boolean;
  disabled?: boolean;
  error?: boolean;
  name: string;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onChange: FormEventHandler<HTMLInputElement>;
  onFocus: FocusEventHandler<HTMLInputElement>;
  type?: "checkbox";
  value: string;
}

const Checkbox: FC<CheckboxProps> = ({
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
  <div
    css={s(
      input({ active, disabled, error }),
      {
        ...size(18),
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        padding: 3,
      },
      _css
    )}
  >
    <Icon
      _css={s({
        ...size("100%"),
        opacity: checked ? 1 : 0,
        transform: checked ? "none" : "scale(0.2)",
        transition: "opacity 500ms, transform ease-out 200ms",
      })}
      path={tick}
    />
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

export default Checkbox;
