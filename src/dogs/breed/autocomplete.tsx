import { useLocale } from "@sss/i18n";
import { NetworkStatus } from "apollo-client";
import debounce from "lodash/debounce";
import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-apollo";

import Autocomplete, { AutocompleteProps } from "../../ui/forms/autocomplete";
import { DOG_BREEDS, DogBreed, DogBreedsData } from "./";

const enUsResource = {
  label: "Choose a breed",
  loading: "Searching…",
  noResults: "No matching breed found",
  placeholder: "Start typing a breed…",
};

type DogBreedAutocompleteProps = Pick<
  AutocompleteProps<DogBreed | null>,
  | "_css"
  | "id"
  | "inputCss"
  | "labelCss"
  | "labelWrapperCss"
  | "name"
  | "onBlur"
  | "onFocus"
  | "onSelectedItemChange"
  | "selectedItem"
> & {
  defaultBreeds: DogBreed[];
  label?: ReactNode;
};

const DogBreedAutocomplete: FC<DogBreedAutocompleteProps> = ({
  _css,
  defaultBreeds,
  id,
  inputCss,
  label,
  labelCss,
  labelWrapperCss,
  name,
  onBlur,
  onFocus,
  onSelectedItemChange,
  selectedItem,
}) => {
  const { i18n, t } = useLocale();
  const [search, setSearch] = useState<string | null>(null);

  i18n.addResourceBundle("en-US", "DogBreedAutocomplete", enUsResource);

  const debouncedSetSearch = useMemo(
    () => debounce(setSearch, 200, { leading: true }),
    [setSearch]
  );

  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  const { data, networkStatus } = useQuery<DogBreedsData>(DOG_BREEDS, {
    skip: !search,
    variables: { limit: 5, search },
  });

  const items = useMemo(
    () =>
      data?.dogBreeds ??
      defaultBreeds
        .filter(
          (item) =>
            !search || item.name.toLowerCase().startsWith(search.toLowerCase())
        )
        .slice(0, 5),
    [data, defaultBreeds, search]
  );

  return (
    <Autocomplete
      _css={_css}
      id={id}
      inputCss={inputCss}
      itemToString={(item) => item?.name ?? ""}
      label={label ?? t("DogBreedAutocomplete:label")}
      labelCss={labelCss}
      labelWrapperCss={labelWrapperCss}
      items={items}
      name={name}
      onBlur={onBlur}
      onFocus={onFocus}
      onInputValueChange={({ inputValue }) =>
        debouncedSetSearch(
          inputValue
            ?.toLowerCase()
            .replace(/[^a-z]+/g, "")
            .trim() || null
        )
      }
      onSelectedItemChange={onSelectedItemChange}
      noResults={
        [NetworkStatus.loading, NetworkStatus.setVariables].includes(
          networkStatus
        )
          ? t("DogBreedAutocomplete:loading")
          : t("DogBreedAutocomplete:noResults")
      }
      placeholder={t("DogBreedAutocomplete:placeholder")}
      selectedItem={selectedItem}
    />
  );
};

export default DogBreedAutocomplete;
