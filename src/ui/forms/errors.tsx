import { FieldErrors } from "@sss/forms";
import React, { FC } from "react";

import { ComponentStyleProps, s } from "@/common/ui/utils";

import { note, NoteType } from "../base/note";

interface ErrorsProps extends ComponentStyleProps {
  errors: FieldErrors;
}

const Errors: FC<ErrorsProps> = ({ _css = {}, errors }) => (
  <ul css={s(note(NoteType.ERROR), _css)} id="payment-error">
    {errors.map((message, index) => (
      <li key={index}>{message}</li>
    ))}
  </ul>
);

export default Errors;
