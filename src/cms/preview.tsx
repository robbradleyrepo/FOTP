import { useLocale } from "@sss/i18n";
import React, { FC } from "react";

import { belt, link, s } from "@/common/ui/utils";

const PrismicPreview: FC = () => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "prismic", {
    preview: {
      close: "Return to live site",
      description: "You are now previewing updated site content.",
    },
  });

  const onClose = () => {
    window.location.href = "/api/preview/clear";
  };

  return (
    <aside
      css={s((t) => ({
        backgroundColor: t.color.state.warning,
        bottom: 0,
        color: t.color.text.light.base,
        left: 0,
        padding: t.spacing.sm,
        position: "fixed",
        textAlign: "center",
        width: "100vw", // Use `vw` instead of percentage to match the body width with `scroll: overlay`
        zIndex: 99999,
      }))}
    >
      <p css={s(belt)}>
        {t("prismic:preview.description")}{" "}
        <button
          css={s(link, (t) => ({
            fontWeight: t.font.primary.weight.medium,
          }))}
          onClick={onClose}
        >
          {t("prismic:preview.close")}
        </button>
      </p>
    </aside>
  );
};

export default PrismicPreview;
