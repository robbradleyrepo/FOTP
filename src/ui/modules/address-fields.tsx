import {
  Countries,
  CountryCodes,
  getStateCode,
  USStates,
} from "@sss/ecommerce";
import { Address } from "@sss/ecommerce/address";
import {
  optional,
  validateRequired,
  validateUSPhoneNumber,
  Validator,
} from "@sss/forms";
import { useLocale } from "@sss/i18n";
import { AnyObject } from "final-form";
import { TFunction } from "i18next";
import React, { FC, useEffect } from "react";
import { FormSpy, useForm } from "react-final-form";

import { ComponentStyleProps, useTheme } from "@/common/ui/utils";

import { Grid, Item } from "../base/grid";
import Field, { FormField } from "../forms/field";

const enUsResource = {
  fields: {
    address1: {
      label: "Address 1",
      required: "This field is required",
    },
    address2: {
      label: "Address 2",
      required: "This field is required",
    },
    city: {
      label: "City",
      required: "This field is required",
    },
    company: {
      label: "Company",
    },
    countryCode: {
      label: "Country",
      required: "This field is required",
    },
    firstName: {
      label: "First Name",
      required: "This field is required",
    },
    lastName: {
      label: "Last Name",
      required: "This field is required",
    },
    phone: {
      invalid: "Please enter a 10 digit US phone number: E.g. 323-922-5737",
      label: "Phone",
    },
    province: {
      label: "State",
      required: "This field is required",
    },
    zip: {
      label: "Zip code",
      required: "This field is required",
    },
  },
};

type AddressRule = keyof Pick<
  Address,
  "address1" | "address2" | "city" | "province" | "zip"
>;

type AddressRules = Partial<
  Record<AddressRule, { required?: boolean; validator: Validator } | undefined>
>;

const requiredRule = (name: string) => ({
  required: true,
  validator: validateRequired(`addressFields:fields.${name}.required`),
});

const RULES: Partial<Record<CountryCodes, AddressRules>> = {
  US: {
    address1: requiredRule("address1"),
    city: requiredRule("city"),
    province: requiredRule("province"),
    zip: requiredRule("zip"),
  },
};

const FALLBACK_RULE: AddressRules = {
  address1: requiredRule("address1"),
  zip: requiredRule("zip"),
};

const getAddressRules = (
  countryCode: CountryCodes | undefined
): AddressRules => {
  if (!countryCode) {
    return FALLBACK_RULE;
  }

  return RULES[countryCode] ?? FALLBACK_RULE;
};

const isOptionalField = (
  fieldName: AddressRule,
  countryCode: CountryCodes | undefined
) => {
  const rules = getAddressRules(countryCode);
  return !(rules[fieldName]?.required ?? false);
};

const validateAddressField = (
  t: TFunction,
  fieldName: AddressRule
): Validator => (value: unknown, values: AnyObject) => {
  const rules = getAddressRules(values.countryCode);
  const validator = rules?.[fieldName]?.validator;

  const result = validator?.(value, values);
  if (result) {
    return result.map((k) => typeof k === "string" && t(k)).filter(Boolean);
  }
};

interface AddressFieldsProps extends ComponentStyleProps {
  busy: boolean;
  countries?: Partial<typeof Countries>;
  section: "billing" | "shipping";
}

const AddressFields: FC<AddressFieldsProps> = ({
  _css = {},
  busy,
  countries = Countries,
  section,
}) => {
  const form = useForm();
  const { i18n, t } = useLocale();
  i18n.addResourceBundle("en-US", "addressFields", enUsResource);
  const theme = useTheme();

  useEffect(() => {
    return form.subscribe(
      ({ values }: AnyObject) => {
        if (
          values.countryCode === "US" &&
          !getStateCode(values.province ?? "")
        ) {
          // Reset to the initial value when we switch back to the US to avoid
          // invalid selections without flagging the field as dirty
          const initial = getStateCode(
            form.getFieldState("province")?.initial ?? ""
          );
          form.change("province", initial);
        }
      },
      {
        values: true,
      }
    );
  }, [form]);

  return (
    <FormSpy subscription={{ values: true }}>
      {({ values }) => {
        const countryCode: CountryCodes | undefined = values.countryCode;
        return (
          <Grid _css={_css} gx={theme.spacing.md} itemWidth="100%">
            <Item width={["100%", null, null, "50%"]}>
              <FormField
                autoComplete="given-name"
                busy={busy}
                data-testid="addressFirstName"
                name="firstName"
                label={t("addressFields:fields.firstName.label")}
                type="text"
                validate={validateRequired(
                  t("addressFields:fields.firstName.required")
                )}
              />
            </Item>
            <Item width={["100%", null, null, "50%"]}>
              <FormField
                autoComplete="family-name"
                busy={busy}
                data-testid="addressLastName"
                name="lastName"
                label={t("addressFields:fields.lastName.label")}
                type="text"
                validate={validateRequired(
                  t("addressFields:fields.lastName.required")
                )}
              />
            </Item>
            <Item>
              <FormField
                autoComplete={`${section} address-line1`}
                busy={busy}
                data-testid="addressLine1"
                name="address1"
                label={t("addressFields:fields.address1.label")}
                optional={isOptionalField("address1", countryCode)}
                type="text"
                validate={validateAddressField(t, "address1")}
              />
            </Item>
            <Item>
              <FormField
                autoComplete={`${section} address-line2`}
                busy={busy}
                data-testid="addressLine2"
                name="address2"
                label={t("addressFields:fields.address2.label")}
                optional={isOptionalField("address2", countryCode)}
                type="text"
                validate={validateAddressField(t, "address2")}
              />
            </Item>
            <Item width={["100%", null, null, "50%"]}>
              <FormField
                autoComplete={`${section} address-level2`}
                busy={busy}
                data-testid="addressCity"
                name="city"
                label={t("addressFields:fields.city.label")}
                optional={isOptionalField("city", countryCode)}
                type="text"
                validate={validateAddressField(t, "city")}
              />
            </Item>
            <Item width={["100%", null, null, "50%"]}>
              <FormField
                autoComplete={`${section} postal-code`}
                busy={busy}
                data-testid="addressZip"
                label={t("addressFields:fields.zip.label")}
                name="zip"
                optional={isOptionalField("zip", countryCode)}
                type="text"
                validate={validateAddressField(t, "zip")}
              />
            </Item>
            <Item width={["100%", null, null, "50%"]}>
              {countryCode === "US" ? (
                <FormField
                  autoComplete={`${section} address-level1`}
                  busy={busy}
                  data-testid="addressProvince"
                  name="province"
                  optional={isOptionalField("province", countryCode)}
                  label={t("addressFields:fields.province.label")}
                  type="select"
                  validate={validateAddressField(t, "province")}
                >
                  <option disabled value="">
                    Please choose...
                  </option>
                  {Object.entries(USStates).map(([key, value]) => (
                    // Note: Certain Recharge internals fail when using the province code
                    //       best to use the named value
                    <option key={key} value={value}>
                      {value}
                    </option>
                  ))}
                </FormField>
              ) : (
                <FormField
                  autoComplete={`${section} address-level1`}
                  busy={busy}
                  data-testid="addressProvince"
                  name="province"
                  optional={isOptionalField("province", countryCode)}
                  label={t("addressFields:fields.province.label")}
                  type="text"
                  validate={validateAddressField(t, "province")}
                />
              )}
            </Item>
            <Item width={["100%", null, null, "50%"]}>
              <FormField
                autoComplete={`${section} country`}
                busy={busy}
                data-testid="addressCountryCode"
                label={t("addressFields:fields.countryCode.label")}
                name="countryCode"
                type="select"
                validate={validateRequired(
                  t("addressFields:fields.countryCode.required")
                )}
              >
                {Object.entries(countries).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </FormField>
            </Item>
            <Item>
              <Field
                autoComplete="tel"
                busy={busy}
                data-testid="addressPhone"
                name="phone"
                label={t("addressFields:fields.phone.label")}
                optional
                placeholder="999-999-9999"
                type="tel"
                validate={optional(
                  validateUSPhoneNumber(t("addressFields:fields.phone.invalid"))
                )}
              />
            </Item>
          </Grid>
        );
      }}
    </FormSpy>
  );
};

export default AddressFields;
