import { HtmlSerializer, RichText as PrismicRichText } from "prismic-reactjs";
import React, { cloneElement, FC, Fragment, useMemo } from "react";

import { linkNormalizer, LinkResolver } from "./link-resolver";
import { ElementRendererDict, Elements, RichTextBlock } from "./types";

export const renderAsString = PrismicRichText.asText;

// Use (a more more rigorous version of) the test recommended by Prismic
// support - see
// https://community.prismic.io/t/how-to-tell-if-a-richtextblock-field-is-empty/2711/6
export const hasContent = (
  richText: RichTextBlock[] | null | undefined
): richText is RichTextBlock[] =>
  !!richText && (richText.length > 1 || !!richText[0]?.text.trim().length);

interface RichTextProps {
  components?: Partial<ElementRendererDict>;
  render: RichTextBlock[];
}

// We want to avoid customising embed, hyperlink, label and span as they
// are quite messy to implement - see
// https://prismic.io/docs/reactjs/beyond-the-api/html-serializer#7_0-example-with-all-elements
const useDefaultComponents = (): ElementRendererDict =>
  useMemo(
    () => ({
      [Elements.em]: <em />,
      [Elements.embed]: null,
      [Elements.heading1]: <h1 />,
      [Elements.heading2]: <h2 />,
      [Elements.heading3]: <h3 />,
      [Elements.heading4]: <h4 />,
      [Elements.heading5]: <h5 />,
      [Elements.heading6]: <h6 />,
      [Elements.hyperlink]: <LinkResolver />,
      [Elements.image]: null,
      [Elements.label]: null,
      [Elements.list]: <ul />,
      [Elements.listItem]: <li />,
      [Elements.oList]: <ol />,
      [Elements.oListItem]: <li />,
      [Elements.paragraph]: <p />,
      [Elements.preformatted]: <pre />,
      [Elements.span]: null,
      [Elements.strong]: <strong />,
    }),
    []
  );

export const RichText: FC<RichTextProps> = ({ components, render }) => {
  const defaultComponents = useDefaultComponents();

  const renderComponents = { ...defaultComponents, ...components };

  const htmlSerializer: HtmlSerializer = (
    _type,
    element,
    _content,
    children,
    key
  ) => {
    const renderComponent = renderComponents[element.type];

    if (!renderComponent) {
      return null;
    }

    let props = {};

    switch (element.type) {
      case Elements.hyperlink:
        props = { link: linkNormalizer(element.data) };
        break;
      case Elements.image:
        props = element;
        break;
    }

    return cloneElement(renderComponent, { ...props, key }, children);
  };

  return <PrismicRichText htmlSerializer={htmlSerializer} render={render} />;
};

// We want to use bold and italics in our titles, but when we enable this in
// Prismic it wraps everything in a `paragraph` tag. We'll avoid this by
// using `Fragment` as the default component for block-level elements
export const RichTextFragment: FC<RichTextProps> = ({
  components,
  ...rest
}) => {
  const defaultComponents = useDefaultComponents();

  const defaultFragmentComponents = useMemo(
    () =>
      [
        Elements.heading1,
        Elements.heading2,
        Elements.heading3,
        Elements.heading4,
        Elements.heading5,
        Elements.heading6,
        Elements.list,
        Elements.listItem,
        Elements.oList,
        Elements.oListItem,
        Elements.paragraph,
        Elements.preformatted,
      ].reduce(
        (accum, key) => ({ ...accum, [key]: <Fragment /> }),
        defaultComponents
      ),
    [defaultComponents]
  );

  return (
    <RichText
      {...rest}
      components={{
        ...defaultFragmentComponents,
        ...components,
      }}
    />
  );
};
