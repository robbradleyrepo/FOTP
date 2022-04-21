import { ApolloProvider } from "@apollo/react-hooks";
import { CustomerProvider } from "@sss/customer";
import { CartProvider } from "@sss/ecommerce/cart";
import { CartOfferProvider } from "@sss/ecommerce/offer/cart";
import { GorgiasController } from "@sss/gorgias";
import { Locale, LocaleProvider } from "@sss/i18n";
import { ApolloClient } from "apollo-boost";
import React, { FC } from "react";

import { ThemeProvider } from "@/common/ui/utils";

import { ModalController } from "./base/modal";
import { ToastController } from "./base/toast";
import { DiscountListener } from "./discounts";
import { InfluencerListener } from "./influencers";
import { MenuController } from "./nav/menu";
import { theme } from "./styles/theme";

interface PageProvidersProps {
  apolloClient: ApolloClient<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  locale: Locale;
}

const PageProviders: FC<PageProvidersProps> = ({
  apolloClient,
  children,
  locale,
}) => (
  <LocaleProvider locale={locale}>
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <CartProvider>
          <CartOfferProvider>
            <CustomerProvider>
              <ModalController>
                <GorgiasController>
                  <MenuController>
                    <ToastController>
                      {children}
                      <DiscountListener />
                      <InfluencerListener />
                    </ToastController>
                  </MenuController>
                </GorgiasController>
              </ModalController>
            </CustomerProvider>
          </CartOfferProvider>
        </CartProvider>
      </ThemeProvider>
    </ApolloProvider>
  </LocaleProvider>
);

export default PageProviders;
