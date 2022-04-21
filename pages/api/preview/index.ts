import { initializeApollo } from "@sss/apollo";
import { documentResolver, metaFragment, PrismicDocument } from "@sss/prismic";
import gql from "graphql-tag";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const documentId = req.query.documentId;
  const token = req.query.token;

  if (typeof token !== "string") {
    res.status(400).send("Missing preview token query string argument");
    return;
  }

  if (typeof documentId !== "string") {
    res.status(400).send("Missing preview token query string argument");
    return;
  }

  res.setPreviewData({
    token,
  });

  const client = initializeApollo({
    previewToken: token,
  });

  try {
    const { data, errors } = await client.query<{
      payload: {
        edges: { node: PrismicDocument }[];
      };
    }>({
      query: gql`
        query PRISMIC_DOCUMENT($documentId: String!) {
          payload: pDocuments(id: $documentId) {
            edges {
              node {
                ...meta
              }
            }
          }
        }
        ${metaFragment}
      `,
      variables: {
        documentId,
      },
    });

    if (errors) {
      res.status(400).send(JSON.stringify(errors, undefined, 2));
      return;
    }

    const document = data.payload?.edges?.[0]?.node;
    if (!document) {
      res.status(400).send("Failed to fetch Prismic document to preview");
    }

    try {
      const path = documentResolver(document);
      res.redirect(path);
    } catch (error) {
      // This document is not a linkable document, send to homepage and leave them find it themselves
      res.redirect("/");
    }
  } catch (error) {
    res.status(500).send(JSON.stringify(error, undefined, 2));
  }
};

export default handler;
