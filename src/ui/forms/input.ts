import { rgba } from "polished";

import { StyleFn } from "@/common/ui/utils";

export interface InputProps {
  disabled?: boolean;
  active?: boolean;
  error?: boolean;
  type?: string;
}

export const input = ({ active, disabled, error }: InputProps): StyleFn => (
  t
) => ({
  backgroundColor: disabled
    ? rgba(t.color.border.light, 0.5)
    : t.color.background.base,
  borderColor: active
    ? t.color.border.dark
    : error
    ? t.color.border.error
    : t.color.border.light,
  borderRadius: t.radius.sm,
  borderStyle: "solid",
  borderWidth: 1,
  color: disabled ? rgba(t.color.text.dark.base, 0.6) : t.color.text.dark.base,
  display: "block",
  fontSize: 16,
  height: 54,
  lineHeight: 1,
  outline: "none",
  padding: t.spacing.sm,
  textAlign: "left",
  transition: "background 500ms, border 500ms, color 500ms, opacity 500ms",
  width: "100%",
});
