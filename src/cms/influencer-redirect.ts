import {
  hasContent,
  Link,
  linkFragment,
  linkResolver,
  metaFragment,
  RichTextBlock,
  StrictMeta,
} from "@sss/prismic";
import gql from "graphql-tag";

export interface InfluencerRedirect {
  _meta: StrictMeta;
  message: RichTextBlock[] | null;
  discountCode: string | null;
  redirectUrl: Link | null;
}

export interface InfluencerRedirectData {
  influencerRedirect: InfluencerRedirect;
}

export interface TransformedInfluencerRedirect {
  destination: string;
  discountCode: string;
  handle: string;
  message: RichTextBlock[];
}

export const influencerRedirectFragment = gql`
  fragment influencerRedirect on PInfluencerRedirect {
    ...meta
    discountCode
    redirectUrl {
      ...link
    }
    message
  }
  ${linkFragment}
  ${metaFragment}
`;

export const INFLUENCER_REDIRECT = gql`
  query INFLUENCER_REDIRECT($handle: String!) {
    influencerRedirect: pInfluencerRedirect(uid: $handle) {
      ...influencerRedirect
    }
  }
  ${influencerRedirectFragment}
`;

export const transformInfluencerRedirect = ({
  _meta: { uid },
  discountCode,
  message,
  redirectUrl,
}: InfluencerRedirect): TransformedInfluencerRedirect => {
  const errors = [];
  let redirectPath: string | null = null;

  if (!discountCode?.trim()) {
    errors.push("Missing discount code");
  }

  if (!message || !hasContent(message)) {
    errors.push("Missing message");
  }

  if (!redirectUrl) {
    errors.push("Missing redirect URL");
  } else {
    redirectPath = linkResolver(redirectUrl);

    if (!redirectPath?.startsWith("/")) {
      errors.push(
        `Unable to resolve redirect URL: expected relative path, received "${redirectPath}"`
      );
    }
  }

  if (errors.length) {
    throw new Error(
      `Invalid InfluencerData:${errors
        .map((error) => `\n  • ${error}`)
        .join("")}`
    );
  }

  // Typeguard: we've already handled this
  if (!discountCode || !message || !redirectPath) {
    throw new Error("Invalid InfluencerData: unexpected result");
  }

  const uri = new URL(redirectPath, process.env.ORIGIN);

  uri.searchParams.set("influencer", uid);
  uri.searchParams.set("utm_campaign", uid);
  uri.searchParams.set("utm_medium", "share");
  uri.searchParams.set("utm_source", "influencer");

  return {
    destination: uri.toString(),
    discountCode,
    handle: uid,
    message,
  };
};
