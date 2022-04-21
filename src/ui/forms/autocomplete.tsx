import { useCombobox, UseComboboxStateChange } from "downshift";
import React, { FocusEventHandler, ReactNode } from "react";

import { ComponentStyleProps, px, py, s, Style } from "@/common/ui/utils";

import { bodyText, bodyTextSmall } from "../base/typography";
import { input } from "./input";

export type AutocompleteChangeHandler<T> = (
  change: UseComboboxStateChange<T>
) => void;

export const AutocompleteChangeType = useCombobox.stateChangeTypes;

export type AutocompleteProps<T = string> = ComponentStyleProps & {
  busy?: boolean;
  disabled?: boolean;
  id: string;
  inputCss?: Style;
  items: T[];
  itemToString: (item: T | null) => string;
  label?: ReactNode;
  labelCss?: Style;
  labelWrapperCss?: Style;
  menuCss?: Style;
  menuItemCss?: (
    props?: Partial<Record<"highlighted" | "selected", boolean>>
  ) => Style;
  menuItemDisabledCss?: Style;
  name: string;
  noResults: ReactNode;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onInputValueChange: AutocompleteChangeHandler<T>;
  onSelectedItemChange: AutocompleteChangeHandler<T>;
  optional?: boolean;
  placeholder?: string;
  selectedItem: T;
};

const baseMenuItemStyle = s(bodyText, (t) => ({
  ...px(t.spacing.sm),
  ...py(t.spacing.xs),
}));

const Autocomplete = <T extends unknown>({
  _css = {},
  disabled,
  id,
  inputCss = {},
  items,
  itemToString,
  label,
  labelCss = {},
  labelWrapperCss = {},
  menuCss = {},
  menuItemCss = () => ({}),
  menuItemDisabledCss = {},
  name,
  noResults,
  onBlur,
  onFocus,
  onInputValueChange,
  onSelectedItemChange,
  placeholder,
  selectedItem,
}: AutocompleteProps<T>) => {
  const {
    getComboboxProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    isOpen,
  } = useCombobox({
    id,
    itemToString,
    items,
    onInputValueChange,
    onSelectedItemChange,
    selectedItem,
    stateReducer: (_, { type, changes }) => {
      if (type === AutocompleteChangeType.InputChange) {
        return {
          ...changes,
          selectedItem: null,
        };
      }

      return changes;
    },
  });
  const inputProps = getInputProps({
    disabled,
    name,
    onBlur,
    onFocus,
    placeholder,
  });

  return (
    <div css={s({ position: "relative" }, _css)} id={id}>
      <label css={s(labelWrapperCss)} {...getLabelProps()}>
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
          {label}
        </span>
        <div {...getComboboxProps()}>
          <input
            css={s(
              input(inputProps),
              {
                borderBottomLeftRadius: isOpen ? 0 : null,
                borderBottomRightRadius: isOpen ? 0 : null,
              },
              inputCss
            )}
            {...inputProps}
          />
        </div>
      </label>
      <ul
        css={s(
          input(inputProps),
          (t) => ({
            backgroundColor: t.color.background.base,
            borderTop: "none",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            height: "auto",
            ...px(0),
            ...py(t.spacing.xs),
            position: "absolute",
            visibility: isOpen ? "visible" : "hidden",
            zIndex: 9,
          }),
          menuCss
        )}
        {...getMenuProps()}
      >
        {isOpen && (
          <>
            {items.length > 0 ? (
              items.map((item, index) => {
                const highlighted = highlightedIndex === index;
                const selected = item === selectedItem;

                return (
                  <li
                    key={`${item}${index}`}
                    css={s(
                      baseMenuItemStyle,
                      (t) => ({
                        backgroundColor: highlighted
                          ? t.color.background.feature5
                          : null,
                      }),
                      menuItemCss({
                        highlighted,
                        selected,
                      })
                    )}
                    {...getItemProps({ index, item })}
                  >
                    {itemToString(item)}
                  </li>
                );
              })
            ) : (
              <li
                css={s(
                  baseMenuItemStyle,
                  {
                    fontStyle: "italic",
                    opacity: 0.7,
                  },
                  menuItemCss(),
                  menuItemDisabledCss
                )}
              >
                {noResults}
              </li>
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default Autocomplete;
