import gql from "graphql-tag";

export interface DogBreed {
  handle: string;
  id: string;
  name: string;
  popularity: number | null;
}

export interface DogBreedsData {
  dogBreeds: DogBreed[];
}

export const dogBreedFragment = gql`
  fragment dogBreed on DogBreed {
    handle
    id
    name
    popularity
  }
`;

export const DOG_BREEDS = gql`
  query DOG_PROFILE($limit: Int = 50, $search: String) {
    dogBreeds(limit: $limit, search: $search) {
      ...dogBreed
    }
  }
  ${dogBreedFragment}
`;
