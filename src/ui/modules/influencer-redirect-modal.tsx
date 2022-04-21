import { useLocale } from "@sss/i18n";
import React, { FC } from "react";

import { gutter, my, s } from "@/common/ui/utils";

import { TransformedInfluencerRedirect } from "../../cms/influencer-redirect";
import { OpinionatedRichText } from "../../cms/prismic";
import { primaryButton } from "../base/button";
import Modal, { ModalType } from "../base/modal";
import { bodyText, headingBravo } from "../base/typography";

const enUsResource = {
  continue: "Continue",
  thanks: "Thank you",
};

interface InfluencerRedirectModalProps {
  influencerRedirect: TransformedInfluencerRedirect;
  open: boolean;
  setIsOpen: (open: boolean) => void;
}

const InfluencerRedirectModal: FC<InfluencerRedirectModalProps> = ({
  influencerRedirect,
  open,
  setIsOpen,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "InfluencerRedirectModal", enUsResource);

  return (
    <Modal
      _css={s(bodyText, gutter, {
        height: "auto",
        maxWidth: [480, null, 520],
        textAlign: "center",
      })}
      labelledBy="influencer-modal-title"
      onClose={() => setIsOpen(false)}
      open={open}
      type={ModalType.POPUP}
    >
      <h2 css={s(headingBravo)} id="influencer-modal-title">
        {t("InfluencerRedirectModal:thanks")}
      </h2>
      <div css={s((t) => my([t.spacing.md, null, t.spacing.lg, t.spacing.xl]))}>
        <OpinionatedRichText render={influencerRedirect.message} />
      </div>
      <button
        css={s(primaryButton())}
        onClick={() => setIsOpen(false)}
        type="button"
      >
        {t("InfluencerRedirectModal:continue")}
      </button>
    </Modal>
  );
};

export default InfluencerRedirectModal;
