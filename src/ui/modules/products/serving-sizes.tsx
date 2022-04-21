import { useLocale } from "@sss/i18n";
import React, { FC, ReactNode } from "react";

import { ComponentStyleProps, py, s } from "@/common/ui/utils";

import { headingEchoStatic } from "../../base/typography";

const enUsResource = {
  header: {
    serving: "Serving / day",
    weight: "Dog weight",
  },
};

interface ProductServingSizesProps extends ComponentStyleProps {
  servingSizes: Record<"name" | "value", ReactNode>[];
}

const ProductServingSizes: FC<ProductServingSizesProps> = ({
  _css = {},
  servingSizes,
}) => {
  const { i18n, t } = useLocale();

  i18n.addResourceBundle("en-US", "ProductServingSizes", enUsResource);

  return (
    <table
      css={s(
        {
          width: "100%",
        },
        _css
      )}
    >
      <thead css={s(headingEchoStatic)}>
        <tr
          css={s((t) => ({
            borderBottomColor: t.color.border.light,
            borderBottomStyle: "solid",
            borderBottomWidth: 1,
          }))}
        >
          <th css={s((t) => ({ paddingBottom: t.spacing.xs }))}>
            {t("ProductServingSizes:header.weight")}
          </th>
          <th
            css={s((t) => ({
              paddingBottom: t.spacing.xs,
              textAlign: "right",
            }))}
          >
            {t("ProductServingSizes:header.serving")}
          </th>
        </tr>
      </thead>
      <tbody>
        {servingSizes.map(({ name, value }, index) => (
          <tr
            key={index}
            css={s((t) => ({
              borderBottomColor: t.color.border.light,
              borderBottomStyle: "dashed",
              borderBottomWidth: 1,
              verticalAlign: "baseline",
            }))}
          >
            <th css={s((t) => py(t.spacing.xs))}>{name}</th>
            <td
              css={s((t) => ({
                ...py(t.spacing.xs),
                textAlign: "right",
              }))}
            >
              {value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductServingSizes;
