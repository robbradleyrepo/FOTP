import { Product } from "@sss/ecommerce/product";
import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import { GetStaticPaths } from "next";
import React, { FC } from "react";

import { s } from "@/common/ui/utils";

import HARMONY_CART_OFFER_IMG from "../../assets/images/offers/harmony-cart-offer.jpg";
import { bodyTextStatic, headingDeltaStatic } from "../../ui/base/typography";
import CartOfferBanner from "../../ui/modules/cart-offer/banner";
import CartOfferBody from "../../ui/modules/cart-offer/body";
import CartOfferCta from "../../ui/modules/cart-offer/cta";
import { makeCartOfferStaticPropsGetter } from "../../ui/modules/cart-offer/data";
import CartOfferFooter from "../../ui/modules/cart-offer/footer";
import CartOfferHeader from "../../ui/modules/cart-offer/header";
import CartOfferImage from "../../ui/modules/cart-offer/image";
import CartOfferLayout, {
  CartOfferType,
  useCartOfferLayout,
} from "../../ui/modules/cart-offer/layout";
import CartOfferTestimonial from "../../ui/modules/cart-offer/testimonial";
import { harmonyInitialSelection } from "./constants";

const enUsResource = {
  benefits: `
    <Title>For those times when you need a little extra help with your dog’s anxiety:</Title>
    <List>
      <Item>Alleviate anxiety</Item>
      <Item>Moderate stress</Item>
      <Item>Promote an alert-state of calm</Item>
      <Item>Without drowsy side-effects</Item>
      <Item>Perfect for on-the-go relief</Item>
      <Item>Easy to transport single-use sachets</Item>
    </List>`,
  footer: {
    title: "Add 1 box of Harmony for just",
  },
  header: {
    strapline: "(your dog will thank you for it)",
    title: "Why not add our “Anxiety Beadlets” for on‑the‑go relief?",
  },
  meta: {
    description:
      "Alleviate your dog’s anxiety with our natural, non-drowsy calming supplement. Vet-recommended and made in America it works fast to soothe your dog’s anxiety.",
    title: "Keep Your Dog Calm & Relaxed Whatever The Situation | FOTP",
  },
  opportunity: {
    description:
      "Click below to add 1 box of Harmony to your {{ type }} today for just {{ amount }}",
    title:
      "You have an opportunity to make a real difference to your dog’s health today.",
  },
  testimonial: {
    attribution: "Dolly’s mom",
    quote:
      "We use The One for Dolly’s day-to-day anxieties and general health, but when I know we’re about to go to a stressful situation, like the vet, we give her a little Harmony booster. It’s perfect.",
  },
};

const CartOfferHarmonySecondaryContent: FC = () => {
  const {
    components: { Image },
    selection: {
      frequency,
      variant: {
        computed: { prices },
      },
    },
  } = useCartOfferLayout();
  const formatCurrency = useCurrencyFormatter();
  const { t } = useLocale();

  return (
    <>
      <h2 css={s(headingDeltaStatic)}>
        {t("cartOfferHarmony:opportunity.title")}
      </h2>
      <p
        css={s(bodyTextStatic, (t) => ({
          borderBottomColor: t.color.border.light,
          borderBottomStyle: ["solid", null, null, "none"],
          borderBottomWidth: 1,
          marginBottom: [t.spacing.md, null, t.spacing.lg, t.spacing.md],
          marginTop: t.spacing.sm,
          paddingBottom: [t.spacing.md, null, t.spacing.lg, 0],
        }))}
      >
        {t("cartOfferHarmony:opportunity.description", {
          amount: formatCurrency(prices.currentPrice),
          type: t(
            `cartOfferLayout:orderType.${frequency ? "subscription" : "otp"}`
          ),
        })}
      </p>
      <Image
        _css={s((t) => ({
          display: ["none", null, null, "block"],
          marginBottom: t.spacing.md,
        }))}
      />
      <CartOfferCta />
    </>
  );
};

interface CartOfferHarmonyProps {
  products: Product[];
}

export const CartOfferHarmony: FC<CartOfferHarmonyProps> = ({ products }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "cartOfferHarmony", enUsResource);

  return (
    <>
      <Metadata
        description={t("cartOfferHarmony:meta.description")}
        noindex
        title={t("cartOfferHarmony:meta.title")}
      />
      <CartOfferLayout
        banner={<CartOfferBanner />}
        components={{
          Image({ _css }) {
            return (
              <CartOfferImage _css={_css} image={HARMONY_CART_OFFER_IMG} />
            );
          },
        }}
        footer={<CartOfferFooter title={t("cartOfferHarmony:footer.title")} />}
        header={
          <CartOfferHeader
            strapline={t("cartOfferHarmony:header.strapline")}
            title={t("cartOfferHarmony:header.title")}
          />
        }
        initialSelection={harmonyInitialSelection}
        primary={
          <>
            <CartOfferBody i18nKey="cartOfferHarmony:benefits" />
            <CartOfferTestimonial
              attribution={t("cartOfferHarmony:testimonial:attribution")}
              quote={t("cartOfferHarmony:testimonial:quote")}
            />
          </>
        }
        products={products}
        secondary={<CartOfferHarmonySecondaryContent />}
        type={CartOfferType.SALES}
      />
    </>
  );
};

export default CartOfferHarmony;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: false,
    paths: [
      { params: { handle: "move" } },
      { params: { handle: "soothe" } },
      { params: { handle: "the-one" } },
    ],
  };
};

export const getStaticProps = makeCartOfferStaticPropsGetter({
  products: ["harmony"],
});
