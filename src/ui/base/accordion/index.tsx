import { motion } from "framer-motion";
import React, {
  ComponentType,
  FC,
  MouseEventHandler,
  ReactNode,
  useState,
} from "react";

import { ComponentStyleProps, mx, py, s, size } from "@/common/ui/utils";

import chevronDown from "../../icons/chevronDown";
import Icon from "../icon";
import StyledComponentsHelper from "../styled-components-helper";
import { bodyText } from "../typography";

interface CommonAccordionProps extends ComponentStyleProps {
  id: string;
  label: ReactNode;
  labelAs: keyof JSX.IntrinsicElements | ComponentType;
}
export interface AccordionUIProps extends CommonAccordionProps {
  isOpen: boolean;
  onClick: MouseEventHandler;
}

// Based on https://www.w3.org/TR/wai-aria-practices-1.1/#accordion
export const AccordionUI: FC<AccordionUIProps> = ({
  _css = {},
  children,
  id,
  isOpen,
  label,
  labelAs,
  onClick,
}) => {
  /*
   *  Although we don't need to access these IDs outside of this component
   *  it's really difficult to automatically generate unique IDs that are
   *  consistent between server and client - see
   *  https://github.com/facebook/react/issues/15435 and
   *  https://github.com/facebook/react/pull/17322
   */
  const contentId = `${id}-content`;
  const labelId = id;

  return (
    <div
      css={s(
        bodyText,
        {
          borderBottomStyle: "solid",
          borderColor: "rgba(47, 78, 37, 0.15)",
          borderWidth: 1,
        },
        _css
      )}
    >
      <StyledComponentsHelper
        as={
          // We need to cast to any to avoid an `Type instantiation is
          // excessively deep and possibly infinite` error - see
          // https://github.com/microsoft/TypeScript/issues/34933
          labelAs as any // eslint-disable-line @typescript-eslint/no-explicit-any
        }
        css={s((t) => py(t.spacing.xs))}
      >
        <button
          css={s((t) => ({
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            ...py(t.spacing.sm),
            width: "100%",
          }))}
          aria-controls={contentId}
          aria-expanded={isOpen}
          id={labelId}
          onClick={onClick}
        >
          {label}
          <Icon
            _css={s((t) => ({
              flexShrink: 0,
              ...mx(t.spacing.sm),
              ...size(14),
              transform: `rotate(${isOpen ? "-180deg" : "0"})`, // Use 2D transform until Intercom remove negative z-index - see https://community.intercom.com/t/z-index-issue-with-ios-13/1432
              transition: "transform 500ms",
            }))}
            path={chevronDown}
          />
        </button>
      </StyledComponentsHelper>
      <motion.div
        css={s({ overflow: "hidden" })}
        animate={isOpen ? "open" : "closed"}
        aria-labelledby={labelId}
        hidden={!isOpen}
        id={contentId}
        role="region"
        transition={{
          damping: 100,
          mass: 0.5,
          stiffness: 1000,
          type: "spring",
        }}
        variants={{
          closed: { height: 0, transitionEnd: { display: "none" } },
          open: { display: "block", height: "auto" },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export interface AccordionProps extends CommonAccordionProps {
  initiallyOpen?: boolean;
  onClick?: MouseEventHandler;
}

const Accordion: FC<AccordionProps> = ({
  initiallyOpen = false,
  onClick,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  const handleClick: MouseEventHandler = async (...args) => {
    setIsOpen(!isOpen);

    if (onClick) {
      return onClick(...args);
    }
  };

  return <AccordionUI {...rest} isOpen={isOpen} onClick={handleClick} />;
};

export default Accordion;
