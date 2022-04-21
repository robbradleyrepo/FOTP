import { useLocale } from "@sss/i18n";
import { AnimatePresence, motion } from "framer-motion";
import React, {
  createContext,
  FC,
  MouseEventHandler,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ComponentStyleProps,
  px,
  py,
  s,
  size,
  useTheme,
} from "@/common/ui/utils";

import cross from "../../icons/cross";
import Icon from "../icon/";

const enUsResource = {
  controls: {
    close: "Close",
  },
};

export enum ToastType {
  ERROR = "ERROR",
  INFO = "INFO",
  WARNING = "WARNING",
}

export const TOAST_TIMEOUT = {
  [ToastType.ERROR]: 5000,
  [ToastType.INFO]: 8000,
  [ToastType.WARNING]: 8000,
};

export interface ToastData {
  children: ReactNode;
  type?: ToastType;
}

interface ToastDataExtended extends ToastData {
  id: string;
  type: ToastType;
}

interface ToastContextProps {
  current?: ToastDataExtended;
  dismiss: MouseEventHandler;
  push: (data: ToastData) => void;
}

const ToastContext = createContext<ToastContextProps | null>(null);

export const ToastController: FC = ({ children }) => {
  const { i18n } = useLocale();
  const toastArrayRef = useRef<ToastDataExtended[]>([]);
  const [current, setCurrent] = useState<ToastDataExtended | undefined>(
    toastArrayRef.current[0]
  );

  i18n.addResourceBundle("en-US", "toast", enUsResource);

  const update = () => setCurrent(toastArrayRef.current[0]);

  const dismiss = () => {
    toastArrayRef.current = toastArrayRef.current.slice(1);
    update();
  };

  const push = ({ children, type = ToastType.INFO }: ToastData) => {
    toastArrayRef.current = [
      ...toastArrayRef.current,
      {
        children,
        id: Math.random().toString(16).substr(2, 8), // Generate a random ID so we can distinguish between toasts
        type,
      },
    ];
    update();
  };

  useEffect(() => {
    if (!current) {
      return;
    }

    const timerId = setTimeout(dismiss, TOAST_TIMEOUT[current.type]);

    return () => clearTimeout(timerId);
  }, [current]);

  return (
    <ToastContext.Provider value={{ current, dismiss, push }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastController = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "`useToastController` must be used inside a `ToastController`"
    );
  }

  return context;
};

interface ToastProps extends ToastData {
  onClose: MouseEventHandler;
}

const Toast: FC<ToastProps> = ({
  children,
  onClose,
  type = ToastType.INFO,
}) => {
  const { t } = useLocale();
  const theme = useTheme();

  const backgroundColor = {
    [ToastType.ERROR]: theme.color.state.error,
    [ToastType.INFO]: theme.color.background.dark,
    [ToastType.WARNING]: theme.color.state.warning,
  }[type];

  return (
    <div
      css={s((t) => ({
        backgroundColor: backgroundColor,
        borderRadius: t.radius.xs,
        boxShadow:
          "0px 3px 4px rgba(0, 0, 0, 0.15), 0px 0px 10px rgba(0, 0, 0, 0.25)",
        color: t.color.text.light.base,
        paddingLeft: t.spacing.sm,
        paddingRight: t.spacing.lg,
        ...py(12),
        pointerEvents: "auto",
        position: "relative",
      }))}
      role="alert"
    >
      {children}
      <button
        css={s({
          padding: 4,
          position: "absolute",
          right: 14,
          ...size(20),
          top: 14,
        })}
        onClick={onClose}
      >
        <Icon
          _css={s({
            verticalAlign: "top",
          })}
          path={cross}
          title={t("toast:controls.close")}
        />
      </button>
    </div>
  );
};

export const ToastRack: FC<ComponentStyleProps> = ({ _css }) => {
  const { current, dismiss } = useToastController();

  return (
    <div
      css={s(
        {
          maxWidth: 400,
          pointerEvents: "none",
          position: "relative",
          width: "100%",
        },
        _css ?? {}
      )}
    >
      <AnimatePresence>
        {current && (
          <motion.div
            css={s((t) => ({
              paddingTop: [t.spacing.xs, null, t.spacing.sm],
              ...px([t.spacing.sm, null, t.spacing.lg]),
              position: "absolute",
              width: "100%",
            }))}
            key={current.id}
            animate={{ opacity: 1, transition: { duration: 0.5 }, x: 0, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.3 }, y: "-100%" }}
            initial={{ opacity: 0, x: "100%" }}
            transition={{ ease: "anticipate" }}
          >
            <Toast {...current} onClose={dismiss} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
