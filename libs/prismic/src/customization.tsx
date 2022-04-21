import { getFetchedImageSrcSet, getFetchedImageUrl } from "@sss/cloudinary";
import React, { createContext, FC, useContext } from "react";

import { RichText, RichTextFragment } from "./rich-text";
import {
  CustomizationDict,
  CustomizationSlice,
  CustomizationSliceType,
  ElementRendererDict,
  ImageCustomizationSlice,
  RichTextCustomizationSlice,
  TitleCustomizationSlice,
} from "./types";

export const toCustomizationDictionary = (
  slices: CustomizationSlice[]
): CustomizationDict => {
  const dictionary: CustomizationDict = {
    image_customization: {},
    rich_text_customization: {},
    title_customization: {},
  };

  slices.forEach((slice) => {
    // Only include slices that have a target; this prevents errors due to
    // incorrectly set up customization slices and will also exclude any slice
    //  types that aren't handled in our `CUSTOMIZATION` query
    if (slice.primary?.target) {
      dictionary[slice.type][slice.primary.target] = slice;
    }
  });

  return dictionary;
};

interface CustomizationContextProps {
  dictionary?: CustomizationDict;
}

const CustomizationContext = createContext<CustomizationContextProps | null>(
  null
);

export const CustomizationProvider: FC<CustomizationContextProps> = ({
  children,
  ...rest
}) => {
  return (
    <CustomizationContext.Provider value={rest}>
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);

  if (!context) {
    throw new Error(
      "`useCustomization` must be used inside a `CustomizationProvider`"
    );
  }

  return context;
};

type CustomizerProps = {
  target: string;
} & (
  | {
      renderer: FC<ImageCustomizationSlice>;
      type: CustomizationSliceType.IMAGE;
    }
  | {
      renderer: FC<RichTextCustomizationSlice>;
      type: CustomizationSliceType.RICH_TEXT;
    }
  | {
      renderer: FC<TitleCustomizationSlice>;
      type: CustomizationSliceType.TITLE;
    }
);

const Customizer: FC<CustomizerProps> = ({
  children,
  renderer,
  target,
  type,
}) => {
  const { dictionary } = useCustomization();

  const slice = dictionary?.[type]?.[target];

  // Cast to `any` to work around TypeScript limitations, as the
  // `CustomizerProps` and `CustomizationDict` types guarantee we'll have the
  // right type of renderer for the slice
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Renderer = renderer as any;

  return slice ? <Renderer {...slice} /> : <>{children}</>;
};

interface CustomzationProps {
  target: string;
}

type ImageCustomizationProps = CustomzationProps & {
  width: number;
} & ({ sizes: string; widths: number[] } | { sizes?: never; widths?: never });

export const ImageCustomization: FC<ImageCustomizationProps> = ({
  sizes,
  width,
  widths,
  ...rest
}) => (
  <Customizer
    {...rest}
    renderer={({ primary }) =>
      primary.image ? (
        <img
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: `css` prop has only been enabled at app level
          css={{ maxWidth: "100%" }}
          src={getFetchedImageUrl({ url: primary.image.url, width })}
          srcSet={
            widths && getFetchedImageSrcSet({ url: primary.image.url, widths })
          }
          sizes={sizes}
        />
      ) : null
    }
    type={CustomizationSliceType.IMAGE}
  />
);

interface RichTextCustomizationProps extends CustomzationProps {
  components?: Partial<ElementRendererDict>;
  target: string;
}

export const RichTextCustomization: FC<RichTextCustomizationProps> = ({
  components,
  ...rest
}) => (
  <Customizer
    {...rest}
    renderer={({ primary }) =>
      primary.richText ? (
        <RichText components={components} render={primary.richText} />
      ) : null
    }
    type={CustomizationSliceType.RICH_TEXT}
  />
);

export const TitleCustomization: FC<CustomzationProps> = ({ ...rest }) => (
  <Customizer
    {...rest}
    renderer={({ primary }) =>
      primary.title ? <RichTextFragment render={primary.title} /> : null
    }
    type={CustomizationSliceType.TITLE}
  />
);
