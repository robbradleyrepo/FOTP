import { motion } from "framer-motion";
import React, {
  ComponentType,
  createContext,
  FC,
  MouseEventHandler,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MergeExclusive } from "type-fest";

import { ComponentStyleProps, s } from "@/common/ui/utils";

import { bodyText } from "../typography";

// https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html
interface TabsContextProps {
  currentTabId: string;
  getTabEl: (id: string) => HTMLButtonElement | undefined;
  getTabIds: () => string[];
  setCurrentTabId: (id: string) => void;
  setTabEl: (id: string, el: HTMLButtonElement | null) => void;
}

const TabsContext = createContext<TabsContextProps | null>(null);

interface TabsProps extends ComponentStyleProps {
  initialTabId: string;
}

export const Tabs: FC<TabsProps> = ({ _css = {}, children, initialTabId }) => {
  const tabMapRef = useRef(new Map<string, HTMLButtonElement>());
  const [currentTabId, setCurrentTabId] = useState(initialTabId);

  // The insertion order of the tab elements should return the desired tab
  // order for most use cases, but may cause problems if the tabs are
  // dynamically updates without the `Tabs` provider unmounting.
  const getTabIds = () => [...tabMapRef.current.keys()];

  const getTabEl = (id: string) => tabMapRef.current.get(id);
  const setTabEl = (id: string, el: HTMLButtonElement | null) => {
    if (el) {
      tabMapRef.current.set(id, el);
    } else {
      tabMapRef.current.delete(id);
    }
  };

  return (
    <TabsContext.Provider
      value={{ currentTabId, getTabEl, getTabIds, setCurrentTabId, setTabEl }}
    >
      <div css={s(_css)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const useTabs = () => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("`useTabs` must be used inside a `Tabs` provider");
  }

  return context;
};

type TabListProps = ComponentStyleProps &
  MergeExclusive<
    {
      label: string;
    },
    { labelledBy: string }
  >;

export const TabList: FC<TabListProps> = ({
  _css = {},
  children,
  label,
  labelledBy,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { currentTabId, getTabEl, getTabIds, setCurrentTabId } = useTabs();

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    const handleKeydown = ({ keyCode }: KeyboardEvent) => {
      const ids = getTabIds();
      const currentIndex = ids.indexOf(currentTabId);

      let newId;

      if (keyCode === 37) {
        // User pressed ←
        newId = ids[(ids.length + currentIndex - 1) % ids.length];
      } else if (keyCode === 39) {
        // User pressed →
        newId = ids[(currentIndex + 1) % ids.length];
      }

      if (newId) {
        setCurrentTabId(newId);

        const newEl = getTabEl(newId);

        if (newEl) newEl.focus();
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, [currentTabId, getTabEl, getTabIds, isFocused, setCurrentTabId]);

  return (
    <div
      css={s(
        (t) => ({
          marginBottom: t.spacing.md,
        }),
        _css
      )}
      aria-label={label}
      aria-labelledby={labelledBy}
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      role="tablist"
    >
      {children}
    </div>
  );
};

interface TabTextProps {
  active: boolean;
}

const DefaultTabText: FC<TabTextProps> = ({ active, children }) => (
  <span
    css={s(bodyText, (t) => ({
      fontWeight: t.font.primary.weight.medium,
      opacity: active ? 1 : 0.5,
      textDecoration: active ? "underline" : "none",
      transition: "opacity 500ms",
    }))}
  >
    {children}
  </span>
);

interface TabRenderProps extends TabTextProps {
  Component: ComponentType<TabTextProps>;
}

interface TabProps extends ComponentStyleProps {
  children: ((props: TabRenderProps) => JSX.Element) | ReactNode;
  Component?: ComponentType<TabTextProps>;
  id: string;
  onClick?: MouseEventHandler;
}

export const Tab = ({
  _css = {},
  children,
  Component = DefaultTabText,
  id,
  onClick,
}: TabProps) => {
  const { currentTabId, setCurrentTabId, setTabEl } = useTabs();

  const active = id === currentTabId;
  const handleClick: MouseEventHandler = (...args) => {
    setCurrentTabId(id);

    if (onClick) {
      return onClick(...args);
    }
  };

  return (
    <button
      css={s(
        (t) => ({
          "&:last-child": { marginRight: 0 },
          marginRight: t.spacing.lg,
          verticalAlign: "bottom",
        }),
        _css
      )}
      aria-controls={`${id}-tab`}
      aria-selected={active}
      id={id}
      onClick={handleClick}
      ref={(el: HTMLButtonElement | null) => setTabEl(id, el)}
      role="tab"
      tabIndex={active ? 0 : -1}
    >
      {typeof children === "function" ? (
        <>{children({ Component, active })}</>
      ) : (
        <Component active={active}>{children}</Component>
      )}
    </button>
  );
};

interface TabPanelProps extends ComponentStyleProps {
  id: string;
}

export const TabPanel: FC<TabPanelProps> = ({ _css = {}, children, id }) => {
  const { currentTabId } = useTabs();

  const active = id === currentTabId;

  return (
    <motion.div
      css={s(_css, {
        display: "inline-block !important", // We need to use `!important` to override the value set using the `[hidden]` selector
        marginRight: "-100%", // Use the right margin to counteract the width of the element so it occupies zero width
        verticalAlign: "top",
        width: "100%",
      })}
      initial={active ? "show" : "hide"}
      animate={active ? "show" : "hide"}
      aria-labelledby={id}
      hidden={!active}
      id={`${id}-tab`}
      role="tabpanel"
      variants={{
        hide: {
          opacity: 0,
          transitionEnd: {
            visibility: "hidden",
          },
        },
        show: {
          opacity: 1,
          visibility: "visible",
        },
      }}
      tabIndex={0}
    >
      {children}
    </motion.div>
  );
};
