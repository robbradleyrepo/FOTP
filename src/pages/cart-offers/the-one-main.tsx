import { Product } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import { GetStaticPaths } from "next";
import React, { FC } from "react";

import { s } from "@/common/ui/utils";

import OTP_CART_OFFER_IMG from "../../assets/images/offers/the-one-cart-offer-otp.jpg";
import SUB_CART_OFFER_IMG from "../../assets/images/offers/the-one-cart-offer-sub.jpg";
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
};

const CartOfferTheOneMainHeader: FC = () => {
  const { referrer } = useCartOfferLayout();
  const { t } = useLocale();

  return (
    <CartOfferHeader
      strapline={t("CartOfferTheOneMain:header.strapline")}
      title={t("CartOfferTheOneMain:header.title", {
        type: t(
          `cartOfferLayout:orderType.${
            referrer.frequency ? "subscription" : "otp"
          }`
        ),
      })}
    />
  );
};

const CartOfferTheOneMainSecondaryContent: FC = () => {
  const {
    components: { Image },
  } = useCartOfferLayout();

  return (
    <Image
      _css={s({
        display: ["none", null, null, "block"],
      })}
    />
  );
};

interface CartOfferTheOneMainProps {
  products: Product[];
}

export const CartOfferTheOneMain: FC<CartOfferTheOneMainProps> = ({
  products,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "CartOfferTheOneMain", enUsResource);

  return (
    <>
      <Metadata
        description={t("CartOfferTheOneMain:meta.description")}
        noindex
        title={t("CartOfferTheOneMain:meta.title")}
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
        footer={
          <CartOfferFooter title={t("CartOfferTheOneMain:footer.title")} />
        }
        header={<CartOfferTheOneMainHeader />}
        initialSelection={theOneInitialSelection}
        primary={
          <>
            <CartOfferBody
              _css={s((t) => ({
                borderBottomColor: t.color.border.light,
                borderBottomStyle: "solid",
                borderBottomWidth: 1,
                marginBottom: t.spacing.lg,
              }))}
              i18nKey="CartOfferTheOneMain:benefits"
            />
            <CartOfferCta />
          </>
        }
        products={products}
        secondary={<CartOfferTheOneMainSecondaryContent />}
        type={CartOfferType.MAIN}
      />
    </>
  );
};

export default CartOfferTheOneMain;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: false,
    paths: [{ params: { handle: "harmony" } }],
  };
};

export const getStaticProps = makeCartOfferStaticPropsGetter({
  products: ["the-one"],
});
