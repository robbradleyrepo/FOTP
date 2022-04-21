import { useCustomer } from "@sss/customer";
import { useLazyScript, useOnInteraction } from "@sss/hooks";
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import store from "store/dist/store.modern";
import { createGlobalStyle } from "styled-components";

import GORGIAS from "./config";
import { GorgiasExternalConfig, GorgiasLocalStorageKey } from "./types";

const EMAIL_CAPTURE_TYPE_KEY = "gorgias:email-capture-type";

const GorgiasStyle = createGlobalStyle<{ visible: boolean }>`
  #chat-button {
    right: 20px;
    bottom: 0;
  }

${({ visible }) => `
  #gorgias-chat-container {
    display: ${visible ? "block" : "none"} !important;
    z-index: 1000 !important;
  }
`}
`;

interface GorgiasContextProps {
  loaded: boolean;
  toggle: (to: boolean) => void;
  visible: boolean;
}

const GorgiasContext = createContext<GorgiasContextProps | null>(null);

const useGorgiasScript = (): ReturnType<typeof useLazyScript> => {
  const { customer, loading } = useCustomer();
  const [
    externalConfig,
    setExtenalConfig,
  ] = useState<GorgiasExternalConfig | null>(null);

  const [loadScript, scriptState] = useLazyScript({
    checkForExisting: true,
    src: externalConfig
      ? `https://storage.googleapis.com/gorgias-chat-production-client-builds/${externalConfig.bundleVersion}/static/js/main.js`
      : "",
  });

  const loadExternalConfig = async () => {
    try {
      const response = await fetch(
        `https://config.gorgias.chat/applications/${GORGIAS.appId}`
      );
      const externalConfig = await response.json?.();

      if (!externalConfig.application || !externalConfig.bundleVersion) {
        throw new Error(
          `Missing fields in the response body - https://config.gorgias.chat/applications/${GORGIAS.appId}`
        );
      }

      setExtenalConfig(externalConfig);
    } catch (error) {
      // Fail silently
    }
  };

  useEffect(() => {
    if (!externalConfig || loading || scriptState.loaded) {
      return;
    }

    // Basic chat config
    window.GORGIAS_CHAT_APP_ID = GORGIAS.appId;
    window.GORGIAS_CHAT_BASE_URL = "us-east1-898b.production.gorgias.chat";
    window.GORGIAS_API_BASE_URL = "config.gorgias.chat";
    window.GORGIAS_CHAT_APP = externalConfig.application;
    window.GORGIAS_CHAT_BUNDLE_VERSION = externalConfig.bundleVersion;
    if (externalConfig.texts) window.GORGIAS_CHAT_TEXTS = externalConfig.texts;

    // Customer details
    try {
      const capturedEmail = window.localStorage.getItem(
        GorgiasLocalStorageKey.EMAIL_CAPTURED
      );

      const emailCaptureType = store.get(EMAIL_CAPTURE_TYPE_KEY);

      if (
        (customer && capturedEmail !== customer.email) || // A new user has logged in since the last chat session
        (!customer && emailCaptureType === "auth") // We previously set the user's email address when they were logged in
      ) {
        // Clear all Gorgias' local storage entries because they don't 🙄
        Object.values(GorgiasLocalStorageKey).forEach((key) =>
          window.localStorage.removeItem(key)
        );
      }

      if (customer) {
        window.GORGIAS_CHAT_CUSTOMER_EMAIL = customer.email;
        store.set(EMAIL_CAPTURE_TYPE_KEY, "auth");
      } else {
        store.remove(EMAIL_CAPTURE_TYPE_KEY);
      }
    } catch (error) {
      // Fail silently
    }

    // SSS-specific config
    window.HIDE_POWERED_BY_GORGIAS = true;

    loadScript();
  }, [externalConfig, loading, loadScript, scriptState.loaded]);

  return [
    () => {
      loadExternalConfig();
    },
    scriptState,
  ];
};

export const GorgiasController: FC = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [loadGorgiasScript, gorgiasScriptState] = useGorgiasScript();

  const toggle = (to: boolean) => {
    if (!GORGIAS.appId) return;

    if (!gorgiasScriptState.loaded) {
      loadGorgiasScript();
    }
    setVisible(to);
  };

  return (
    <GorgiasContext.Provider
      value={{ loaded: gorgiasScriptState.loaded, toggle, visible }}
    >
      {children}
      {GORGIAS.appId && <div id="gorgias-chat-container" />}
      <GorgiasStyle visible={visible} />
    </GorgiasContext.Provider>
  );
};

export const useGorgiasController = () => {
  const context = useContext(GorgiasContext);

  if (!context) {
    throw new Error(
      "`useGorgiasController` must be used inside a `GorgiasController`"
    );
  }

  return context;
};

interface GorgiasWidgetProps {
  delay?: number | false;
}

export const GorgiasWidget: FC<GorgiasWidgetProps> = ({ delay = 15000 }) => {
  const { loaded, toggle, visible } = useGorgiasController();
  const timerRef = useRef<number>();

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  };

  // If the widget hasn't loaded, wait for 15 seconds after the first
  // interaction before displaying the widget
  useOnInteraction(() => {
    if (!loaded && delay) {
      timerRef.current = window.setTimeout(toggle, delay, true);
    }
  });

  // Stopped delayed loading if the visibility is toggled elsewhere
  useEffect(() => {
    clearTimer();
  }, [visible]);

  // If the widget has already loaded, display it straight away
  useEffect(() => {
    if (loaded || !delay) {
      toggle(true);
    }

    return () => {
      toggle(false);
      clearTimer();
    };
  }, []);

  return null;
};
