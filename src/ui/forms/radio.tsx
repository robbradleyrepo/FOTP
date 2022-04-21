import React, { FC } from "react";

import { ComponentStyleProps, s, size } from "@/common/ui/utils";

interface RadioProps extends ComponentStyleProps {
  active?: boolean;
  checked?: boolean;
  disabled?: boolean;
  error?: boolean;
  name: string;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  onChange: React.FormEventHandler<HTMLInputElement>;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  type?: "radio";
  value: string;
}

const Radio: FC<RadioProps> = ({
  _css = {},
  active,
  checked,
  disabled,
  name,
  onBlur,
  onChange,
  onFocus,
  type = "radio",
  value,
}) => (
  <div
    css={s(
      (t) => ({
        "&:after": {
          backgroundColor: checked ? "currentColor" : "transparent",
          borderRadius: t.radius.xxl,
          bottom: 0,
          content: "''",
          display: "block",
          left: 0,
          position: "absolute",
          right: 0,
          top: 0,
          transform: `scale(${checked ? 0.6 : 0.3})`,
          transition:
            "background 300ms, box-shadow 300ms, transform 600ms cubic-bezier(0.5, 1.5, 0.6, 0.85)",
          zIndex: -1,
        },
        borderRadius: t.radius.xxl,
        boxShadow: "inset 0 0 0 1px",
        flexShrink: 0,
        outline: active && checked ? "#03A071 auto 3px" : "none",
        position: "relative",
        ...size(20),
        zIndex: 0,
      }),
      _css
    )}
  >
    <input
      css={s({
        bottom: 0,
        left: 0,
        opacity: 0,
        position: "absolute",
        right: 0,
        ...size("100%"),
        top: 0,
      })}
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

export default Radio;
