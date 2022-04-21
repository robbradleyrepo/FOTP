import { useLocale } from "@sss/i18n";
import { RichTextFragment } from "@sss/prismic";
import React, { FC } from "react";

import { belt, s } from "@/common/ui/utils";

import { Field } from "../../../cms/faq-page";
import { RichText } from "../../../cms/prismic";
import Accordion from "../../base/accordion";
import { bodyText, headingAlpha } from "../../base/typography";

const enUsResource = {
  title: "Frequently asked questions",
};

interface FAQProps {
  faq: {
    fields: Field[] | null;
  };
}

const FAQs: FC<FAQProps> = ({ faq }) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "faqs", enUsResource);

  return (
    <div
      css={s(belt, {
        maxWidth: 1024,
      })}
    >
      <h2
        css={s(headingAlpha, (t) => ({
          marginBottom: [t.spacing.xl, null, t.spacing.xxl],
          textAlign: "center",
        }))}
      >
        {t("faqs:title")}
      </h2>
      {faq?.fields?.map(
        ({ faq }) =>
          faq?.answer &&
          faq?.question && (
            <Accordion
              key={faq._meta.uid}
              id={`faq-${faq._meta.uid}`}
              label={<RichTextFragment render={faq.question} />}
              labelAs="h3"
            >
              <div css={s(bodyText, (t) => ({ marginBottom: t.spacing.md }))}>
                <RichText render={faq.answer} />
              </div>
            </Accordion>
          )
      )}
    </div>
  );
};

export default FAQs;
