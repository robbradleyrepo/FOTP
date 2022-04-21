import { throwGraphQLErrors } from "@sss/apollo";
import { getFetchedImageUrl } from "@sss/cloudinary";
import { getProductImages, Product, ProductData } from "@sss/ecommerce/product";
import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { RichTextFragment } from "@sss/prismic";
import { Metadata } from "@sss/seo";
import { GetStaticPaths } from "next";
import React, { FC } from "react";
import { Trans } from "react-i18next";

import { belt, gutter, gutterTop, link, s } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import { RichText } from "../../cms/prismic";
import CmsProductIngredientsInformation from "../../cms/product/ingredients-information";
import type {
  ProductInformationPage as ProductInformationPageType,
  ProductInformationPageData,
} from "../../cms/product-information-page";
import Accordion from "../../ui/base/accordion";
import { primaryButton } from "../../ui/base/button";
import ResponsiveImage from "../../ui/base/responsive-image";
import {
  bodyTextSmall,
  bodyTextSmallStatic,
  bodyTextStatic,
  headingAlpha,
  headingBravo,
  textLink,
} from "../../ui/base/typography";
import ProductServingSizes from "../../ui/modules/products/serving-sizes";
import Standard from "../../ui/templates/standard";

const enUsResource = {
  evidence: {
    cta: "Read about our research",
    description:
      "Our team of experts have evaluated over 450 research publications to develop a range rigorously backed by science. And 350 of those studies contain the exact branded ingredients in our products.",
    title: "Research & evidence",
  },
  faqs: {
    extra: "Can’t find what you need? <Link>View All FAQ’s</Link>",
    title: "Frequently asked questions",
  },
  header: {
    cta: "Buy this product",
  },
  ingredients: {
    title: "Ingredients",
  },
  meta: {
    description:
      "All of the information you’ll ever need, including ingredients, serving guides and other frequently asked questions.",
    title: "{{ title }} - {{ subtitle }} | Product information",
  },
  serving: {
    title: "Serving guide",
  },
  testing: {
    cta: "Read about our testing",
    description: {
      food:
        "At Front of the Pack, everything we do is to keep your dog fit and healthy, which is why we adhere to some of the strictest quality control processes when it comes to our dog food. From the ingredients to manufacturing and packing facilities we use, everything is world-class, not to mention our suppliers are some of the best, most reputable in the business. We’re AAFCO compliant too, so you are safe in the knowledge our air dried dog food is safe for your dog. If you’d like more detail on our testing processes, feel free to email us at <Email>$t(common:email)</Email>.",
      supplements:
        "By putting all of our ingredients under the microscope not once, not twice, but eight separate times, we’re hoping to raise the standards of quality control on the pet supplement industry. Once and for all.",
    },
    title: "Testing & Transparency",
  },
};

interface ProductInformationPageProps {
  cms: ProductInformationPageType;
  ecommerce: Product;
}

export const ProductInformationPage: FC<ProductInformationPageProps> = ({
  cms,
  ecommerce,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "ProductInformationPage", enUsResource);

  const { handle, productType, subtitle, title } = ecommerce;

  const image = getProductImages(ecommerce)[0];

  const imageFallbackSize = 1200;
  const imageHeight = image.height ?? imageFallbackSize;
  const imageWidth = image.width ?? imageFallbackSize;

  const isFood = productType === "Dog Food";
  const isSupplement = productType === "Pet Vitamins & Supplements";

  // Typeguard - we've already checked for this in `getStaticProps`
  if (!cms.product) {
    throw new Error("Missing CMS `product` data");
  }

  const { faqs, product, socialMediaDescription, socialMediaTitle } = cms;

  const seoTitle =
    cms.seoTitle ??
    t("ProductInformationPage:meta.title", {
      subtitle: subtitle?.value ?? productType,
      title,
    });
  const seoDescription =
    cms.seoDescription ?? t("ProductInformationPage:meta.description");

  return (
    <Standard>
      <Metadata
        description={seoDescription ?? t("landingPage:meta.description")}
        openGraph={{
          description: socialMediaDescription ?? seoDescription,
          image: {
            height: imageHeight,
            type: "image/jpeg",
            url: getFetchedImageUrl({
              url: image.url,
              width: imageWidth,
            }),
            width: imageWidth,
          },
          title: socialMediaTitle ?? seoTitle,
        }}
        title={seoTitle}
      />
      <main css={s(bodyTextStatic, gutter)}>
        <div css={s(belt, { maxWidth: [540, null, 840] })}>
          <header
            css={s({
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              position: "relative",
            })}
          >
            <Link
              css={s((t) => ({
                alignItems: "center",
                borderBottomColor: t.color.border.light,
                borderBottomStyle: "solid",
                borderBottomWidth: 1,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "stretch",
                paddingBottom: t.spacing.lg,
                width: "100%",
              }))}
              to={`/products/${handle}`}
            >
              <div
                css={s({
                  flexGrow: 0,
                  flexShrink: 0,
                  width: ["100%", null, 100],
                })}
              >
                <ResponsiveImage
                  _css={s((t) => ({ borderRadius: t.radius.sm }))}
                  alt=""
                  height={image.height ?? 1200}
                  sizes={{ width: ["100vw", null, 100] }}
                  src={image.url}
                  width={image.width ?? 1200}
                />
              </div>
              <div
                css={s((t) => ({
                  flexGrow: 1,
                  flexShrink: 1,
                  marginLeft: [null, null, t.spacing.lg],
                  marginRight: [null, t.spacing.lg],
                  marginTop: [t.spacing.md, null, 0],
                }))}
              >
                <h1
                  css={s(headingAlpha, (t) => ({
                    marginBottom: t.spacing.xxs,
                    whiteSpace: [null, null, "nowrap"],
                  }))}
                  id="product-title"
                >
                  {title}
                </h1>
                {subtitle?.value && (
                  <p
                    css={s((t) => ({
                      fontFamily: t.font.secondary.family,
                      fontStyle: "italic",
                    }))}
                  >
                    {subtitle.value}
                  </p>
                )}
              </div>
            </Link>
            <Link
              css={s(primaryButton(), (t) => ({
                marginTop: t.spacing.lg,
                position: ["static", null, "absolute"],
                top: "100%",
              }))}
              to={`/products/${handle}`}
            >
              {t("ProductInformationPage:header.cta")}
            </Link>
          </header>

          <section css={s(gutterTop)}>
            <h2 css={s(headingBravo, (t) => ({ marginBottom: t.spacing.lg }))}>
              {t("ProductInformationPage:ingredients.title")}
            </h2>
            <CmsProductIngredientsInformation
              _css={s(bodyTextSmallStatic)}
              otherIngredientsCss={s((t) => ({
                "&:first-child": bodyTextStatic(t),
              }))}
              {...product}
            />
          </section>

          <section css={s(gutterTop)}>
            <h2 css={s(headingBravo, (t) => ({ marginBottom: t.spacing.lg }))}>
              {t("ProductInformationPage:serving.title")}
            </h2>
            {product.use && <RichText render={product.use} />}

            {!!product.servingSizes?.length && (
              <ProductServingSizes servingSizes={product.servingSizes} />
            )}

            {product.suitability && (
              <p
                css={s(bodyTextSmallStatic, (t) => ({
                  fontStyle: "italic",
                  marginTop: t.spacing.md,
                }))}
              >
                <RichTextFragment render={product.suitability} />
              </p>
            )}
          </section>

          {isFood && (
            <>
              <section css={s(gutterTop)}>
                <h2
                  css={s(headingBravo, (t) => ({ marginBottom: t.spacing.lg }))}
                >
                  {t("ProductInformationPage:testing.title")}
                </h2>
                <p>
                  <Trans
                    components={{
                      Email: (
                        <a
                          css={s((t) => ({
                            _fontWeight: t.font.primary.weight.medium,
                            textDecoration: "underline",
                          }))}
                          href={`mailto:${t("common:email")}`}
                        />
                      ),
                    }}
                    i18nKey="ProductInformationPage:testing.description.food"
                    values={{ email: t("common:email") }}
                  />
                </p>
              </section>
            </>
          )}

          {isSupplement && (
            <>
              <section css={s(gutterTop)}>
                <h2
                  css={s(headingBravo, (t) => ({ marginBottom: t.spacing.lg }))}
                >
                  {t("ProductInformationPage:testing.title")}
                </h2>
                <p>
                  {t("ProductInformationPage:testing.description.supplements")}
                </p>
                <Link
                  css={s(textLink, link, (t) => ({
                    display: "block",
                    marginTop: t.spacing.md,
                  }))}
                  to="/science/testing-and-transparency"
                >
                  {t("ProductInformationPage:testing.cta")}
                </Link>
              </section>

              <section css={s(gutterTop)}>
                <h2
                  css={s(headingBravo, (t) => ({ marginBottom: t.spacing.lg }))}
                >
                  {t("ProductInformationPage:evidence.title")}
                </h2>
                <p>{t("ProductInformationPage:evidence.description")}</p>
                <Link
                  css={s(textLink, link, (t) => ({
                    display: "block",
                    marginTop: t.spacing.md,
                  }))}
                  to="/science/evidence"
                >
                  {t("ProductInformationPage:evidence.cta")}
                </Link>
              </section>
            </>
          )}

          {faqs?.body?.map(
            (snippet, index) =>
              !!snippet?.fields?.length && (
                <section key={index} css={s(gutterTop)}>
                  <div css={s(belt, { maxWidth: 845 })}>
                    <h2
                      css={s(headingBravo, (t) => ({
                        marginBottom: t.spacing.lg,
                      }))}
                    >
                      {t("ProductInformationPage:faqs.title")}
                    </h2>
                    {snippet.fields.map(
                      ({
                        faq: {
                          _meta: { uid },
                          answer,
                          question,
                        },
                      }) =>
                        answer &&
                        question && (
                          <Accordion
                            key={uid}
                            id={`faq-${uid}`}
                            label={<RichTextFragment render={question} />}
                            labelAs="h3"
                          >
                            <div
                              css={s((t) => ({ marginBottom: t.spacing.md }))}
                            >
                              <RichText render={answer} />
                            </div>
                          </Accordion>
                        )
                    )}
                    <p
                      css={s(bodyTextSmall, (t) => ({
                        marginTop: t.spacing.xl,
                      }))}
                    >
                      <Trans
                        components={{
                          Link: (
                            <Link
                              css={s(textLink, link, (t) => ({
                                fontWeight: t.font.primary.weight.medium,
                              }))}
                              to="/help/faq"
                            />
                          ),
                        }}
                        i18nKey="ProductInformationPage:faqs.extra"
                      />
                    </p>
                  </div>
                </section>
              )
          )}
        </div>
      </main>
    </Standard>
  );
};

export default ProductInformationPage;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: "blocking",
    paths: [{ params: { handle: "the-one" } }],
  };
};

export const getStaticProps = makeStaticPropsGetter(
  async ({ params }, { apolloClient }) => {
    if (typeof params?.handle !== "string") {
      throw new Error('Invalid or missing param "handle"');
    }

    const { PRODUCT_INFORMATION_PAGE } = await import(
      "../../cms/product-information-page"
    );
    const { PRODUCT_BY_HANDLE } = await import("@sss/ecommerce/product");

    const [cmsResult, ecommerceResult] = await Promise.all([
      apolloClient.query<ProductInformationPageData>({
        fetchPolicy: "no-cache",
        query: PRODUCT_INFORMATION_PAGE,
        variables: {
          handle: params.handle,
        },
      }),
      apolloClient.query<ProductData>({
        fetchPolicy: "no-cache",
        query: PRODUCT_BY_HANDLE,
        variables: {
          handle: params.handle,
        },
      }),
    ]);
    throwGraphQLErrors([cmsResult, ecommerceResult]);

    if (
      !cmsResult.data?.productInformationPage &&
      !ecommerceResult.data?.product
    ) {
      return { notFound: true };
    }

    if (!cmsResult.data?.productInformationPage) {
      throw new Error(
        `Missing "ProductInformationPage" with UID "${params.handle}"`
      );
    } else if (!ecommerceResult.data?.product) {
      throw new Error(
        `Missing Shopify product data for handle "${params.handle}"`
      );
    }

    return {
      props: {
        cms: cmsResult.data.productInformationPage,
        ecommerce: ecommerceResult.data.product,
      },
      revalidate: 6 * 60,
    };
  }
);
