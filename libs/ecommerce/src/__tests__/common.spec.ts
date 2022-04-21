import { getDiscount, getOrderIntervalUnit, moneyFns } from "../common";

describe("getDiscount", () => {
  it("should return `null` if the comparison price is not larger than the price", () => {
    expect(
      getDiscount(
        { amount: "1.00", currencyCode: "USD" },
        { amount: "1.00", currencyCode: "USD" }
      )
    ).toBeNull();
    expect(
      getDiscount(
        { amount: "2.00", currencyCode: "USD" },
        { amount: "1.00", currencyCode: "USD" }
      )
    ).toBeNull();
  });

  it("should return the difference between the comparison price and the price, as `Money` and a percentage", () => {
    expect(
      getDiscount(
        { amount: "1.00", currencyCode: "USD" },
        { amount: "2.00", currencyCode: "USD" }
      )
    ).toEqual({
      percentage: 50,
      price: { amount: "1", currencyCode: "USD" },
    });
    expect(
      getDiscount(
        { amount: "1.00", currencyCode: "USD" },
        { amount: "5.00", currencyCode: "USD" }
      )
    ).toEqual({
      percentage: 80,
      price: { amount: "4", currencyCode: "USD" },
    });
  });
});

describe("getOrderIntervalUnit", () => {
  it("should handle lowercase, uppercase and titlecase", () => {
    expect(getOrderIntervalUnit("day")).toBe("DAY");
    expect(getOrderIntervalUnit("Week")).toBe("WEEK");
    expect(getOrderIntervalUnit("MONTH")).toBe("MONTH");
  });

  it("should handle plurals", () => {
    expect(getOrderIntervalUnit("days")).toBe("DAY");
    expect(getOrderIntervalUnit("Weeks")).toBe("WEEK");
    expect(getOrderIntervalUnit("MONTHS")).toBe("MONTH");
  });

  it("should throw an error if an invalid unit is provided", () => {
    expect(() => getOrderIntervalUnit("foo")).toThrowError(
      'Invalid order interval unit "foo"'
    );
  });
});

describe("moneyFns", () => {
  describe("add", () => {
    it("should add the two provided money objects if they have the same currency code", () => {
      expect(
        moneyFns.add(
          {
            amount: "0.02",
            currencyCode: "USD",
          },
          {
            amount: "0.03",
            currencyCode: "USD",
          }
        )
      ).toEqual({
        amount: "0.05",
        currencyCode: "USD",
      });
    });

    it("should throw an error if the two provided money objects have a different currency code", () => {
      expect(() =>
        moneyFns.add(
          {
            amount: "0.02",
            currencyCode: "USD",
          },
          {
            amount: "0.03",
            currencyCode: "GBP",
          }
        )
      ).toThrowError("Cannot add different currencies");
    });
  });

  describe("subtract", () => {
    it("should substract second provided money object from the first if they have the same currency code", () => {
      expect(
        moneyFns.subtract(
          {
            amount: "0.07",
            currencyCode: "USD",
          },
          {
            amount: "0.02",
            currencyCode: "USD",
          }
        )
      ).toEqual({
        amount: "0.05",
        currencyCode: "USD",
      });
    });

    it("should throw an error if the two provided money objects have a different currency code", () => {
      expect(() =>
        moneyFns.subtract(
          {
            amount: "0.07",
            currencyCode: "USD",
          },
          {
            amount: "0.02",
            currencyCode: "GBP",
          }
        )
      ).toThrowError("Cannot add different currencies");
    });
  });

  describe("multiply", () => {
    it("should return a money object with an amount equal to amount of the provided money object multiplied by the provided multiplier", () => {
      expect(
        moneyFns.multiply(
          {
            amount: "0.02",
            currencyCode: "USD",
          },
          10
        )
      ).toEqual({
        amount: "0.2",
        currencyCode: "USD",
      });

      expect(
        moneyFns.multiply(
          {
            amount: "0.02",
            currencyCode: "USD",
          },
          -1
        )
      ).toEqual({
        amount: "-0.02",
        currencyCode: "USD",
      });
    });
  });

  describe("divide", () => {
    it("should return a money object with an amount equal to amount of the provided money object divided by the provided divisor", () => {
      expect(
        moneyFns.divide(
          {
            amount: "0.3",
            currencyCode: "USD",
          },
          10
        )
      ).toEqual({
        amount: "0.03",
        currencyCode: "USD",
      });
    });
  });

  describe("toFloat", () => {
    it("should return a number equal to the amount of the provided money object", () => {
      expect(
        moneyFns.toFloat({
          amount: "0.02",
          currencyCode: "USD",
        })
      ).toEqual(0.02);

      expect(
        moneyFns.toFloat({
          amount: "0.00",
          currencyCode: "USD",
        })
      ).toEqual(0);

      expect(
        moneyFns.toFloat({
          amount: "-1.23",
          currencyCode: "USD",
        })
      ).toEqual(-1.23);
    });
  });

  describe("update", () => {
    it("should return a money object with an amount equal to the provided value, but the same currency code as the provided money object", () => {
      expect(
        moneyFns.update({ amount: "1.23", currencyCode: "USD" }, 4.56)
      ).toEqual({
        amount: "4.56",
        currencyCode: "USD",
      });
    });
  });
});
