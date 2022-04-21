// Load fragment types to avoid matching errors - see
// https://www.apollographql.com/docs/react/data/fragments/#fragments-on-unions-and-interfaces
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import dotenv from "dotenv";
import { promises as fs } from "fs";
import minimist from "minimist";
import fetch from "node-fetch";
import { dirname, resolve } from "path";

const argv = minimist(process.argv.slice(2));

const APP_NAME = "fotp-frontend";
const BASE_DIR = process.env.PWD!;
const DESTINATION = resolve(
  BASE_DIR,
  "generated",
  "config",
  "fragment-types.json"
);

if (!process.env.ENVIRONMENT) {
  const dotEnv = resolve(BASE_DIR, ".env");
  const result = dotenv.config({ path: dotEnv });
  if (result.error) {
    throw result.error;
  }
}

const ENVIRONMENT = process.env.ENVIRONMENT;
const SECRET_ID = argv["secret-id"] || `${ENVIRONMENT}-${APP_NAME}`;

const getBackendUrl = async () => {
  if (ENVIRONMENT === "development") {
    return process.env.BACKEND_URL;
  }

  const client = new SecretManagerServiceClient();

  const [{ payload }] = await client.accessSecretVersion({
    name: `projects/${ENVIRONMENT}-sss/secrets/${SECRET_ID}/versions/latest`,
  });

  const raw = payload?.data?.toString();

  if (!raw) {
    throw new Error("Invalid or missing secret data");
  }

  const { APP_BACKEND_URL } = dotenv.parse(raw);

  return APP_BACKEND_URL;
};

const generateFragmentTypes = async () => {
  try {
    const backendUrl = await getBackendUrl();
    const url = `${backendUrl}/us/en/graphql`;

    console.info(`Fetching fragment types from ${url}...`);

    const response = await fetch(url, {
      body: JSON.stringify({
        query: `
{
  __schema {
    types {
      kind
      name
      possibleTypes {
        name
      }
    }
  }
}
`,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const body = await response.text();

    console.info("Received response:\n", body);

    const { data } = JSON.parse(body);

    // Filter out any type information unrelated to unions or interfaces
    data.__schema.types = data.__schema.types.filter(
      // XXX migration
      (type: any) => type.possibleTypes !== null
    );

    // Make sure the destination directory exists before we try to write to it
    await fs.mkdir(dirname(DESTINATION), { recursive: true });

    await fs.writeFile(DESTINATION, JSON.stringify(data));

    console.info("Fragment types successfully extracted!");
  } catch (error) {
    console.error("Error creating fragment types:\n", error);

    let details;

    if (error.response) {
      try {
        details = await error.response.json();
      } catch (error) {
        // Fail silently
      }
    }

    if (details) {
      console.error("Response details:\n", JSON.stringify(details, null, 4));
    }

    process.exit(1);
  }
};

generateFragmentTypes();
