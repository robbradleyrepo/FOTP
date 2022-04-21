import { useLocale } from "@sss/i18n";
import React, { FC } from "react";
import { Trans } from "react-i18next";

import { belt, gutter, mx, py, s, useTheme } from "@/common/ui/utils";

import { Grid, Item } from "../base/grid";
import {
  bodyTextSmall,
  headingCharlie,
  headingDelta,
  textLink,
} from "../base/typography";
import LeadForm from "./lead-form";
import SocialIcons from "./social-icons";

const enUsResource = {
  group: {
    link: "Facebook Group",
    text: "Get expert vet advice in our",
  },
  subtitle: "Follow us",
  title: "Subscribe to receive news, tips and <i>unconditional love.</i>",
};

const PreFooter: FC = () => {
  const { i18n, t } = useLocale();
  const theme = useTheme();

  i18n.addResourceBundle("en-US", "prefooter", enUsResource);

  return (
    <div
      css={s(gutter, (t) => ({
        backgroundColor: t.color.tint.pistachio,
        color: t.color.text.dark.base,
        ...py([t.spacing.xxl, null, 96]),
        textAlign: ["center", null, null, "left"],
      }))}
    >
      <div
        css={s(belt, {
          maxWidth: 1440,
        })}
      >
        <Grid gx={theme.spacing.md} gy={theme.spacing.xl}>
          <Item width={["100%", null, null, "50%"]}>
            <h3
              css={s(headingCharlie, (t) => ({
                marginBottom: [t.spacing.lg, null, null, t.spacing.xl],
              }))}
            >
              <Trans i18nKey="prefooter:title" />
            </h3>
            <LeadForm
              _css={s({
                maxWidth: [420, null, 500, 600],
                ...mx(["auto", null, null, 0]),
              })}
              event="dl_subscribe"
              source="Footer Form"
            />
          </Item>

          <Item width={["100%", null, null, "50%"]}>
            <div
              css={s(belt, {
                maxWidth: 400,
                ...mx("auto"),
              })}
            >
              <h3
                css={s(headingDelta, (t) => ({
                  marginBottom: [t.spacing.md, null, t.spacing.lg],
                  marginTop: t.spacing.xs,
                }))}
              >
                {t("prefooter:subtitle")}
              </h3>
              <SocialIcons
                _css={s((t) => ({
                  display: "flex",
                  justifyContent: ["center", null, null, "flex-start"],
                  marginBottom: t.spacing.lg,
                  marginTop: t.spacing.lg,
                }))}
                size={32}
              />
              <p css={s(bodyTextSmall)}>
                {t("prefooter:group.text")}{" "}
                <a
                  css={s(textLink)}
                  href="https://www.facebook.com/groups/expertcaninehealthtipsandtricks"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("prefooter:group.link")}
                </a>
              </p>
            </div>
          </Item>
        </Grid>
      </div>
    </div>
  );
};

export default PreFooter;
