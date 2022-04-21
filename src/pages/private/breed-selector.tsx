import { runServerSideQuery, throwGraphQLErrors } from "@sss/apollo";
import { useLocale } from "@sss/i18n";
import { Metadata } from "@sss/seo";
import React, { FC, Fragment, useState } from "react";
import { headingAlpha, headingCharlie } from "src/ui/base/typography";

import { belt, gutter, s } from "@/common/ui/utils";

import { makeStaticPropsGetter } from "../../../pages/_app";
import { DOG_BREEDS, DogBreed, DogBreedsData } from "../../dogs/breed";
import DogBreedAutocomplete from "../../dogs/breed/autocomplete";

const enUsResource = {
  selection: {
    handle: "Handle",
    name: "Name",
    none: "None selected",
    title: "Selected breed",
  },
  title: "Dog breed lookup",
};

interface BreedSelectorPageProps {
  dogBreeds: DogBreed[];
}

const BreedSelectorPage: FC<BreedSelectorPageProps> = ({ dogBreeds }) => {
  const { i18n, t } = useLocale();
  const [selectedItem, setSelectedItem] = useState<DogBreed | null>(null);

  i18n.addResourceBundle("en-US", "BreedSelectorPage", enUsResource);

  return (
    <>
      <Metadata noindex title={t("BreedSelectorPage:title")} />
      <main css={s(gutter)}>
        <div css={s(belt, { maxWidth: 480 })}>
          <h1 css={s(headingAlpha, (t) => ({ marginBottom: t.spacing.md }))}>
            {t("BreedSelectorPage:title")}
          </h1>
          <form>
            <DogBreedAutocomplete
              _css={s((t) => ({ marginBottom: t.spacing.md }))}
              defaultBreeds={dogBreeds}
              id="breed-selector-page-autocomplete"
              name="breed"
              onSelectedItemChange={({ selectedItem }) =>
                setSelectedItem(selectedItem ?? null)
              }
              selectedItem={selectedItem}
            />
          </form>
          <h2 css={s(headingCharlie, (t) => ({ marginBottom: t.spacing.sm }))}>
            {t("BreedSelectorPage:selection.title")}
          </h2>
          {selectedItem ? (
            <dl>
              {(["name", "handle"] as (keyof DogBreed)[]).map((key) => (
                <Fragment key={key}>
                  <dt
                    css={s((t) => ({
                      "&:after": {
                        content: "':'",
                      },
                      float: "left",
                      fontWeight: t.font.primary.weight.bold,
                      marginRight: "0.2em",
                    }))}
                  >
                    {t(`BreedSelectorPage:selection.${key}`)}
                  </dt>
                  <dd>{selectedItem[key]}</dd>
                </Fragment>
              ))}
            </dl>
          ) : (
            <p>{t("BreedSelectorPage:selection.none")}</p>
          )}
        </div>
      </main>
    </>
  );
};

export default BreedSelectorPage;

export const getStaticProps = makeStaticPropsGetter<BreedSelectorPageProps>(
  async (_context, { apolloClient }) => {
    const result = await runServerSideQuery<DogBreedsData>(
      apolloClient,
      DOG_BREEDS
    );

    throwGraphQLErrors(result);

    return {
      props: {
        dogBreeds: result.data.dogBreeds,
      },
      revalidate: 60,
    };
  }
);
