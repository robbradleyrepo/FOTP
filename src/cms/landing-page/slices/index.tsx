import {
  ContentSlice,
  ContentSliceRenderer,
  ContentSliceRendererComponents,
  Image,
  Link,
  Review,
  RichTextBlock,
  Slice,
} from "@sss/prismic";
import React, {
  ComponentType,
  createContext,
  FC,
  MouseEvent,
  useContext,
} from "react";

import * as contentRenderers from "../../slices/renderers";
import type { LandingPageImageStyleType } from "../";
import * as landingPageRenderers from "./renderers";

type Cta = {
  link: Link | null;
  text: string | null;
  type: "Enhanced" | "Primary" | "Secondary" | "Sticky";
};

export type CtaClickEventHandler = (cta: Cta, event: MouseEvent) => void;

export interface CtaSlice extends Slice {
  primary: Cta & {
    type: "Primary" | "Secondary";
  };
  type: LandingPageSliceType.CTA;
}

export interface EnhancedCtaSlice extends Slice {
  primary: Omit<Cta, "type"> & {
    backgroundColor: string | null;
    description: RichTextBlock[] | null;
    image: Image | null;
    imageStyle: LandingPageImageStyleType | null;
    title: RichTextBlock[] | null;
  };
  type: LandingPageSliceType.ENHANCED_CTA;
}

export enum LandingPageSliceType {
  CTA = "cta",
  ENHANCED_CTA = "enhanced_cta",
  PLACEHOLDER = "placeholder",
  PRODUCT_REVIEWS = "product_reviews",
  REVIEW_HIGHLIGHTS = "review_highlights",
}

export interface PlaceholderSlice {
  primary: Record<"placeholder", string>;
  type: LandingPageSliceType.PLACEHOLDER;
}

export interface ProductReviewsSlice extends Slice {
  fields: Record<"review", Review | null>[];
  type: LandingPageSliceType.PRODUCT_REVIEWS;
}

export interface ReviewHighlightsSlice extends Slice {
  fields: Record<"review", Review | null>[];
  type: LandingPageSliceType.REVIEW_HIGHLIGHTS;
}

export type LandingPageSlice =
  | ContentSlice
  | CtaSlice
  | EnhancedCtaSlice
  | PlaceholderSlice
  | ProductReviewsSlice
  | ReviewHighlightsSlice;

interface LangingPageSliceRendererComponents {
  CtaRenderer: FC<CtaSlice>;
  EnhancedCtaRenderer: FC<EnhancedCtaSlice>;
  PlaceholderRenderer: FC<PlaceholderSlice>;
  ProductReviewsRenderer: FC<ProductReviewsSlice>;
  ReviewHighlightsRenderer: FC<ReviewHighlightsSlice>;
}

const defaultRenderers: Omit<
  ContentSliceRendererComponents,
  "FallbackRenderer"
> &
  LangingPageSliceRendererComponents = {
  ...contentRenderers,
  ...landingPageRenderers,
};

type LandingPageSliceRendererProps = LandingPageSlice & {
  renderers?: Partial<
    ContentSliceRendererComponents & LangingPageSliceRendererComponents
  >;
};

export const LandingPageSliceRenderer: FC<LandingPageSliceRendererProps> = ({
  renderers,
  ...slice
}) => {
  const combinedRenderers = {
    ...defaultRenderers,
    ...renderers,
  };

  const {
    CtaRenderer,
    EnhancedCtaRenderer,
    PlaceholderRenderer,
    ProductReviewsRenderer,
    ReviewHighlightsRenderer,
  } = combinedRenderers;

  switch (slice.type) {
    case LandingPageSliceType.CTA:
      return <CtaRenderer {...slice} />;
    case LandingPageSliceType.ENHANCED_CTA:
      return <EnhancedCtaRenderer {...slice} />;
    case LandingPageSliceType.PLACEHOLDER:
      return <PlaceholderRenderer {...slice} />;
    case LandingPageSliceType.PRODUCT_REVIEWS:
      return <ProductReviewsRenderer {...slice} />;
    case LandingPageSliceType.REVIEW_HIGHLIGHTS:
      return <ReviewHighlightsRenderer {...slice} />;
    default:
      return <ContentSliceRenderer renderers={combinedRenderers} {...slice} />;
  }
};

interface LandingPageSliceWrapperProps {
  index: number;
  slice: LandingPageSlice;
  slices: LandingPageSlice[];
}

interface LandingPageSliceZoneContextProps {
  onCtaClick?: CtaClickEventHandler;
}

const LandingPageSliceZoneContext = createContext<LandingPageSliceZoneContextProps | null>(
  null
);

const LandingPageSliceZoneContextProvider: FC<LandingPageSliceZoneContextProps> = ({
  children,
  ...value
}) => (
  <LandingPageSliceZoneContext.Provider value={value}>
    {children}
  </LandingPageSliceZoneContext.Provider>
);

export const useLandingPageSliceZoneContext = () => {
  const context = useContext(LandingPageSliceZoneContext);

  if (!context) {
    throw new Error(
      "`useSliceZoneContext` must be used inside a `SliceZoneContextProvider`"
    );
  }

  return context;
};

const Passthrough: FC = ({ children }) => <>{children}</>;

type LandingPageSliceZoneProps = LandingPageSliceZoneContextProps &
  Pick<LandingPageSliceRendererProps, "renderers"> & {
    slices: LandingPageSlice[];
    wrapper?: ComponentType<LandingPageSliceWrapperProps>;
  };

export const LandingPageSliceZone: FC<LandingPageSliceZoneProps> = ({
  renderers,
  slices,
  wrapper: Wrapper = Passthrough,
  ...rest
}) => (
  <LandingPageSliceZoneContextProvider {...rest}>
    {slices.map((slice, index) => (
      <Wrapper key={index} index={index} slice={slice} slices={slices}>
        <LandingPageSliceRenderer renderers={renderers} {...slice} />
      </Wrapper>
    ))}
  </LandingPageSliceZoneContextProvider>
);
