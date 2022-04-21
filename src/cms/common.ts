import {
  Image,
  Meta,
  metaFragment,
  Person,
  RichTextBlock,
  StrictMeta,
} from "@sss/prismic";
import gql from "graphql-tag";

import type { Benefits } from "../ui/icons/benefits";

export interface Benefit {
  _meta: StrictMeta;
  icon: keyof Benefits | null;
  name: RichTextBlock[] | null;
  value: RichTextBlock[] | null;
}

export interface Expert extends ExpertCore {
  _meta: Meta;
  bio: RichTextBlock[] | null;
  socialInstagram: string | null;
  socialTwitter: string | null;
  summary: RichTextBlock[] | null;
  qualifications: ExpertQualification[] | null;
}

export interface ExpertQualification {
  course: string | null;
  institution: string | null;
  institutionImage: Image | null;
}

export interface ExpertCore extends Person {
  postNominal: RichTextBlock[] | null;
}

export interface ExpertQuote {
  expert: Expert | null;
  quote: RichTextBlock[] | null;
}
export interface Faq {
  _meta: StrictMeta;
  answer: RichTextBlock[] | null;
  question: RichTextBlock[] | null;
}

export interface Feature {
  callToAction: RichTextBlock[] | null;
  callToActionTarget: string | null;
  description: RichTextBlock[] | null;
  heading: RichTextBlock[] | null;
  image: Image | null;
  imagePlacement: "First" | "Last";
}

export interface Features {
  fields: Feature[] | null;
  type: "features";
}

export interface Info {
  name: string | null;
  value: string | null;
}

export interface Testimonial {
  _meta: Meta;
  attribution: RichTextBlock[] | null;
  image: Image | null;
  quote: RichTextBlock[] | null;
}

export interface VideoTestimonial {
  _meta: Meta;
  caption: RichTextBlock[] | null;
  description: string | null;
  thumbnail: Image | null;
  title: string | null;
  vimeoLink: {
    url: string;
  } | null;
}

export const benefitFragment = gql`
  fragment benefit on PBenefit {
    ...meta
    icon
    name
    value
  }
  ${metaFragment}
`;

export const expertCoreFragment = gql`
  fragment expertCore on PExpert {
    ...meta
    image
    name
    postNominal
    role
  }
  ${metaFragment}
`;

export const expertFragment = gql`
  fragment expert on PExpert {
    ...expertCore
    bio
    socialInstagram
    socialTwitter
    summary
    qualifications {
      course
      institution
      institutionImage
    }
  }
  ${expertCoreFragment}
`;

export const faqFragment = gql`
  fragment faq on PFaq {
    ...meta
    answer
    question
  }
  ${metaFragment}
`;

export const testimonialFragment = gql`
  fragment testimonial on PTestimonial {
    ...meta
    attribution
    image
    quote
  }
  ${metaFragment}
`;

export const videoTestimonialFragment = gql`
  fragment videoTestimonial on PVideoTestimonial {
    ...meta
    caption
    description
    thumbnail
    title
    vimeoLink {
      ... on _ExternalLink {
        url
      }
    }
  }
  ${metaFragment}
`;
