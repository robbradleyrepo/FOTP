import { Product } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import { GetStaticPaths } from "next";
import React, { FC } from "react";

import { s } from "@/common/ui/utils";

import CART_OFFER_IMG from "../../assets/images/offers/treats-cart-offer.jpg";
import CartOfferBanner from "../../ui/modules/cart-offer/banner";
import CartOfferCta from "../../ui/modules/cart-offer/cta";
import { makeCartOfferStaticPropsGetter } from "../../ui/modules/cart-offer/data";
import CartOfferFooter from "../../ui/modules/cart-offer/footer";
import CartOfferHeader from "../../ui/modules/cart-offer/header";
import CartOfferImage from "../../ui/modules/cart-offer/image";
import CartOfferLayout, {
  CartOfferType,
  useCartOfferLayout,
} from "../../ui/modules/cart-offer/layout";
import CartOfferPicker from "../../ui/modules/cart-offer/picker";
import CartOfferTestimonial from "../../ui/modules/cart-offer/testimonial";
import { treatsInitialSelection } from "./constants";

const enUsResource = {
  footer: {
    title: "Add {{ bundleSize }} of treats for just",
  },
  header: {
    strapline: "Your dog will thank you for it!",
    title: "Why not spoil your pup with our tasty new treats?",
  },
  meta: {
    description:
      "Simple, nutritious low-carb treats loaded with protein to support your dog’s health.",
    title: "Try our all-natural, freeze-dried & grain-free dog treats | FOTP",
  },
  picker: {
    product: {
      label: "Choose a flavour:",
    },
    variant: {
      label: "Save with a bundle:",
    },
  },
  testimonial: {
    attribution: "Izzy’s mom",
    quote:
      "Izzy LOVES your treats and we love that they’re healthy for her. The fact they’re freeze-dried USDA meat and fish is a bonus. She gets one every day!",
  },
};

const CartOfferTreatsFooterContent: FC = () => {
  const { selection } = useCartOfferLayout();
  const { t } = useLocale();

  return (
    <CartOfferFooter
      title={t("CartOfferTreats:footer.title", {
        bundleSize: selection.variant.title.toLowerCase(),
      })}
    />
  );
};

const CartOfferTreatsSecondaryContent: FC = () => {
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

interface CartOfferTreatsProps {
  products: Product[];
}

export const CartOfferTreats: FC<CartOfferTreatsProps> = ({ products }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "CartOfferTreats", enUsResource);

  return (
    <>
      <Metadata
        description={t("CartOfferTreats:meta.description")}
        noindex
        title={t("CartOfferTreats:meta.title")}
      />
      <CartOfferLayout
        banner={<CartOfferBanner />}
        components={{
          Image({ _css }) {
            return <CartOfferImage _css={_css} image={CART_OFFER_IMG} />;
          },
        }}
        footer={<CartOfferTreatsFooterContent />}
        header={
          <CartOfferHeader
            strapline={t("CartOfferTreats:header.strapline")}
            title={t("CartOfferTreats:header.title")}
          />
        }
        initialSelection={treatsInitialSelection}
        primary={
          <>
            <CartOfferTestimonial
              attribution={t("CartOfferTreats:testimonial:attribution")}
              quote={t("CartOfferTreats:testimonial:quote")}
            />
            <CartOfferPicker
              _css={s((t) => ({
                borderBottomColor: t.color.border.light,
                borderBottomStyle: "solid",
                borderBottomWidth: 1,
                marginBottom: t.spacing.md,
                marginTop: t.spacing.xl,
                paddingBottom: t.spacing.lg,
              }))}
              labels={{
                product: t("CartOfferTreats:picker.product.label"),
                variant: t("CartOfferTreats:picker.variant.label"),
              }}
            />
            <CartOfferCta />
          </>
        }
        products={products}
        secondary={<CartOfferTreatsSecondaryContent />}
        type={CartOfferType.SALES}
      />
    </>
  );
};

export default CartOfferTreats;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: "blocking",
    paths: [],
  };
};

export const getStaticProps = makeCartOfferStaticPropsGetter({
  products: [
    "free-range-beef-tripe-dog-treats",
    "wild-alaskan-salmon-dog-treats",
    "farm-raised-rabbit-dog-treats",
    "variety-pack-dog-treats",
  ],
});
