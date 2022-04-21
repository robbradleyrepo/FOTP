import { useLocale } from ".";

export interface FormatCurrencyParams {
  amount: string;
  currencyCode: string;
  fractionDigits?: number;
  langtag: string;
}

export const formatCurrency = ({
  amount,
  currencyCode,
  fractionDigits,
  langtag,
}: FormatCurrencyParams) =>
  Intl.NumberFormat(langtag, {
    currency: currencyCode,
    style: "currency",
    ...(typeof fractionDigits !== "undefined" && {
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: fractionDigits,
    }),
  }).format(Number(amount));

export const useCurrencyFormatter = (
  defaults?: Pick<FormatCurrencyParams, "fractionDigits">
) => {
  const {
    locale: { langtag },
  } = useLocale();

  return (params: Omit<FormatCurrencyParams, "langtag">) =>
    formatCurrency({ ...defaults, ...params, langtag });
};

export const formatDateTime = (
  date: Date | number | string,
  langtag: string,
  options?: Intl.DateTimeFormatOptions
) =>
  Intl.DateTimeFormat(langtag, options).format(
    date instanceof Date ? date : new Date(date)
  );

export const useDateTimeFormatter = (defaults?: Intl.DateTimeFormatOptions) => {
  const {
    locale: { langtag, timeZone },
  } = useLocale();

  return (date: Date | string, params?: Intl.DateTimeFormatOptions) => {
    const options = {
      timeZone,
      ...defaults,
      ...params,
    };

    try {
      return formatDateTime(date, langtag, options);
    } catch (error) {
      // Older browsers may fail to handle timezones other than UTC
      return formatDateTime(date, langtag, {
        timeZoneName: "short",
        ...options,
        timeZone: "UTC",
      });
    }
  };
};
