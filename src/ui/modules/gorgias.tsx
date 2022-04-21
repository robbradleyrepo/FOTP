import { GorgiasWidget as BaseGorgiasWidget } from "@sss/gorgias";
import React from "react";

import { useModalState } from "../base/modal";

const GorgiasWidget: typeof BaseGorgiasWidget = (props) => {
  const isModalOpen = useModalState();

  return !isModalOpen ? <BaseGorgiasWidget {...props} /> : null;
};

export default GorgiasWidget;
