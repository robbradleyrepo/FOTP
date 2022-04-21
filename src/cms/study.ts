import { Image, Meta, RichTextBlock } from "@sss/prismic";

import { Ingredient } from "./ingredient";

interface Author {
  author: string | null;
}

export interface Study {
  _meta: Meta;
  authors: Author[] | null;
  diagram: Image | null;
  doubleBlind: boolean | null;
  duration: string | null;
  focus: Ingredient | null;
  link: {
    url: string;
  } | null;
  message: RichTextBlock[] | null;
  pageReference: string | null;
  participants: string | null;
  placeboControlled: boolean | null;
  publication: string | null;
  randomised: boolean | null;
  sponsor: string | null;
  title: RichTextBlock[] | null;
  type: RichTextBlock[] | null;
  year: number | null;
}

export interface StudyData {
  study: Study;
}
