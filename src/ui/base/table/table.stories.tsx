import React from "react";
import cross from "src/ui/icons/cross";
import question from "src/ui/icons/question";
import tick from "src/ui/icons/tick";

import {
  belt,
  beltTight,
  px,
  py,
  s,
  size,
  visuallyHidden,
} from "@/common/ui/utils";

import Icon, { iconBackground, iconBorder } from "../icon";
import { bodyText, headingDeltaStatic, headingEcho } from "../typography";
import SimpleTable from ".";

export default {
  title: "Styles/Table",
};

enum ExampleItemType {
  FALSE = "false",
  TRUE = "true",
  UNKNOWN = "unknown",
}

const exampleItems = [
  {
    name: "item 1",
    them: ExampleItemType.FALSE,
    us: ExampleItemType.TRUE,
    value: "value 1",
  },
  {
    name: "item 2",
    them: ExampleItemType.FALSE,
    us: ExampleItemType.TRUE,
    value: "value 2",
  },
  {
    name: "item 3",
    them: ExampleItemType.FALSE,
    us: ExampleItemType.TRUE,
    value: "value 3",
  },
];

const sectionStyle = s((t) => ({
  "&:first-child": {
    marginTop: 0,
  },
  marginTop: t.spacing.lg,
}));

export const TableSimple = () => (
  <div css={s(beltTight)}>
    <div css={s(sectionStyle)}>
      <h3 css={s(headingDeltaStatic, { position: "absolute" })}>Title</h3>
      <SimpleTable
        body={exampleItems}
        header={{
          name: <span css={s(visuallyHidden)}>Column Header</span>,
          value: (
            <span
              css={s({
                display: "block",
                height: 18,
                lineHeight: 1,
                position: "relative",
              })}
            >
              <span
                css={s({
                  bottom: -1,
                  position: "absolute",
                  right: 0,
                })}
              >
                Column Data
              </span>
            </span>
          ),
        }}
      />
    </div>
  </div>
);

export const TableComparison = () => (
  <div
    css={s(belt, (t) => ({
      borderColor: t.color.tint.algae,
      borderRadius: t.radius.md,
      borderStyle: "solid",
      borderWidth: [0, 0, 1],
      width: "100%",
      ...px([null, null, t.spacing.xxxl]),
      ...py([null, null, null]),
    }))}
  >
    <table
      css={s({
        tableLayout: "fixed",
        width: "100%",
      })}
    >
      <colgroup>
        <col css={s({ width: ["48%", null, "50%"] })} span={1} />
        <col css={s({ width: ["26%", null, "25%"] })} span={1} />
        <col css={s({ width: ["26%", null, "25%"] })} span={1} />
      </colgroup>
      <thead>
        <tr>
          <td />
          <td
            css={s((t) => ({
              ...py([null, null, t.spacing.sm]),
              backgroundColor: t.color.background.feature1,
            }))}
          >
            &nbsp;
          </td>
          <td />
        </tr>
        <tr>
          <td />
          <th
            css={s(headingEcho, (t) => ({
              ...py([null, null, t.spacing.md]),
              backgroundColor: t.color.background.feature1,
              textAlign: "center",
            }))}
          >
            Front of the Pack
          </th>
          <th
            css={s(headingEcho, (t) => ({
              ...py([null, null, t.spacing.md]),
              textAlign: "center",
            }))}
          >
            Others
          </th>
        </tr>
      </thead>
      <tbody>
        {exampleItems.map((item, index) => (
          <tr
            css={s((t) => ({
              borderBottom: `solid 1px ${t.color.tint.algae}`,
            }))}
            key={index}
          >
            <td
              css={s(bodyText, (t) => ({
                fontSize: [14, 16, 18],
                fontWeight: t.font.primary.weight.medium,
                ...py(t.spacing.md),
                paddingRight: t.spacing.md,
                textAlign: "left",
                wordWrap: "break-word",
              }))}
            >
              {item.name}
            </td>
            <td
              css={s((t) => ({
                backgroundColor: t.color.background.feature1,
                color: t.color.state.success,
                ...py(t.spacing.md),
              }))}
            >
              <div>
                <div css={s(iconBackground)}>
                  {item?.us === ExampleItemType.TRUE ? (
                    <Icon
                      _css={s(size([14, null, 16]), { color: "white" })}
                      path={tick}
                      title={"true"}
                    />
                  ) : (
                    <Icon
                      _css={s(size([14, null, 16]), { color: "white" })}
                      path={question}
                      title={"false"}
                    />
                  )}
                </div>
              </div>
            </td>
            <td
              css={s((t) => ({
                color: t.color.tint.sage,
                ...py(t.spacing.md),
              }))}
            >
              <div css={s(iconBorder)}>
                {item.them && item.them === "false" ? (
                  <Icon
                    _css={s(size([14, null, 16]), (t) => ({
                      color: t.color.state.alt,
                    }))}
                    path={cross}
                    title={"False"}
                  />
                ) : (
                  <Icon
                    _css={s(size([14, null, 16]), (t) => ({
                      color: t.color.state.alt,
                    }))}
                    path={question}
                    title={"Unknown"}
                  />
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td />
          <td
            css={s((t) => ({
              ...py([null, null, t.spacing.md]),
              backgroundColor: ["none", "none", t.color.background.feature1],
              display: ["none", "none", "block"],
            }))}
          >
            &nbsp;
          </td>
          <td />
        </tr>
      </tfoot>
    </table>
  </div>
);
