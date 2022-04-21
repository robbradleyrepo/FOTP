import { px, py, s } from "@/common/ui/utils";

import { callToActionText } from "../typography";

export interface ButtonProps {
  disabled?: boolean;
  reverse?: boolean;
}

export const baseButton = ({ disabled }: ButtonProps = {}) =>
  s(callToActionText, (t) => ({
    borderRadius: t.radius.sm,
    cursor: disabled ? "default" : "pointer",
    display: "inline-block",
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? "none" : "auto",
    ...px(t.spacing.xl),
    ...py(23),
    textAlign: "center",
    transition:
      " background-color 250ms, box-shadow 250ms, color 250ms, opacity 250ms, transform 150ms",
    width: ["100%", "auto"],
  }));

export const primaryButton = (props: ButtonProps = {}) =>
  s(baseButton(props), (t) => ({
    "&:active": {
      transform: "translateY(1px) scale(0.98)",
    },
    "&:disabled": {
      backgroundColor: t.color.background.light,
      boxShadow: "0 0 0 0 rgba(24, 83, 65, 0.15)",
    },
    "&:focus, &:hover": {
      backgroundColor: t.color.background.light,
      boxShadow: "0 5px 10px 0 rgba(24, 83, 65, 0.4)",
      transform: "translateY(-1px)",
    },
    backgroundColor: t.color.background.dark,
    color: t.color.text.light.base,
  }));

export const contrastButton = (props: ButtonProps = {}) =>
  s(primaryButton(props), (t) => ({
    "&:disabled": {
      backgroundColor: t.color.accent.dark,
    },
    "&:focus, &:hover": {
      backgroundColor: t.color.accent.dark,
    },
    backgroundColor: t.color.accent.light,
  }));

export const secondaryButton = ({ disabled, reverse }: ButtonProps = {}) =>
  s(baseButton({ disabled }), (t) => ({
    "&:active": {
      transform: "translateY(2px) scale(0.98)",
    },
    "&:focus, &:hover": reverse
      ? {
          backgroundColor: t.color.tint.pistachio,
          boxShadow: `inset 0 0 0 2px ${t.color.tint.pistachio}`,
          color: t.color.text.dark.base,
        }
      : {
          backgroundColor: t.color.background.dark,
          color: t.color.text.light.base,
        },
    boxShadow: `inset 0 0 0 2px ${
      reverse ? t.color.background.base : t.color.background.dark
    }`,
    color: reverse ? t.color.text.light.base : t.color.text.dark.base,
  }));

export const textButton = ({ disabled, reverse }: ButtonProps = {}) =>
  s(callToActionText, (t) => ({
    "&:active": {
      transform: "translateY(2px) scale(0.97)",
    },
    "&:focus, &:hover": {
      borderColor: "transparent",
    },
    borderBottomColor: reverse
      ? t.color.background.base
      : t.color.background.dark,
    borderBottomStyle: "solid",
    borderBottomWidth: reverse ? 1 : 2,
    color: reverse ? t.color.background.base : t.color.background.dark,
    display: "inline-block",
    opacity: disabled ? 0.5 : 1,
    paddingBottom: t.spacing.xxs,
    paddingTop: t.spacing.xs,
    transition: "border 250ms, opacity 250ms",
  }));
