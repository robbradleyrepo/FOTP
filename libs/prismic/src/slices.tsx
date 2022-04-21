import React, { FC } from "react";

import {
  ContentSlice,
  ContentSliceType,
  ImageSlice,
  QuoteSlice,
  RichTextSlice,
  Slice,
  YouTubeSlice,
} from "./types";

export const NullRenderer = <P extends Slice>({ type }: P) => {
  if (process.env.NODE_ENV !== "production") {
    throw new Error(`Missing renderer for "${type}"`);
  }

  return null;
};

export interface ContentSliceRendererComponents {
  FallbackRenderer: FC<Slice>;
  ImageRenderer: FC<ImageSlice>;
  QuoteRenderer: FC<QuoteSlice>;
  RichTextRenderer: FC<RichTextSlice>;
  YouTubeRenderer: FC<YouTubeSlice>;
}

const defaultRenderers: ContentSliceRendererComponents = {
  FallbackRenderer: NullRenderer,
  ImageRenderer: NullRenderer,
  QuoteRenderer: NullRenderer,
  RichTextRenderer: NullRenderer,
  YouTubeRenderer: NullRenderer,
};

type ContentSliceRendererProps = ContentSlice & {
  renderers: Partial<ContentSliceRendererComponents>;
};

export const ContentSliceRenderer: FC<ContentSliceRendererProps> = ({
  renderers,
  ...slice
}) => {
  const {
    FallbackRenderer,
    ImageRenderer,
    QuoteRenderer,
    RichTextRenderer,
    YouTubeRenderer,
  } = {
    ...defaultRenderers,
    ...renderers,
  };

  switch (slice.type) {
    case ContentSliceType.IMAGE:
      return <ImageRenderer {...slice} />;
    case ContentSliceType.QUOTE:
      return <QuoteRenderer {...slice} />;
    case ContentSliceType.RICH_TEXT:
      return <RichTextRenderer {...slice} />;
    case ContentSliceType.YOUTUBE:
      return <YouTubeRenderer {...slice} />;
    default:
      return <FallbackRenderer {...slice} />;
  }
};
