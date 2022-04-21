import { useMutation } from "@apollo/react-hooks";
import { captureException } from "@sentry/nextjs";
import { dataLayerTrack } from "@sss/analytics";
import { throwGraphQLErrors } from "@sss/apollo";
import gql from "graphql-tag";
import { NextRouter, useRouter } from "next/router";
import { useEffect } from "react";

export enum FeedbackSentiment {
  HAPPY = "HAPPY",
  SAD = "SAD",
}

interface FeedbackOrder {
  email: string | null;
  id: string;
  lineItems: {
    id: string;
    title: string;
    sku: string;
    variantTitle: string;
  }[];
  orderId: number;
  name: string;
}

export interface FeedbackOrderInput {
  // orderId is a BigInt. For old browsers we can pass this around as a string.
  id: string;
  sentiment: FeedbackSentiment;
  hash: string;
}

export const FEEDBACK_ORDER = gql`
  mutation FEEDBACK_ORDER(
    $hash: String!
    $id: Long!
    $sentiment: FeedbackSentiment!
  ) {
    feedbackOrder(orderId: $id, sentiment: $sentiment, hash: $hash) {
      email
      id
      lineItems {
        id
        title
        sku
        variantTitle
      }
      name
      orderId
    }
  }
`;

export type TypeformSurveyLookup = [RegExp, string][];

export const getTypeformSurveyURL = (
  lookup: TypeformSurveyLookup,
  feedback: FeedbackOrder,
  sentiment: FeedbackSentiment
) => {
  for (const [regex, url] of lookup) {
    if (feedback.lineItems.find((item) => regex.test(item.sku))) {
      const params = new URLSearchParams();
      params.set("email", feedback.email ?? "");
      params.set("order_name", feedback.name);
      params.set("sentiment", sentiment);
      params.set("skus", feedback.lineItems.map((item) => item.sku).join("|"));

      return `${url}#${params}`;
    }
  }
};

const getQsData = (
  router: NextRouter
): { hash: string; id: string } | undefined => {
  const hash = router.query.hash;
  const id = router.query.id;

  if (typeof hash === "string" && typeof id == "string") {
    return { hash, id };
  }
};

export const useCaptureOrderFeedbackOnPageLoad = ({
  fallbackSurveyUrl,
  sentiment,
  surveyLookup,
}: {
  fallbackSurveyUrl: string;
  sentiment: FeedbackSentiment;
  surveyLookup: TypeformSurveyLookup;
}):
  | {
      data: FeedbackOrder;
      status: "SUCCESS";
      surveyUrl: string;
    }
  | { status: "LOADING"; surveyUrl: undefined }
  | { status: "FAILED"; surveyUrl: string } => {
  // Note: we'll only capture order feedback once.
  // It's assumed sentiment is a constant.

  const [captureFeedback, result] = useMutation<
    {
      feedbackOrder: FeedbackOrder;
    },
    FeedbackOrderInput
  >(FEEDBACK_ORDER);
  const router = useRouter();

  useEffect(() => {
    const data = getQsData(router);

    if (!data || result.called) {
      return;
    }

    (async () => {
      try {
        const result = await captureFeedback({
          variables: {
            ...data,
            sentiment,
          },
        });
        throwGraphQLErrors(result);

        const feedbackOrder = result.data?.feedbackOrder;

        if (feedbackOrder) {
          dataLayerTrack({
            event: "order_feedback",
            orderName: feedbackOrder.name,
            sentiment,
            shopifyOrderId: data.id,
            skus: feedbackOrder.lineItems.map((item) => item.sku),
          });
        }
      } catch (err) {
        captureException(err);
      }
    })();
  }, [
    router,
    result,
    captureFeedback,
    router.query.hash,
    router.query.id,
    sentiment,
  ]);

  if (result.data?.feedbackOrder) {
    return {
      data: result.data.feedbackOrder,
      status: "SUCCESS",
      surveyUrl:
        getTypeformSurveyURL(
          surveyLookup,
          result.data.feedbackOrder,
          sentiment
        ) ?? fallbackSurveyUrl,
    };
  } else if (router.isReady || result.data || result.error) {
    return {
      status: "FAILED",
      surveyUrl: fallbackSurveyUrl,
    };
  } else {
    return {
      status: "LOADING",
      surveyUrl: undefined,
    };
  }
};
