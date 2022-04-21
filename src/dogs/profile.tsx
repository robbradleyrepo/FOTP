import { useLocale } from "@sss/i18n";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";

import { DogBreed, dogBreedFragment } from "./breed";

export interface DogProfile {
  activityLevel: DogProfileActivityLevel;
  ageMonths: number;
  breed: DogBreed | null;
  condition: DogProfileCondition;
  estimatedAgeMonths: number;
  id: string;
  name: string;
  neutered: boolean;
  sex: DogProfileSex;
  uuid: string;
  weightLb: number;
}

export enum DogProfileActivityLevel {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  WORKING = "WORKING",
}

export enum DogProfileCondition {
  UNDERWEIGHT = "UNDERWEIGHT",
  IDEAL = "IDEAL",
  CHUNKY = "CHUNKY",
  OVERWEIGHT = "OVERWEIGHT",
}

export type DogProfileCreateInput = Omit<
  DogProfile,
  "breed" | "estimatedAgeMonths" | "id" | "uuid"
> & {
  breedId: string | null;
};

export interface DogProfileData {
  dogProfile: DogProfile;
}

export type DogProfileUpdateInput = Partial<DogProfileCreateInput>;

export enum DogProfileSex {
  FEMALE = "FEMALE",
  MALE = "MALE",
  NOT_SPECIFIED = "NOT_SPECIFIED",
}

export const dogProfileFragment = gql`
  fragment dogProfile on DogProfile {
    activityLevel
    ageMonths
    breed {
      ...dogBreed
    }
    condition
    estimatedAgeMonths
    id
    name
    neutered
    sex
    uuid
    weightLb
  }
  ${dogBreedFragment}
`;

export const DOG_PROFILE = gql`
  query DOG_PROFILE($uuid: String!) {
    dogProfile(uuid: $uuid) {
      ...dogProfile
    }
  }
  ${dogProfileFragment}
`;

export const DOG_PROFILE_CREATE = gql`
  mutation DOG_PROFILE_CREATE($input: DogProfileCreateInput!) {
    payload: dogProfileCreate(input: $input) {
      dogProfile {
        ...dogProfile
      }
    }
  }
  ${dogProfileFragment}
`;

export const DOG_PROFILE_UPDATE = gql`
  mutation DOG_PROFILE_UPDATE($data: DogProfileUpdateInput!, $uuid: String!) {
    payload: dogProfileUpdate(data: $data, uuid: $uuid) {
      dogProfile {
        ...dogProfile
      }
    }
  }
  ${dogProfileFragment}
`;

export const useDogProfile = (uuid: string | null) =>
  useQuery<DogProfileData>(DOG_PROFILE, {
    skip: !uuid,
    variables: { uuid },
  });

const enUsPronounsResource = {
  their: {
    [DogProfileSex.FEMALE]: "her",
    [DogProfileSex.MALE]: "his",
    [DogProfileSex.NOT_SPECIFIED]: "their",
  },
};

export const useDogProfilePronouns = () => {
  const { i18n } = useLocale();

  i18n.addResourceBundle(
    "en-US",
    "useDogProfilePronouns",
    enUsPronounsResource
  );

  return Object.keys(enUsPronounsResource).reduce(
    (accum, key) => ({
      ...accum,
      [key]: `$t(useDogProfilePronouns:${key}.{{ sex }})`,
    }),
    {} as Record<keyof typeof enUsPronounsResource, string>
  );
};
