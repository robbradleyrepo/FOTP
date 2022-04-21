import { useLocale } from "@sss/i18n";
import { Link } from "@sss/next";
import { AnimatePresence, motion } from "framer-motion";
import React, { FC } from "react";

import {
  belt,
  ComponentStyleProps,
  gutterSpacingX,
  py,
  s,
} from "@/common/ui/utils";

import Icon from "../../../base/icon";
import Logo from "../../../base/logo";
import Progress from "../../../base/progress";
import { headingDeltaStatic } from "../../../base/typography";
import drawerClose from "../../../icons/drawerClose";

const enUsResource = {
  back: "Back",
};

const hidden = { opacity: 0 };
const visible = { opacity: 1 };

interface FoodPlanHeaderProps extends ComponentStyleProps {
  back?: string | null;
  onClick?: () => void;
  progress: number;
}

const FoodPlanHeader: FC<FoodPlanHeaderProps> = ({
  _css,
  onClick,
  back,
  progress,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "FoodPlanHeader", enUsResource);

  return (
    <header css={s({ textAlign: "center" }, _css ?? {})}>
      <div
        css={s(belt, (t) => ({
          ...py([t.spacing.xs, null, t.spacing.sm]),
          position: "relative",
        }))}
      >
        <AnimatePresence initial={false}>
          {back && (
            <motion.div
              animate={visible}
              css={s((t) => ({
                left: gutterSpacingX(t),
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
              }))}
              exit={hidden}
              initial={hidden}
              transition={{ duration: 0.3 }}
            >
              <Link onClick={onClick} to={back}>
                <Icon
                  _css={s({ width: 32 })}
                  title={t("FoodPlanHeader:back")}
                  path={drawerClose}
                  viewBox="0 0 32 32"
                />
                <span
                  aria-hidden
                  css={s(headingDeltaStatic, (t) => ({
                    display: ["none", null, "inline-block"],
                    marginLeft: t.spacing.sm,
                    verticalAlign: "middle",
                  }))}
                >
                  {t("FoodPlanHeader:back")}
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <Link css={s({})} prefetch={false} to="/">
          <Logo
            _css={s({
              height: [48, null, 60],
              width: "auto",
            })}
            fill="currentColor"
          />
        </Link>
      </div>
      <Progress
        _css={s({ borderRadius: 0, height: [4, null, 6], width: "100%" })}
        progress={progress}
      />
    </header>
  );
};

export default FoodPlanHeader;
