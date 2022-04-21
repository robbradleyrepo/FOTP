import React, { ComponentPropsWithoutRef, ElementType } from "react";

type StyledComponentsHelperProps<
  T extends ElementType
> = ComponentPropsWithoutRef<T> & {
  as: T;
  css?: unknown;
};

const StyledComponentsHelper = <T extends ElementType>({
  as: Tag,
  css, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...rest
}: StyledComponentsHelperProps<T>) => <Tag {...rest} />;

export default StyledComponentsHelper;
