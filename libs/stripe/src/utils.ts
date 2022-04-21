import { Countries } from "@sss/ecommerce";
import {
  AddressInput,
  isPartialAddressInput,
  PartialAddressInput,
} from "@sss/ecommerce/address";
import { ShippingRate } from "@sss/ecommerce/checkout";
import { Money, moneyFns } from "@sss/ecommerce/common";
import {
  Address,
  PaymentRequestShippingAddress,
  PaymentRequestShippingOption,
} from "@stripe/stripe-js";
import { parseFullName as baseParseFullName } from "parse-full-name";

// The `parse-full-name` library doesn't handle middle initials that are also
// conjunctions - see https://github.com/RateGravity/parse-full-name/issues/7
const parseFullName = (fullName: string) => {
  // Based on the `conjunctionList` array that causes this issue
  const conjunctionRe = /\s(&|and|et|e|of|the|und|y)\s/gi;
  const result = baseParseFullName(fullName);

  return !result.first || result.error?.length
    ? // Try again, but remove any conjunctions. This might mangle a few
      // legitimate names, but we need a first name to fulfil orders
      baseParseFullName(fullName.replace(conjunctionRe, " "))
    : result;
};

// We're using || instead of nullish as Stripe does not allow empty strings.
const sanitise = (value?: string) => value?.trim() || undefined;

export const fromPaymentRequestShippingAddress = <T extends boolean = false>(
  {
    addressLine,
    dependentLocality,
    city,
    country,
    phone,
    postalCode,
    recipient,
    region,
  }: PaymentRequestShippingAddress,
  partial?: T
) => {
  let name: Pick<AddressInput, "firstName" | "lastName"> | null = null;

  if (recipient) {
    const { error, first, last } = parseFullName(recipient);

    name =
      !error?.length && !!first && !!last
        ? { firstName: first, lastName: last }
        : { firstName: "", lastName: recipient }; // Fall back to the unparsed name
  }

  const address: AddressInput | PartialAddressInput = {
    ...name,
    address1: addressLine?.[0],
    address2: addressLine?.[1] ?? dependentLocality ?? "",
    city: city ?? "",
    company: "",
    countryCode: country as keyof typeof Countries,
    phone: phone ?? "",
    province: region ?? "",
    zip: postalCode ?? "",
  };

  if (!partial && isPartialAddressInput(address)) {
    throw new Error("Missing address fields");
  }

  // Cast to conditional type as TypeScript can't infer it
  return address as T extends true ? PartialAddressInput : AddressInput;
};

export const fromBillingDetails = ({
  address: { city, country, line1, line2, postal_code, state },
  name,
  phone,
}: {
  address: Address;
  name: string;
  phone: string;
}): AddressInput => {
  if (!country || !line1 || !name || !postal_code || !state) {
    throw new Error("Missing data in billing details");
  }

  let firstName = "";
  let lastName = name;

  const { error, first, last } = parseFullName(name);

  if (!error?.length && !!first && !!last) {
    firstName = first;
    lastName = last;
  }

  return {
    address1: line1,
    address2: line2 ?? "",
    city: city ?? "",
    company: "",
    countryCode: country as keyof typeof Countries,
    firstName,
    lastName,
    phone: phone,
    province: state,
    zip: postal_code,
  };
};

export const toBillingDetails = ({
  address,
  cardholderName,
  email,
}: {
  address?: AddressInput;
  email?: string;
  cardholderName?: string;
  phone?: string;
}) => ({
  address: address
    ? {
        city: sanitise(address.city),
        country: address.countryCode,
        line1: sanitise(address.address1),
        line2: sanitise(address.address2),
        postal_code: sanitise(address.zip),
        state: sanitise(address.province),
      }
    : undefined,
  email,
  name: sanitise(cardholderName),
  phone: address ? sanitise(address.phone) : undefined,
});

export const toShippingOption = ({
  handle,
  price,
  title,
}: ShippingRate): PaymentRequestShippingOption => ({
  amount: toSmallestCurrencyUnit(price),
  detail: "", // ReCharge doesn't have a corresponding field, but it's required in the `PaymentRequestShippingOption`
  id: handle,
  label: title,
});

// Stripe expects all values to be provided in the smallest currency unit
// See https://stripe.com/docs/currencies#zero-decimal
export const toSmallestCurrencyUnit = (money: Money) => {
  const isZeroDecimal = [
    "BIF",
    "CLP",
    "DJF",
    "GNF",
    "JPY",
    "KMF",
    "KRW",
    "MGA",
    "PYG",
    "RWF",
    "UGX",
    "VND",
    "VUV",
    "XAF",
    "XOF",
    "XPF",
  ].includes(money.currencyCode);

  return Math.round(moneyFns.toFloat(money) * (isZeroDecimal ? 1 : 100));
};
