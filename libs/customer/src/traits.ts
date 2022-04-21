import { captureException } from "@sentry/nextjs";
import Cookies from "js-cookie";

import CUSTOMER, { CustomerConfig } from "./config";

const getTraitsCookieName = (name: string) => `te-t-${name}`;

export interface Traits {
  email: string;
  id: number | string;
  firstName?: string;
  lastName?: string;
  orders?: number;
  phone?: string | null;
  spent?: string;
  tags?: string;
}

export interface TraitsCookie {
  t: Traits;
  v: 1;
}

export const getTraitsFromCookie = (
  config?: CustomerConfig["traitsCookie"]
): Traits | null => {
  const { domain, name } = config ?? CUSTOMER.traitsCookie;
  const cookieName = getTraitsCookieName(name);
  const encoded = Cookies.get(cookieName);

  if (encoded) {
    try {
      const { t } = JSON.parse(atob(encoded)) as TraitsCookie;

      if (typeof t.email !== "string" || typeof t.id === "undefined") {
        throw new Error("Traits cookie missing email or id");
      }
      return t;
    } catch (error) {
      // Failed to decode cookie, delete it.
      Cookies.remove(cookieName, { domain });

      captureException(error);
    }
  }

  return null;
};

export const setTraitsCookie = (
  traits: Traits,
  config?: CustomerConfig["traitsCookie"]
) => {
  const { domain, name } = config ?? CUSTOMER.traitsCookie;
  const cookieName = getTraitsCookieName(name);

  // Remove any falsy values to reduce cookie size
  const filteredTraits = Object.entries(traits)
    .filter(([, value]) => value)
    .reduce((accum, [key, value]) => ({ ...accum, [key]: value }), {});
  Cookies.set(cookieName, btoa(JSON.stringify({ t: filteredTraits, v: 1 })), {
    domain,
    expires: 365,
    secure: window.location.protocol === "https:",
  });
};
