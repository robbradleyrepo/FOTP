import {
  DocumentHyperlinkData,
  Elements,
  FileHyperlinkData,
  HyperlinkData,
  ImageHyperlinkData,
  RichTextBlock,
  WebHyperlinkData,
} from "prismic-reactjs";
import { ReactElement } from "react";

export { Elements };
export type {
  DocumentHyperlinkData,
  FileHyperlinkData,
  HyperlinkData,
  ImageHyperlinkData,
  RichTextBlock,
  WebHyperlinkData,
};

export enum ArticlePageTag {
  BLOG = "Blog",
  CONDITION = "Condition",
  EVIDENCE = "Evidence",
  INGREDIENT = "Ingredient",
  SUPPLEMENT = "Supplement",
}

export type ContentSlice =
  | ImageSlice
  | QuoteSlice
  | RichTextSlice
  | YouTubeSlice;

export enum ContentSliceType {
  IMAGE = "image",
  QUOTE = "quote",
  RICH_TEXT = "rich_text",
  YOUTUBE = "youtube",
}

export interface Customization {
  body: CustomizationSlice[];
}

export interface CustomizationDict {
  [CustomizationSliceType.IMAGE]: Record<string, ImageCustomizationSlice>;
  [CustomizationSliceType.RICH_TEXT]: Record<
    string,
    RichTextCustomizationSlice
  >;
  [CustomizationSliceType.TITLE]: Record<string, TitleCustomizationSlice>;
}

export type CustomizationSlice =
  | ImageCustomizationSlice
  | RichTextCustomizationSlice
  | TitleCustomizationSlice;

export enum CustomizationSliceType {
  IMAGE = "image_customization",
  RICH_TEXT = "rich_text_customization",
  TITLE = "title_customization",
}

export interface DocumentLink {
  _linkType: LinkType.document;
  _meta: Omit<Meta, "lastPublicationDate">;
}

export type ElementRendererDict = Record<Elements, ReactElement | null>;

export interface FileLink {
  _linkType: LinkType.file;
  name: string;
  size: number;
  url: string;
}

export enum HyperlinkType {
  document = "Document",
  media = "Media",
  web = "Web",
}

export interface Image {
  alt: string | null;
  dimensions: {
    height: number;
    width: number;
  };
  url: string;
}

export interface ImageCustomizationSlice extends Slice {
  primary: {
    image: Image | null;
    target: string | null;
  };
  type: CustomizationSliceType.IMAGE;
}

export interface ImageLink {
  _linkType: LinkType.image;
  name: string;
  url: string;
  size: number;
  height: number;
  width: number;
}

export interface ImageSlice extends Slice {
  primary: {
    caption: RichTextBlock[] | null;
    image: Image | null;
    link: Link | null;
  };
  type: ContentSliceType.IMAGE;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export type Link = DocumentLink | FileLink | ImageLink | WebLink;

export enum LinkType {
  document = "Link.document",
  file = "Link.file",
  image = "Link.image",
  web = "Link.web",
}

export interface Meta {
  id: string;
  lang: string;
  lastPublicationDate?: string;
  tags: string[];
  type: string;
  uid?: string;
}

export interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
}

export interface Person extends PrismicDocument {
  image: Image | null;
  name: RichTextBlock[] | null;
  role: RichTextBlock[] | null;
}

export interface PrismicConfig {
  baseUrl: string;
  links: Record<string, string>;
}

export interface PrismicDocument {
  _meta: Meta;
}

export interface QuoteSlice extends Slice {
  label: string | null;
  primary: Record<"attribution" | "quote", RichTextBlock[] | null>;
  type: ContentSliceType.QUOTE;
}

export interface Review extends PrismicDocument {
  body: RichTextBlock[] | null;
  easeOfUse: number | null;
  effectiveness: number | null;
  highlight: RichTextBlock[] | null;
  image: Image | null;
  rating: number | null;
  reviewer: RichTextBlock[] | null;
  title: RichTextBlock[] | null;
}

export interface RichTextSlice extends Slice {
  label: string | null;
  primary: Record<"content", RichTextBlock[]>;
  type: ContentSliceType.RICH_TEXT;
}

export type ResponsiveImage<K extends string> = Image &
  Partial<Record<K, Image>>;

export interface RichTextCustomizationSlice extends Slice {
  primary: {
    richText: RichTextBlock[] | null;
    target: string | null;
  };
  type: CustomizationSliceType.RICH_TEXT;
}

export interface Similar {
  documentId: string;
  max: number;
}
export interface Slice {
  type: string;
}

export type StrictMeta = Meta & Required<Pick<Meta, "uid">>;

export interface TitleCustomizationSlice extends Slice {
  primary: {
    target: string | null;
    title: RichTextBlock[] | null;
  };
  type: CustomizationSliceType.TITLE;
}

export interface YouTubeSlice extends Slice {
  primary: Record<"videoId", string>;
  type: ContentSliceType.YOUTUBE;
}

export interface WebLink {
  _linkType: LinkType.web;
  url: string;
}
