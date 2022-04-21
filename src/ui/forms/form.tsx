import React, { FC, useEffect } from "react";
import { Form as FinalForm } from "react-final-form";
import { MergeExclusive } from "type-fest";

import { ComponentStyleProps, s } from "@/common/ui/utils";

import Errors from "./errors";
import {
  FormProps as FinalFormProps,
  FormRenderProps as BaseFormRenderProps,
} from "./final-form";

interface ChildProps {
  busy: boolean;
  submitSucceeded: boolean;
}

interface RenderProps extends ComponentStyleProps {
  busyAfterSubmit?: boolean;
  children(props: ChildProps): JSX.Element;
  label?: string;
  labelledBy?: string;
}

type FormProps = FinalFormProps &
  RenderProps &
  MergeExclusive<
    {
      label?: string;
    },
    { labelledBy?: string }
  >;

type FormRenderProps = BaseFormRenderProps & RenderProps;

const FormRender: FC<FormRenderProps> = ({
  _css,
  busyAfterSubmit = true,
  children,
  label,
  labelledBy,
  error = [],
  form,
  handleSubmit,
  submitError = [],
  submitSucceeded,
  submitting,
}) => {
  const busy = (busyAfterSubmit && submitSucceeded) || submitting;
  const errorMessages = [...error, ...submitError];

  // Reset the form if the page is loaded from cache. Because
  // `submitSucceeded` to set the `busy` flag we need to make sure that
  // it's reset if the user uses their browser's back button to return
  // to the form
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        form.reset();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return (
    <form
      aria-label={label}
      aria-labelledby={labelledBy}
      css={s(_css ?? {})}
      onSubmit={handleSubmit}
    >
      {!!errorMessages.length && (
        <Errors
          _css={s((t) => ({
            marginBottom: t.spacing.md,
          }))}
          errors={errorMessages}
        />
      )}
      {children({ busy, submitSucceeded })}
    </form>
  );
};

const Form: FC<FormProps> = ({
  _css = {},
  busyAfterSubmit,
  children,
  label,
  labelledBy,
  ...rest
}) => (
  <FinalForm {...rest}>
    {(props: FormRenderProps) => (
      <FormRender
        _css={_css}
        busyAfterSubmit={busyAfterSubmit}
        label={label}
        labelledBy={labelledBy}
        {...props}
      >
        {children}
      </FormRender>
    )}
  </FinalForm>
);

export default Form;
