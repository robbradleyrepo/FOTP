// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/gorgias.d.ts" />
export interface GorgiasConfig {
  appId?: string;
}

export enum GorgiasLocalStorageKey {
  CHAT_ACCESS_TOKEN = "gorgias.chat-access-token",
  CHAT_LAST_PENDING_MESSAGE = "gorgias.chat-last-pending-message",
  CHAT_LAST_SEEN = "gorgias.chat-last-seen",
  EMAIL_CAPTURED = "gorgias.email-captured",
  SEEN_CAMPAIGNS_IDS = "gorgias.seen-campaigns-ids",
  SSP = "gorgias.ssp",
}

export interface GorgiasExternalConfig {
  application: Required<Window["GORGIAS_CHAT_APP"]>;
  bundleVersion: Required<Window["GORGIAS_CHAT_BUNDLE_VERSION"]>;
  texts: Window["GORGIAS_CHAT_TEXTS"];
}
