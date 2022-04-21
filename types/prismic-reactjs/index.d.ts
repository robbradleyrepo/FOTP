declare module "prismic-reactjs" {
  import { FC } from "react";

  interface DocumentHyperlinkData {
    id: string;
    lang: string;
    link_type: "Document";
    tags: string[];
    type: string;
    uid: string;
  }

  enum Elements {
    em = "em",
    embed = "embed",
    heading1 = "heading1",
    heading2 = "heading2",
    heading3 = "heading3",
    heading4 = "heading4",
    heading5 = "heading5",
    heading6 = "heading6",
    hyperlink = "hyperlink",
    image = "image",
    label = "label",
    list = "group-list-item",
    listItem = "list-item",
    oList = "group-o-list-item",
    oListItem = "o-list-item",
    paragraph = "paragraph",
    preformatted = "preformatted",
    span = "span",
    strong = "strong",
  }

  type HtmlSerializer = (
    type: Elements,
    element: ImageRichTextSpan | RichTextParsedSpan,
    content: string | null,
    children: React.ReactNode,
    key: number
  ) => React.ReactElement | null;

  interface MediaHyperlinkData {
    link_type: "Media";
    kind: "document" | "image";
    name: string;
    size: string;
    url: string;
  }

  interface FileHyperlinkData extends MediaHyperlinkData {
    kind: "document";
  }

  type HyperlinkData =
    | DocumentHyperlinkData
    | FileHyperlinkData
    | ImageHyperlinkData
    | WebHyperlinkData;

  interface HyperlinkRichTextSpan extends RichTextSpan {
    data: HyperlinkData;
    type: Elements.hyperlink;
  }

  interface ImageHyperlinkData extends MediaHyperlinkData {
    kind: "image";
    height: string;
    width: string;
  }

  interface ImageRichTextSpan {
    alt: string | null;
    dimensions: Record<"height" | "width", number>;
    type: Elements.image;
    url: string;
  }

  const RichText: FC<{
    htmlSerializer?: HtmlSerializer;
    render: RichTextBlock[];
  }> & {
    asText: (block: RichTextBlock[]) => string;
  };

  type RichTextBlock = {
    spans: RichTextSpan[];
    text: string;
    type: string;
  };

  type RichTextParsedSpan = (RichTextSpan | HyperlinkRichTextSpan) & {
    text: string;
  };

  interface RichTextSpan {
    end: number;
    start: number;
    type: Exclude<Elements, Elements.hyperlink | Elements.image>;
  }

  interface WebHyperlinkData {
    link_type: "Web";
    url: string;
  }
}
