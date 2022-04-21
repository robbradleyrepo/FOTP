import {
  documentResolver,
  Image,
  Person,
  renderAsString as baseRenderAsString,
  RichTextBlock,
} from "@sss/prismic";
import gql from "graphql-tag";
import React, { FC } from "react";
import { JsonLd } from "react-schemaorg";
import type { Person as SchemaPerson } from "schema-dts";

import { isDefined } from "@/common/filters";

import {
  Expert,
  ExpertCore,
  expertCoreFragment,
  expertFragment,
} from "./common";

export interface ExpertsPage {
  experts: Record<"expert", Expert>[] | null;
  featuredExperts: FeaturedExpert[] | null;
}

export interface FeaturedExpert {
  expert: Expert | null;
  image: Image | null;
}

export type ExpertData = Record<"expert", Expert | null>;

export type ExpertsPageData = Record<"expertsPage", ExpertsPage>;

export const EXPERTS_PAGE = gql`
  query EXPERTS_PAGE {
    expertsPage: pExpertsPage(uid: "experts-page") {
      experts {
        expert {
          ...expertCore
          ... on PExpert {
            # XXX: We do not need the bio here once we've moved to the new Experts page
            bio
            summary
          }
        }
      }
      featuredExperts {
        expert {
          ...expert
        }
        image
      }
    }
  }
  ${expertFragment}
  ${expertCoreFragment}
`;

export const EXPERT_PAGE = gql`
  query EXPERT_PAGE($handle: String!) {
    expert: pExpert(uid: $handle) {
      ...expert
    }
  }
  ${expertFragment}
`;

export const getInstagramUrl = (handle: string) =>
  `http://instagram.com/${handle}`;

export const getTwitterUrl = (handle: string) => `http://twitter.com/${handle}`;

const renderAsString = (block?: RichTextBlock[] | null) =>
  baseRenderAsString(block ?? []) ?? undefined;

export const mapPersonToSchema = (
  person: ExpertCore | Expert | Person
): SchemaPerson => {
  const name = renderAsString(person?.name ?? []);

  return {
    "@type": "Person",
    name,
    ...("qualifications" in person
      ? {
          affiliation: person.qualifications?.map((qual) => ({
            "@type": "EducationalOrganization",
            name: qual?.institution ?? undefined,
          })),
          description: renderAsString(person?.summary),
          image: person.image?.url,
          jobTitle: renderAsString(person?.role),
          sameAs: [
            person.socialInstagram && getInstagramUrl(person.socialInstagram),
            person.socialTwitter && getTwitterUrl(person.socialTwitter),
          ].map(isDefined),
          url: documentResolver(person),
        }
      : undefined),
    ...("postNominal" in person
      ? {
          // XXX: An honorific prefix preceding a Person's name such as Dr/Mrs/Mr.
          // honorificPrefix
          honorificSuffix: renderAsString(person?.postNominal),
        }
      : undefined),
  } as SchemaPerson;
};

export const ExpertPersonSchema: FC<{ expert: Expert }> = ({ expert }) => {
  const person = mapPersonToSchema(expert);

  if (typeof person === "string") {
    // This should never happen as `mapPersonToSchema` always returns an object
    throw new Error("Person schema should be an object.");
  }

  return (
    <JsonLd<SchemaPerson>
      item={{
        "@context": "https://schema.org",
        ...person,
      }}
    />
  );
};
