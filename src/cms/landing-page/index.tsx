import * as ecommerce from "@sss/ecommerce/product";
import {
  Image,
  Link,
  linkFragment,
  metaFragment,
  Person,
  personFragment,
  ResponsiveImage,
  reviewFragment,
  RichTextBlock,
  StrictMeta,
} from "@sss/prismic";
import gql from "graphql-tag";
import React, { createContext, FC, useContext } from "react";
import { MergeExclusive } from "type-fest";

import { Expert, expertCoreFragment } from "../common";
import { Product, productFragment } from "../product";
import { LandingPageSlice } from "./slices";

export enum LandingPageHeaderPublicationDateType {
  NONE = "None",
  YESTERDAY = "Yesterday",
}

export enum LandingPageHeaderSponsoredByType {
  FRONT_OF_THE_PACK = "Front Of The Pack",
  NONE = "None",
}

export enum LandingPageImageStyleType {
  BACKGROUND = "Background",
  CROPPED = "Cropped",
}

export enum LandingPageNavStyleType {
  REVERSE = "Reverse",
  STANDARD = "Standard",
}

export enum LandingPageRichTextLabelType {
  FEATURE_1 = "feature_1",
  FEATURE_2 = "feature_2",
  REVERSE = "reverse",
  STANDARD = "standard",
}

export enum LandingPageSummarySortType {
  HEADER_STRAPLINE_ASC = "header_strapline_ASC",
  HEADER_STRAPLINE_DESC = "header_strapline_DESC",
  HEADER_TITLE_ASC = "header_title_ASC",
  HEADER_TITLE_DESC = "header_title_DESC",
  LEGAL_DISCLAIMER_ASC = "legal_disclaimer_ASC",
  LEGAL_DISCLAIMER_DESC = "legal_disclaimer_DESC",
  META_FIRST_PUBLICATION_DATE_ASC = "meta_firstPublicationDate_ASC",
  META_FIRST_PUBLICATION_DATE_DESC = "meta_firstPublicationDate_DESC",
  META_LAST_PUBLICATION_DATE_ASC = "meta_lastPublicationDate_ASC",
  META_LAST_PUBLICATION_DATE_DESC = "meta_lastPublicationDate_DESC",
  NAV_CTA_TEXT_ASC = "nav_cta_text_ASC",
  NAV_CTA_TEXT_DESC = "nav_cta_text_DESC",
  SEO_DESCRIPTION_ASC = "seo_description_ASC",
  SEO_DESCRIPTION_DESC = "seo_description_DESC",
  SEO_TITLE_ASC = "seo_title_ASC",
  SEO_TITLE_DESC = "seo_title_DESC",
  SOCIAL_MEDIA_DESCRIPTION_ASC = "social_media_description_ASC",
  SOCIAL_MEDIA_DESCRIPTION_DESC = "social_media_description_DESC",
  SOCIAL_MEDIA_TITLE_ASC = "social_media_title_ASC",
  SOCIAL_MEDIA_TITLE_DESC = "social_media_title_DESC",
}

export interface LandingPage {
  _meta: StrictMeta;
  author: Expert | Person | null;
  body: LandingPageSlice[];
  ctaBackgroundColor: string | null;
  ctaDescription: RichTextBlock[] | null;
  ctaImage: Image | null;
  ctaImageStyle: LandingPageImageStyleType | null;
  ctaLink: Link | null;
  ctaText: string | null;
  ctaTitle: RichTextBlock[] | null;
  headerImage: Image | null;
  headerImageHero: ResponsiveImage<"mobile"> | null;
  headerNote: RichTextBlock[] | null;
  headerPressBanner: "None" | "Logos" | "Logos With Links" | null;
  headerPromoBanner: RichTextBlock[] | null;
  headerPublicationDate: LandingPageHeaderPublicationDateType | null;
  headerSponsoredBy: LandingPageHeaderSponsoredByType | null;
  headerStrapline: RichTextBlock[] | null;
  headerTitle: RichTextBlock[] | null;
  legalBannerEnabled: boolean;
  legalDisclaimer: RichTextBlock[] | null;
  navContact: "None" | "Standard" | null;
  navCtaLink: Link | null;
  navCtaText: string | null;
  navEnabled: boolean;
  navLinksEnabled: boolean;
  navShopLink: Link | null;
  navStyle: LandingPageNavStyleType | null;
  product: Product | null;
  seoDescription: string | null;
  seoTitle: string | null;
  socialMediaDescription: string | null;
  socialMediaImage: Image | null;
  socialMediaTitle: string | null;
}

export type LandingPageData = Record<"landingPage", LandingPage>;

export interface LandingPageSummary {
  _meta: StrictMeta;
}

export interface LandingPageSummaryData {
  landingPages: { edges: { node: LandingPageSummary }[] };
}

export interface LandingPageSummaryVariables {
  first?: number;
  sortBy?: LandingPageSummarySortType;
}

export const LANDING_PAGE = gql`
  query LANDING_PAGE($handle: String!) {
    landingPage: pLandingPage(uid: $handle) {
      ...meta
      author {
        ...expertCore
        ...person
      }
      body {
        ... on PLandingPageBodyCta {
          primary {
            link {
              ...link
            }
            text
            type
          }
          type
        }
        ... on PLandingPageBodyEnhancedCta {
          primary {
            backgroundColor
            description
            image
            imageStyle
            link {
              ...link
            }
            text
            title
          }
          type
        }
        ... on PLandingPageBodyImage {
          primary {
            image
            caption
            link {
              ...link
            }
          }
          type
        }
        ... on PLandingPageBodyPlaceholder {
          primary {
            placeholder
          }
          type
        }
        ... on PLandingPageBodyProductReviews {
          fields {
            review {
              ...review
            }
          }
          type
        }
        ... on PLandingPageBodyQuote {
          primary {
            attribution
            quote
          }
          type
        }
        ... on PLandingPageBodyReviewHighlights {
          fields {
            review {
              ...review
            }
          }
          type
        }
        ... on PLandingPageBodyRichText {
          label
          primary {
            content
          }
          type
        }
        ... on PLandingPageBodyYoutube {
          primary {
            videoId
          }
          type
        }
      }
      ctaBackgroundColor
      ctaDescription
      ctaImage
      ctaImageStyle
      ctaLink {
        ...link
      }
      ctaText
      ctaTitle
      headerPublicationDate
      headerPressBanner
      headerPromoBanner
      headerImage
      headerImageHero
      headerNote
      headerSponsoredBy
      headerStrapline
      headerTitle
      legalBannerEnabled
      legalDisclaimer
      navContact
      navCtaLink {
        ...link
      }
      navCtaText
      navEnabled
      navLinksEnabled
      navShopLink {
        ...link
      }
      navStyle
      product {
        ...pProduct
      }
      seoDescription
      seoTitle
      socialMediaDescription
      socialMediaImage
      socialMediaTitle
    }
  }
  ${expertCoreFragment}
  ${linkFragment}
  ${metaFragment}
  ${personFragment}
  ${reviewFragment}
  ${productFragment}
`;

export const LANDING_PAGES = gql`
  query LANDING_PAGES(
    $first: Int = 5
    $sortBy: PSortLandingPagey = meta_lastPublicationDate_DESC
  ) {
    landingPages: pLandingPages(first: $first, sortBy: $sortBy) {
      edges {
        node {
          ...meta
        }
      }
    }
  }
  ${metaFragment}
`;

type ProductDataContextProps = MergeExclusive<
  {
    cms: Product;
    ecommerce: ecommerce.Product;
  },
  { cms: null; ecommerce: null }
>;

const ProductDataContext = createContext<ProductDataContextProps>({
  cms: null,
  ecommerce: null,
});

export const ProductDataProvider: FC<{
  cms: Product | null;
  ecommerce: ecommerce.Product | null;
}> = ({ children, cms, ecommerce }) => (
  <ProductDataContext.Provider
    value={
      cms && ecommerce ? { cms, ecommerce } : { cms: null, ecommerce: null }
    }
  >
    {children}
  </ProductDataContext.Provider>
);

export const useProductData = () => {
  const context = useContext(ProductDataContext);

  if (!context) {
    throw new Error(
      "`useProductData` must be used inside a `ProductDataProvider`"
    );
  }

  return context;
};
