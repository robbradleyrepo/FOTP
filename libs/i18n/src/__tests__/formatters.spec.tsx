import { mocked } from "ts-jest/utils";

import { useLocale } from "../context";
import {
  formatCurrency,
  formatDateTime,
  useCurrencyFormatter,
  useDateTimeFormatter,
} from "../formatters";

jest.mock("../context", () => ({
  useLocale: jest.fn(() => ({
    locale: {
      countryCode: "US",
      langtag: "en-US",
      language: "en",
      region: "us",
      timeZone: "America/Los_Angeles",
    },
  })),
}));

const mockUseLocale = mocked(useLocale);

describe("formatCurrency", () => {
  it("should format the provided value using the provide locale and currency code", () => {
    expect(
      formatCurrency({ amount: "123", currencyCode: "USD", langtag: "en-US" })
    ).toBe("$123.00");
    expect(
      formatCurrency({ amount: "123", currencyCode: "GBP", langtag: "en-GB" })
    ).toBe("£123.00");
  });

  it("should format the provided value to the specified number of decimals", () => {
    expect(
      formatCurrency({
        amount: "123",
        currencyCode: "USD",
        fractionDigits: 0,
        langtag: "en-US",
      })
    ).toBe("$123");
    expect(
      formatCurrency({
        amount: "123",
        currencyCode: "GBP",
        fractionDigits: 0,
        langtag: "en-GB",
      })
    ).toBe("£123");
  });
});

describe("formatDateTime", () => {
  const dateString = "2020-02-01T12:00:00Z";

  it("should handle dates and parsable numbers and strings", () => {
    const timestamp = Date.parse(dateString);
    const date = new Date(dateString);

    expect(formatDateTime(dateString, "en-US")).toBe(
      formatDateTime(date, "en-US")
    );
    expect(formatDateTime(timestamp, "en-US")).toBe(
      formatDateTime(date, "en-US")
    );
  });

  it("should format the provided string or date using the provided locale and formatting options", () => {
    expect(formatDateTime(dateString.substring(0, 10), "en-US")).toBe(
      "2/1/2020"
    );
    expect(formatDateTime(dateString, "en-US")).toBe("2/1/2020");
    expect(formatDateTime(dateString, "en-GB")).toBe("01/02/2020");
    expect(
      formatDateTime(dateString, "en-US", {
        day: "numeric",
        month: "long",
        weekday: "long",
        year: "numeric",
      })
    ).toBe("Saturday, February 1, 2020");
    expect(
      formatDateTime(dateString.substring(0, 10), "en-US", {
        day: "numeric",
        month: "long",
        timeZone: "UTC",
        year: "numeric",
      })
    ).toEqual("February 1, 2020");
  });
});

describe("useCurrencyFormatter", () => {
  it("should format the provided amount, currency code and formatting options using the current locale", () => {
    [
      {
        amount: "123",
        currencyCode: "USD",
        langtag: "en-US",
        language: "en",
        region: "us",
      },
      {
        amount: "123",
        currencyCode: "GBP",
        langtag: "en-GB",
        language: "en",
        region: "gb",
      },
      {
        amount: "123",
        currencyCode: "USD",
        fractionDigits: 0,
        langtag: "en-US",
        language: "en",
        region: "us",
      },
      {
        amount: "123",
        currencyCode: "GBP",
        fractionDigits: 0,
        langtag: "en-GB",
        language: "en",
        region: "gb",
      },
    ].forEach(
      ({ amount, currencyCode, fractionDigits, langtag, language, region }) => {
        mockUseLocale.mockReturnValueOnce(({
          locale: {
            langtag,
            language,
            region,
          },
        } as unknown) as ReturnType<typeof useLocale>);

        const format = useCurrencyFormatter();

        expect(
          format({
            amount,
            currencyCode,
            fractionDigits,
          })
        ).toBe(
          formatCurrency({ amount, currencyCode, fractionDigits, langtag })
        );
      }
    );
  });

  it("should use the default formatting options if no explicit formatting options are provided", () => {
    const amount = "123";
    const currencyCode = "USD";
    const fractionDigits = 0;
    const langtag = "en-US";
    const language = "en";
    const region = "us";

    mockUseLocale.mockReturnValueOnce(({
      locale: {
        langtag,
        language,
        region,
      },
    } as unknown) as ReturnType<typeof useLocale>);

    const format = useCurrencyFormatter({ fractionDigits });

    expect(
      format({
        amount,
        currencyCode,
      })
    ).toBe(formatCurrency({ amount, currencyCode, fractionDigits, langtag }));

    expect(
      format({
        amount,
        currencyCode,
        fractionDigits: 2,
      })
    ).toBe(
      formatCurrency({ amount, currencyCode, fractionDigits: 2, langtag })
    );
  });
});

describe("useDateTimeFormatter", () => {
  const dateString = "2020-02-01T12:00:00Z";

  it("should format the provided date and formatting options using the current locale", () => {
    [
      { langtag: "en-US" },
      { langtag: "en-GB" },
      {
        langtag: "en-US",
        options: {
          day: "numeric",
          month: "long",
          weekday: "long",
          year: "numeric",
        },
      },
      {
        langtag: "en-GB",
        options: {
          day: "numeric",
          month: "long",
          weekday: "long",
          year: "numeric",
        },
      },
    ].forEach(({ langtag, options }) => {
      mockUseLocale.mockReturnValueOnce(({
        locale: { langtag },
      } as unknown) as ReturnType<typeof useLocale>);

      const format = useDateTimeFormatter();

      expect(format(dateString, options)).toBe(
        formatDateTime(dateString, langtag, options)
      );
    });
  });

  it("should use the default timezone if no timezone is provided", () => {
    const defaultOptions = {
      timeZone: "America/Los_Angeles",
    };
    const langtag = "en-US";
    const options = {
      timeZone: "Europe/London",
    };

    const format = useDateTimeFormatter(defaultOptions);

    expect(format(dateString)).toBe(
      formatDateTime(dateString, langtag, defaultOptions)
    );

    expect(format(dateString, {})).toBe(
      formatDateTime(dateString, langtag, defaultOptions)
    );

    expect(format(dateString, options)).toBe(
      formatDateTime(dateString, langtag, options)
    );
  });

  it("should combine the default and explicity formatting options", () => {
    const defaultOptions = {
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      month: "long",
      second: "numeric",
      weekday: "long",
      year: "numeric",
    };
    const options = { month: "short", weekday: "short", year: undefined };

    const format = useDateTimeFormatter(defaultOptions);

    expect(format(dateString)).toMatchSnapshot();

    expect(format(dateString, options)).toMatchSnapshot();
  });

  it("should fallback to UTC for invalid or unhandled timezones", () => {
    const format = useDateTimeFormatter();

    expect(format(dateString, { timeZone: "Foo/Bar" })).toMatchSnapshot();
  });
});
