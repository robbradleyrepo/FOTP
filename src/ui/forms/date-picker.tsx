import { useLocale } from "@sss/i18n";
import { format, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import React, { FC } from "react";
import DayPicker, { DayPickerProps } from "react-day-picker";
import { FieldInputProps } from "react-final-form";
import { createGlobalStyle } from "styled-components";

import { ComponentStyleProps, percentage, s } from "@/common/ui/utils";

import chevronLeft from "../icons/chevronLeft";
import chevronRight from "../icons/chevronRight";
import { dataUriFromPath } from "../styles/utils";
import { color, font, radius, spacing } from "../styles/variables";

const cellPadding = spacing.sm;

const DayPickerStyles = createGlobalStyle`
  .DayPicker {
    margin: 0 -${cellPadding}px;
  }

  .DayPicker-wrapper {
    position: relative;
    user-select: none;
    width: 100%;
  }

  .DayPicker-Month {
    border-collapse: collapse;
    border-spacing: 0;
    display: table;
    user-select: none;
    width: 100%;
  }

  .DayPicker-NavButton {
    cursor: pointer;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 12px;
    display: inline-block;
    height: ${spacing.md}px;
    margin-right: -${spacing.md / 2}px;
    position: absolute;
    width: ${spacing.md}px;
  }

  .DayPicker-NavButton:hover {
    opacity: 0.8;
  }

  .DayPicker-NavButton--prev {
    background-image: url("${dataUriFromPath({ path: chevronLeft })}");
    right: ${percentage(1.5 / 7)};
  }

  .DayPicker-NavButton--next {
    background-image: url("${dataUriFromPath({ path: chevronRight })}");
    right: ${percentage(0.5 / 7)};
  }

  .DayPicker-NavButton--interactionDisabled {
    display: none;
  }

  .DayPicker-Caption {
    display: table-caption;
    font-weight: ${font.primary.weight.medium};
    margin-bottom: ${spacing.sm}px;
    padding-left: ${cellPadding}px;
  }

  .DayPicker-Weekdays {
    display: table-header-group;
    font-size: 12px;
    margin-top: 1rem;
    text-transform: uppercase;
  }

  .DayPicker-WeekdaysRow {
    display: table-row;
  }

  .DayPicker-Weekday {
    display: table-cell;
    padding: ${cellPadding}px;
    text-align: center;
    vertical-align: middle;
  }

  .DayPicker-Weekday abbr[title] {
    border-bottom: none;
    text-decoration: none;
  }

  .DayPicker-Body {
    display: table-row-group;
  }

  .DayPicker-Week {
    display: table-row;
  }

  .DayPicker-Day {
    cursor: pointer;
    display: table-cell;
    padding: ${cellPadding}px;
    position: relative;
    text-align: center;
    vertical-align: middle;

    &:focus,
    &:hover {
      text-decoration: underline;
    }

    &:focus {
      opacity: 0.9;
      outline: none;
    }

    &::after {
      content: "";
      display: block;
      border-radius: ${radius.xxl}px;
      height: 3em;
      left: 50%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 3em;
      z-index: -1;
    }
  }

  .DayPicker--interactionDisabled .DayPicker-Day {
    cursor: default;
  }

  .DayPicker-Day--outside {
    opacity: 0.5;
  }

  .DayPicker-Day--selected {
    color: ${color.text.light.base};
    cursor: default;

    &:hover:not(:focus) {
      text-decoration: none;
    }

    &::after {
      background-color: ${color.background.dark};
    }
  }

  .DayPicker-Day--disabled {
    backgorund-color: transparent;
    cursor: default;
    opacity: 0.2;

    &:hover {
      text-decoration: none;
    }
  }
`;

type DatePickerProps = Pick<DayPickerProps, "disabledDays"> &
  Pick<FieldInputProps<"string">, "onBlur" | "onChange" | "onFocus" | "value"> &
  ComponentStyleProps;

const DatePicker: FC<DatePickerProps> = ({
  _css = {},
  disabledDays,
  onBlur,
  onChange,
  onFocus,
  value,
}) => {
  const { locale } = useLocale();

  /**
   * We need to deal with three potentially different time zones:
   *
   * 1. UTC - how we store all dates
   * 2. The store's time zone - how we display all dates
   * 3. The user's time zone - how `DayPicker` displays / reports dates
   *
   * First, we'll take the UTC value for the date and generate a new date
   * that has the same value in the user's time zone as the UTC value has
   * in the store's time zone. This ensures that the date displayed in the
   * date picker always matches the date displayed on the rest of the store.
   */
  const zoneDateTime = utcToZonedTime(value, locale.timeZone);

  const handleDayClick: DayPickerProps["onDayClick"] = (
    dateTime,
    { disabled }
  ) => {
    if (disabled) return;

    /**
     * The date reported by `DayPicker` is in the user's time zone, but we want
     * to treat it as if it were in the store's time zone. We'll do this by
     * truncating the time zone information from the `DayPicker` value, then
     * generating a new UTC date value using the store's time zone
     */
    const dateStr = format(dateTime, "yyyy-MM-dd");

    return onChange(zonedTimeToUtc(dateStr, locale.timeZone).toISOString());
  };

  return (
    <div css={s(_css)}>
      <DayPickerStyles />
      <DayPicker
        disabledDays={disabledDays}
        initialMonth={zoneDateTime}
        onBlur={onBlur}
        onDayClick={handleDayClick}
        onFocus={onFocus}
        selectedDays={zoneDateTime}
        showOutsideDays
      />
    </div>
  );
};

export default DatePicker;
