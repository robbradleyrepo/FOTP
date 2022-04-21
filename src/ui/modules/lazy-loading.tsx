import { useInView } from "@sss/hooks";
import React, { FC } from "react";

import { ComponentStyleProps, s } from "@/common/ui/utils";

interface LazyLoadingProps extends ComponentStyleProps {
  placeholder?: React.ReactNode;
}

const LazyLoading: FC<LazyLoadingProps> = ({
  children,
  placeholder = null,
  _css,
}) => {
  const [ref, inView] = useInView({
    rootMargin: "50%",
    triggerOnce: true,
  });
  return (
    <div css={s(_css ?? {})} ref={ref}>
      {inView ? children : placeholder}
    </div>
  );
};

export default LazyLoading;
