import { useApolloClient } from "@apollo/react-hooks";
import { CartStatus, useCart } from "@sss/ecommerce/cart";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { FC, useEffect, useRef, useState } from "react";

import {
  InfluencerRedirectData,
  TransformedInfluencerRedirect,
  transformInfluencerRedirect,
} from "../cms/influencer-redirect";
import { useModalController } from "./base/modal";

const InfluencerRedirectModal = dynamic(
  () => import("./modules/influencer-redirect-modal")
);

export const InfluencerListener: FC = () => {
  const client = useApolloClient();
  const cart = useCart();
  const hasSyncedRef = useRef(false);
  const { open, setIsOpen } = useModalController("influencer");
  const { query } = useRouter();
  const [
    influencerRedirect,
    setInfluencerRedirect,
  ] = useState<TransformedInfluencerRedirect | null>(null);

  useEffect(() => {
    if (
      hasSyncedRef.current ||
      cart.status === CartStatus.INITIALIZING ||
      typeof query.influencer !== "string"
    ) {
      return;
    }

    // We'll only attempt to sync once, even if we're not successful
    hasSyncedRef.current = true;

    (async () => {
      try {
        const { INFLUENCER_REDIRECT } = await import(
          "../cms/influencer-redirect"
        );

        const { data } = await client.query<InfluencerRedirectData>({
          query: INFLUENCER_REDIRECT,
          variables: { handle: query.influencer },
        });

        if (!data.influencerRedirect) return;

        const influencerRedirect = transformInfluencerRedirect(
          data.influencerRedirect
        );

        cart.setDiscountCode(influencerRedirect.discountCode);
        setInfluencerRedirect(influencerRedirect);
        setIsOpen(true);
      } catch (error) {
        // Fail silently
      }
    })();
  }, [cart, client, hasSyncedRef, query, setIsOpen]);

  return influencerRedirect ? (
    <InfluencerRedirectModal
      influencerRedirect={influencerRedirect}
      open={open}
      setIsOpen={setIsOpen}
    />
  ) : null;
};
