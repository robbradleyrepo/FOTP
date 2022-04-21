import { useLocale } from "@sss/i18n";
import React, { FC } from "react";
import { Grid, Item } from "src/ui/base/grid";
import Icon from "src/ui/base/icon";
import { bodyText, headingDelta } from "src/ui/base/typography";
import benefitIcons from "src/ui/icons/benefits";
import { StyleProps } from "src/ui/styles/helpers";
import { spacing } from "src/ui/styles/variables";

import { my, percentage, px, s, size } from "@/common/ui/utils";

const enUsResource = {
  items: {
    brainText:
      "Promotes blood flow to the brain and stimulates, mental alertness helping your pet think faster and react quicker.",
    brainTitle: "The Brain",
    dentalText:
      "Reduces the build-up of plaque, and supports healthy gums while giving your pooch minty-fresh breath all day long",
    dentalTitle: "Dental Health",
    gutText:
      "Helps deliver positive results in both weight management and supporting healthy gut bacteria.",
    gutTitle: "Gut health",
    heartText:
      "Helps to protect heart cells and sustains healthy function. This keeps your dog strong, active and full of energy.",
    heartTitle: "Heart",
    immText:
      "Optimizes disease-fighting cells to help defend against unwanted problems and maintain overall health.",
    immTitle: "Greater Immunity",
    jointsText:
      "Relieves stiffness and protects cartilage, aiding your dog to get up and down with ease, and enjoy longer walks",
    jointsTitle: "Joints & Mobility",
    relaxText:
      "Promotes a state of relaxation and alleviates anxiety without any snoozy side effects in as little as 90 minutes",
    relaxTitle: "Relaxation",
    skinText:
      "Helps keep a glossy coat on your dog and soothes itchy skin while supporting hair growth. ",
    skinTitle: "Skin & Coat",
  },
};

const benefitsArray = [
  {
    icon: benefitIcons.joints,
    keyText: "jointsText",
    keyTitle: "jointsTitle",
  },
  {
    icon: benefitIcons.calming,
    keyText: "relaxText",
    keyTitle: "relaxTitle",
  },
  {
    icon: benefitIcons.digestion,
    keyText: "gutText",
    keyTitle: "gutTitle",
  },
  {
    icon: benefitIcons.skinCoat,
    keyText: "skinText",
    keyTitle: "skinTitle",
  },
  {
    icon: benefitIcons.dental,
    keyText: "dentalText",
    keyTitle: "dentalTitle",
  },
  {
    icon: benefitIcons.brain,
    keyText: "brainText",
    keyTitle: "brainTitle",
  },
  {
    icon: benefitIcons.protect,
    keyText: "immText",
    keyTitle: "immTitle",
  },
  {
    icon: benefitIcons.heart,
    keyText: "heartText",
    keyTitle: "heartTitle",
  },
];

const BenefitsGridCustom: FC<StyleProps> = () => {
  const { i18n, t } = useLocale();
  i18n.addResourceBundle("en-US", "BenefitsGridCustom", enUsResource);

  return (
    <Grid
      _css={s((t) => ({ marginTop: t.spacing.xl, textAlign: "center" }))}
      gx={spacing.md}
      gy={[spacing.md, null, spacing.xl]}
      itemWidth={["100%", null, percentage(1 / 2)]}
    >
      {benefitsArray.map(({ icon, keyText, keyTitle }, index) => (
        <Item key={index}>
          <figure
            css={s((t) => ({
              backgroundColor: t.color.background.feature3,
              borderRadius: t.radius.lg,
              ...px(t.spacing.sm),
              ...my(t.spacing.md),
              textAlign: "left",
            }))}
          >
            <div
              css={s({
                transform: "translateY(-50px)",
              })}
            >
              <Icon
                _css={s((t) => ({
                  backgroundColor: t.color.background.feature4,
                  borderRadius: "50%",
                  color: "white",
                  marginBottom: t.spacing.md,
                  padding: t.spacing.xs,
                  ...size(100),
                }))}
                path={icon}
              />
              <figcaption>
                <h3
                  css={s(headingDelta, (t) => ({ marginBottom: t.spacing.sm }))}
                >
                  {t(`BenefitsGridCustom:items.${keyTitle}`)}
                </h3>
                <p css={s(bodyText)}>
                  {t(`BenefitsGridCustom:items.${keyText}`)}
                </p>
              </figcaption>
            </div>
          </figure>
        </Item>
      ))}
    </Grid>
  );
};

export default BenefitsGridCustom;
