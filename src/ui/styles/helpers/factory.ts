import { CSSProperties } from "styled-components";

import { mq } from "./mq";

export type CSSValue = string | number | null | undefined;
export type ResponsiveCSSValue = CSSValue | CSSValue[];

type ReservedProps<Keys extends string> = {
  readonly [K in Keys]?: boolean;
};

type StyleHelperConfigEntry<K> = {
  readonly prop: K;
  readonly properties: (keyof CSSProperties)[];
};

type StyleHelperConfig<K> = readonly StyleHelperConfigEntry<K>[];

type StyleProps<StyleKeys extends string> = {
  [K in StyleKeys]?: ResponsiveCSSValue;
};

export type StyleHelperProps<
  K extends string,
  R extends string = never
> = StyleProps<K> & ReservedProps<R>;

const factory = <K extends string, R extends string = never>(
  config: StyleHelperConfig<K>,
  responsiveProp?: R
) => <P extends StyleHelperProps<K, R>>(props: P) =>
  mq(
    config.reduce(
      (accum, entry) =>
        (entry.prop in props &&
          entry.properties.reduce((accum, property) => {
            let value = props[entry.prop];

            const responsive =
              typeof responsiveProp === "string" &&
              typeof props[responsiveProp] === "boolean"
                ? props[responsiveProp]
                : true;

            if (!responsive && Array.isArray(value)) {
              [value] = value;
            }

            // Use `Object.assign` instead of the spread operator otherwise we
            // run into issues where the order of generated CSS can be
            // different in Safari than on the server
            return Object.assign({}, accum, {
              [property]: value,
            });
          }, accum)) ||
        accum,
      {}
    )
  );

export default factory;
