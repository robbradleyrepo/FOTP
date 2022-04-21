import { Product } from "@sss/ecommerce/product";
import { useCurrencyFormatter, useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import { GetStaticPaths } from "next";
import React, { FC } from "react";

import { s } from "@/common/ui/utils";

import OTP_CART_OFFER_IMG from "../../assets/images/offers/the-one-cart-offer-otp.jpg";
import SUB_CART_OFFER_IMG from "../../assets/images/offers/the-one-cart-offer-sub.jpg";
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
import { theOneInitialSelection } from "./constants";

const enUsResource = {
  benefits: `
    <Title>Our bestselling all-in-1 supplement, <NoWrap>The One</NoWrap> helps:</Title>
    <List>
      <Item>Relieve joint stiffness</Item>
      <Item>Support healthy digestion</Item>
      <Item>Soothe itchy skin</Item>
      <Item>Promote fresh breath</Item>
      <Item>Promote mental sharpness</Item>
      <Item>Defend against disease</Item>
      <Item>Relieve stress</Item>
      <Item>Protect heart cells</Item>
    </List>
    <Paragraph>Plus, it works perfectly with Harmony.</Paragraph>
    <Paragraph>It’s vet recommended, and used by thousands of American dog owners every day.</Paragraph>`,
  footer: {
    title: "Add 1 tub of The One for just",
  },
  header: {
    strapline: "(it’s a game-changer for canine health)",
    title:
      "Why not add our bestselling 8‑in‑1 daily supplement to your {{ type }} as well?",
  },
  meta: {
    description:
      "Fight joint discomfort, itchy skin, smelly breath, anxiety, digestive issues & boost immunity with The One. Eight essential benefits in one daily supplement.",
    title: "8 Targeted Health Benefits In 1 Daily Dog Supplement | FOTP",
  },
  opportunity: {
    description:
      "Click below to add 1 tub of The One to your {{ type }} today for just {{ amount }}",
    title:
      "You have an opportunity to make a real difference to your dog's health today.",
  },
  testimonial: {
    attribution: "Churchill’s mom",
    quote:
      "Churchill is one of the fussiest eaters around and he LOVES it. You absolutely have a customer for life.",
  },
};

const CartOfferTheOneHeader: FC = () => {
  const { referrer } = useCartOfferLayout();
  const { t } = useLocale();

  return (
    <CartOfferHeader
      strapline={t("cartOfferTheOne:header.strapline")}
      title={t("cartOfferTheOne:header.title", {
        type: t(
          `cartOfferLayout:orderType.${
            referrer.frequency ? "subscription" : "otp"
          }`
        ),
      })}
    />
  );
};

const CartOfferTheOneSecondaryContent: FC = () => {
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
        {t("cartOfferTheOne:opportunity.title")}
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
        {t("cartOfferTheOne:opportunity.description", {
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

interface CartOfferTheOneProps {
  products: Product[];
}

export const CartOfferTheOne: FC<CartOfferTheOneProps> = ({ products }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "cartOfferTheOne", enUsResource);

  return (
    <>
      <Metadata
        description={t("cartOfferTheOne:meta.description")}
        noindex
        title={t("cartOfferTheOne:meta.title")}
      />
      <CartOfferLayout
        banner={<CartOfferBanner />}
        components={{
          Image({ _css }) {
            const { referrer } = useCartOfferLayout();

            const image = referrer.frequency
              ? SUB_CART_OFFER_IMG
              : OTP_CART_OFFER_IMG;
            return <CartOfferImage _css={_css} image={image} />;
          },
        }}
        footer={<CartOfferFooter title={t("cartOfferTheOne:footer.title")} />}
        header={<CartOfferTheOneHeader />}
        initialSelection={theOneInitialSelection}
        primary={
          <>
            <CartOfferBody i18nKey="cartOfferTheOne:benefits" />
            <CartOfferTestimonial
              attribution={t("cartOfferTheOne:testimonial:attribution")}
              quote={t("cartOfferTheOne:testimonial:quote")}
            />
          </>
        }
        products={products}
        secondary={<CartOfferTheOneSecondaryContent />}
        type={CartOfferType.SALES}
      />
    </>
  );
};

export default CartOfferTheOne;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: false,
    paths: [{ params: { handle: "harmony" } }],
  };
};

export const getStaticProps = makeCartOfferStaticPropsGetter({
  products: ["the-one"],
});
