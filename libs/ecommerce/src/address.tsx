import gql from "graphql-tag";
import React, { FC, Fragment, ReactNode } from "react";

import Countries from "./countries";

export interface Address {
  address1: string;
  address2: string;
  city: string;
  company: string;
  country: string;
  countryCode: keyof typeof Countries;
  firstName: string;
  lastName: string;
  phone: string;
  province: string;
  zip: string;
}

export type AddressInput = Omit<Address, "country"> & { countryCode: string };

export const addressFragment = gql`
  fragment address on RAddress {
    address1
    address2
    city
    company
    country
    countryCode
    firstName
    lastName
    phone
    province
    zip
  }
`;

export type PartialAddressInput = Partial<AddressInput> &
  Pick<AddressInput, "city" | "countryCode" | "province" | "zip">;

export const isPartialAddressInput = (
  address: AddressInput | PartialAddressInput
): address is PartialAddressInput => !address.address1 || !address.lastName;

interface FormatAddressProps {
  address: Address;
  lines?: (keyof Address)[];
  separator?: ReactNode;
}

export const FormatAddress: FC<FormatAddressProps> = ({
  address,
  lines = [
    "company",
    "address1",
    "address2",
    "city",
    "province",
    "country",
    "zip",
  ],
  separator = <br />,
}) => {
  // Map values and remove empty entries
  const values = lines.map((key) => address[key]?.trim()).filter(Boolean);

  return (
    <>
      {values.map((value, index) => (
        <Fragment key={index}>
          {index !== 0 && separator}
          {value}
        </Fragment>
      ))}
    </>
  );
};
