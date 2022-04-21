import { metaFragment, RichTextBlock, StrictMeta } from "@sss/prismic";
import gql from "graphql-tag";

import { FaqCategorySnippet, faqCategorySnippetFragment } from "./snippets";
import { Study } from "./study";

export enum AdditionalContent {
  HIDE_ALL = "Hide all",
  SHOW_ALL = "Show all",
}

export enum BundlePickerDisplayType {
  CLICK = "On click",
  DELAY = "After delay",
}

export enum NavContactType {
  NONE = "None",
  STANDARD = "Standard",
}

export enum NavLogoType {
  NONE = "None",
  STANDARD = "Standard",
}

export enum VideoSalesLetterLayoutType {
  FULLSCREEN = "Fullscreen",
  STANDARD = "Standard",
}
export interface VideoSalesLetter {
  _meta: StrictMeta;
  additionalContent: AdditionalContent;
  bundlePickerDelay: number | null;
  bundlePickerDisplayType: BundlePickerDisplayType;
  customPageTitle: RichTextBlock[] | null;
  faqs: FaqCategorySnippet | null;
  layout: VideoSalesLetterLayoutType | null;
  legalBannerEnabled: boolean;
  navContact: NavContactType | null;
  navLogo: NavLogoType | null;
  publishedOn: string | null;
  references: {
    studies: { study: Study | null }[] | null;
  } | null;
  transcript: { _meta: StrictMeta } | null; // We'll lazy-load the transcript because it's huge
  vidalyticsVideoId: string | null;
}

export type VideoSalesLetterData = Record<"videoSalesLetter", VideoSalesLetter>;

export type VideoSalesLetterTranscript = Pick<
  VideoSalesLetter,
  "legalBannerEnabled" | "navContact" | "navLogo"
> & {
  _meta: StrictMeta;
  transcript: { transcript: RichTextBlock[] };
};

export type VideoSalesLetterTranscriptData = Record<
  "videoSalesLetter",
  VideoSalesLetterTranscript
>;

const videoSalesLetterHeaderFragment = gql`
  fragment videoSalesLetterHeader on PVideoSalesLetter {
    legalBannerEnabled
    navContact
    navLogo
  }
`;

export const VIDEO_SALES_LETTER = gql`
  query VIDEO_SALES_LETTER($handle: String!) {
    videoSalesLetter: pVideoSalesLetter(uid: $handle) {
      ...meta
      ...videoSalesLetterHeader
      additionalContent
      bundlePickerDelay
      bundlePickerDisplayType
      customPageTitle
      faqs {
        ...faqCategorySnippet
      }
      layout
      publishedOn
      references {
        ... on PReferences {
          studies {
            study {
              ... on PStudy {
                ...meta
                authors {
                  author
                }
                link {
                  ... on _ExternalLink {
                    url
                  }
                }
                publication
                pageReference
                title
                year
              }
            }
          }
        }
      }
      transcript {
        ...meta
      }
      vidalyticsVideoId
    }
  }
  ${faqCategorySnippetFragment}
  ${metaFragment}
  ${videoSalesLetterHeaderFragment}
`;

export const VIDEO_SALES_LETTER_TRANSCRIPT = gql`
  query VIDEO_SALES_LETTER_TRANSCRIPT($handle: String!) {
    videoSalesLetter: pVideoSalesLetter(uid: $handle) {
      ...meta
      ...videoSalesLetterHeader
      transcript {
        ... on PVideoTranscript {
          transcript
        }
      }
    }
  }
  ${metaFragment}
  ${videoSalesLetterHeaderFragment}
`;
