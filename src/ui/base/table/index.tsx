import React, { FC, ReactNode } from "react";

import { ComponentStyleProps, py, s } from "@/common/ui/utils";

interface SimpleTableProps extends ComponentStyleProps {
  body: Record<"name" | "value", ReactNode>[];
  header: Record<"name" | "value", ReactNode>;
}

const headerCellStyle = s((t) => ({
  paddingBottom: t.spacing.xs,
}));

const SimpleTable: FC<SimpleTableProps> = ({ _css, body, header }) => (
  <table
    css={s(
      (t) => ({
        borderSpacing: `0 ${t.spacing.xxs}px`,
        width: "100%",
      }),
      _css ?? {}
    )}
  >
    <thead
      css={s({
        borderBottomStyle: "solid",
        borderColor: "currentColor",
        borderWidth: 2,
        textAlign: "left",
      })}
    >
      <tr css={s({ whiteSpace: "nowrap" })}>
        <th css={s(headerCellStyle)}>{header.name}</th>
        <th
          css={s(headerCellStyle, {
            textAlign: "right",
          })}
        >
          {header.value}
        </th>
      </tr>
    </thead>
    <tbody>
      {body.map(({ name, value }, index) => (
        <tr
          key={index}
          css={s((t) => ({
            borderBottomStyle: "solid",
            borderColor: t.color.background.dark,
            borderWidth: 1,
            verticalAlign: "bottom",
          }))}
        >
          <th css={s((t) => py(t.spacing.xs))}>{name}</th>
          <td
            css={s((t) => ({
              fontStyle: "italic",
              textAlign: "right",
              ...py(t.spacing.xs),
              whiteSpace: "nowrap",
            }))}
          >
            {value}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default SimpleTable;
