import {
  fromPaymentRequestShippingAddress,
  toSmallestCurrencyUnit,
} from "../utils";

describe("fromPaymentRequestShippingAddress", () => {
  it("should format complete address details with a parsable name", () => {
    expect(
      fromPaymentRequestShippingAddress({
        addressLine: ["123 Fake St"],
        city: "Los Angeles",
        country: "US",
        phone: "937-901-5687",
        postalCode: "90017",
        recipient: "Joe Q Bloggs",
        region: "California",
      })
    ).toMatchSnapshot();
  });

  // The `parse-full-name` library doesn't handle middle initials that are also
  // conjunctions - see https://github.com/RateGravity/parse-full-name/issues/7
  it("should format complete address details with a parsable name that included the initials that are also conjunctions", () => {
    expect(
      fromPaymentRequestShippingAddress({
        addressLine: ["123 Fake St"],
        city: "Los Angeles",
        country: "US",
        phone: "937-901-5687",
        postalCode: "90017",
        recipient: "Joe and Jane Bloggs",
        region: "California",
      })
    ).toMatchSnapshot();

    expect(
      fromPaymentRequestShippingAddress({
        addressLine: ["123 Fake St"],
        city: "Los Angeles",
        country: "US",
        phone: "937-901-5687",
        postalCode: "90017",
        recipient: "Joe ET Bloggs",
        region: "California",
      })
    ).toMatchSnapshot();

    expect(
      fromPaymentRequestShippingAddress({
        addressLine: ["123 Fake St"],
        city: "Los Angeles",
        country: "US",
        phone: "937-901-5687",
        postalCode: "90017",
        recipient: "Joe E Bloggs",
        region: "California",
      })
    ).toMatchSnapshot();

    expect(
      fromPaymentRequestShippingAddress({
        addressLine: ["123 Fake St"],
        city: "Los Angeles",
        country: "US",
        phone: "937-901-5687",
        postalCode: "90017",
        recipient: "Joe Y Bloggs",
        region: "California",
      })
    ).toMatchSnapshot();
  });

  it("should format complete address details with an unparsable or incomplete name", () => {
    const details = {
      addressLine: ["123 Fake St"],
      city: "Los Angeles",
      country: "US",
      phone: "937-901-5687",
      postalCode: "90017",
      region: "California",
    };

    expect(
      fromPaymentRequestShippingAddress({
        ...details,
        recipient: "Madonna",
      })
    ).toMatchSnapshot();

    expect(
      fromPaymentRequestShippingAddress({
        ...details,
        recipient: "Ms Ciccone",
      })
    ).toMatchSnapshot();

    expect(
      fromPaymentRequestShippingAddress({
        ...details,
        recipient:
          "Adolph Blaine Charles David Earl Frederick Gerald Hubert Irvin John Kenneth Lloyd Martin Nero Oliver Paul Quincy Randolph Sherman Thomas Uncas Victor William Xerxes Yancy Zeus Wolfeschlegel­steinhausen­bergerdorff­welche­vor­altern­waren­gewissenhaft­schafers­wessen­schafe­waren­wohl­gepflege­und­sorgfaltigkeit­beschutzen­vor­angreifen­durch­ihr­raubgierig­feinde­welche­vor­altern­zwolfhundert­tausend­jahres­voran­die­erscheinen­von­der­erste­erdemensch­der­raumschiff­genacht­mit­tungstein­und­sieben­iridium­elektrisch­motors­gebrauch­licht­als­sein­ursprung­von­kraft­gestart­sein­lange­fahrt­hinzwischen­sternartig­raum­auf­der­suchen­nachbarschaft­der­stern­welche­gehabt­bewohnbar­planeten­kreise­drehen­sich­und­wohin­der­neue­rasse­von­verstandig­menschlichkeit­konnte­fortpflanzen­und­sich­erfreuen­an­lebenslanglich­freude­und­ruhe­mit­nicht­ein­furcht­vor­angreifen­vor­anderer­intelligent­geschopfs­von­hinzwischen­sternartig­raum Sr.",
      })
    ).toMatchSnapshot();
  });

  it("should format partial address details when explicitly allowed", () => {
    expect(
      fromPaymentRequestShippingAddress(
        {
          city: "Los Angeles",
          country: "US",
          postalCode: "90017",
          region: "California",
        },
        true
      )
    ).toMatchSnapshot();
  });

  it("should throw an error on partial address details if not explicitly allowed", () => {
    expect(() =>
      fromPaymentRequestShippingAddress({
        city: "Los Angeles",
        country: "US",
        postalCode: "90017",
        region: "California",
      })
    ).toThrowError("Missing address fields");
  });
});

describe("toSmallestCurrencyUnit", () => {
  it("should convert decimal currencies in major units into the corresponding minor unit", () => {
    expect(
      toSmallestCurrencyUnit({ amount: "1.23", currencyCode: "AUD" })
    ).toBe(123);
    expect(
      toSmallestCurrencyUnit({ amount: "0.123", currencyCode: "GBP" })
    ).toBe(12);
    expect(toSmallestCurrencyUnit({ amount: "123", currencyCode: "USD" })).toBe(
      12300
    );
  });

  it("should parse zero-decimal currencies without multiplying them", () => {
    expect(
      toSmallestCurrencyUnit({ amount: "1.23", currencyCode: "BIF" })
    ).toBe(1);
    expect(
      toSmallestCurrencyUnit({ amount: "0.123", currencyCode: "JPY" })
    ).toBe(0);
    expect(toSmallestCurrencyUnit({ amount: "123", currencyCode: "XPF" })).toBe(
      123
    );
  });
});
