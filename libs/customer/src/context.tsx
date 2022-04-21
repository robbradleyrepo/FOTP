import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getTraitsFromCookie, setTraitsCookie, Traits } from "./traits";
import { Customer } from "./types";

interface CustomerContextProps {
  customer: Customer | null;
  loading: boolean;
  setTraits: (traits: Traits) => void;
}

const CustomerContext = createContext<CustomerContextProps | null>(null);

export const CustomerProvider: FC = ({ children }) => {
  const [value, setValue] = useState<Omit<CustomerContextProps, "setTraits">>({
    customer: null,
    loading: true,
  });

  // Load the customer data after the first render to ensure consistency
  // between client and server
  useEffect(() => {
    const customer = getTraitsFromCookie();

    setValue({ customer, loading: false });
  }, []);

  const setTraits = useCallback(
    (traits: Traits) => {
      setTraitsCookie(traits);
      setValue({ ...value, customer: traits });
    },
    [value]
  );

  return (
    <CustomerContext.Provider value={{ ...value, setTraits }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error("`useCustomer` must be used inside a `CustomerProvider`");
  }

  return context;
};
