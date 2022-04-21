import { Product } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import { GetStaticPaths } from "next";
import React, { FC } from "react";

import { s } from "@/common/ui/utils";

import HARMONY_CART_OFFER_IMG from "../../assets/images/offers/harmony-cart-offer.jpg";
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
};

const CartOfferHarmonyMainSecondaryContent: FC = () => {
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

interface CartOfferHarmonyMainProps {
  products: Product[];
}

export const CartOfferHarmonyMain: FC<CartOfferHarmonyMainProps> = ({
  products,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "CartOfferHarmonyMain", enUsResource);

  return (
    <>
      <Metadata
        description={t("CartOfferHarmonyMain:meta.description")}
        noindex
        title={t("CartOfferHarmonyMain:meta.title")}
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
        footer={
          <CartOfferFooter title={t("CartOfferHarmonyMain:footer.title")} />
        }
        header={
          <CartOfferHeader
            strapline={t("CartOfferHarmonyMain:header.strapline")}
            title={t("CartOfferHarmonyMain:header.title")}
          />
        }
        initialSelection={harmonyInitialSelection}
        primary={
          <>
            <CartOfferBody
              _css={s((t) => ({
                borderBottomColor: t.color.border.light,
                borderBottomStyle: "solid",
                borderBottomWidth: 1,
                marginBottom: t.spacing.lg,
              }))}
              i18nKey="CartOfferHarmonyMain:benefits"
            />
            <CartOfferCta />
          </>
        }
        products={products}
        secondary={<CartOfferHarmonyMainSecondaryContent />}
        type={CartOfferType.MAIN}
      />
    </>
  );
};

export default CartOfferHarmonyMain;

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
