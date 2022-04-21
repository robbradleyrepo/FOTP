import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { spawn, spawnSync } from "child_process";
import dotenv from "dotenv";
import minimist from "minimist";

// We only allow Secret Manger keys in below allow list or prefixed with `APP_`
const DEPLOY_SCRIPT_ENV_CONFIG = [
  "HOST",
  "VERCEL_DEPLOYMENT_TOKEN",
  "VERCEL_PROJECT_ID",
  "VERCEL_ORG_ID",
];

const argv = minimist(process.argv.slice(2));

const APP_NAME = "fotp-frontend";
const ENVIRONMENT = process.env.ENVIRONMENT;
const SCOPE = argv.scope || "fotp";
const SECRET_ID = argv["secret-id"] || `${ENVIRONMENT}-${APP_NAME}`;

if (!ENVIRONMENT) {
  throw new Error("`ENVIRONMENT` environment variable must be set");
}

interface VercelResult {
  deploymentId?: string;
}

const vercel = (options: string[] = [], secrets: dotenv.DotenvParseOutput) =>
  new Promise<VercelResult>((resolve, reject) => {
    const {
      VERCEL_DEPLOYMENT_TOKEN,
      VERCEL_ORG_ID,
      VERCEL_PROJECT_ID,
    } = secrets;

    const token = VERCEL_DEPLOYMENT_TOKEN
      ? ["-t", VERCEL_DEPLOYMENT_TOKEN]
      : [];

    const proc = spawn(
      "npm",
      [
        "run",
        "vercel",
        "--",
        "--scope",
        SCOPE,
        "--local-config",
        `./vercel.json`,
        ...token,
        ...options,
      ],
      {
        cwd: process.env.PWD,
        detached: true,
        env: {
          ...process.env,
          VERCEL_ORG_ID,
          VERCEL_PROJECT_ID,
        },
      }
    );

    const result: VercelResult = {};

    // Capture the deployment ID. This appears to be the only data that is
    // streamed to stdout, but we'll log anything else as a precaution.
    proc.stdout.on("data", (data) => {
      if (
        !result.deploymentId &&
        /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/gi.test(data)
      ) {
        result.deploymentId = data.toString();
      } else {
        process.stdout.write(data);
      }
    });

    proc.stderr.on("data", (data) => {
      process.stdout.write(data);
    });

    // Handle errors
    const handleError = (error: Error) => {
      let { message } = error;

      if (result.deploymentId) {
        message += `\nDeployment ID: ${result.deploymentId}`;
      }

      reject(message);
    };

    proc.on("error", handleError);
    proc.on("uncaughtException", handleError);

    // Handle completion
    proc.on("exit", (code = 1) =>
      code !== 0
        ? handleError(new Error("Vercel exited with errors"))
        : resolve(result)
    );
  });

const getBranch = () => {
  const { error, stdout } = spawnSync("git", [
    "rev-parse",
    "--abbrev-ref",
    "HEAD",
  ]);

  if (error) {
    throw new Error("Could not get the current branch name");
  }

  return stdout.toString().trim();
};

const getAppEnv = (secrets: dotenv.DotenvParseOutput) => {
  return [
    `ENVIRONMENT=${ENVIRONMENT}`,
    ...Object.entries(secrets).reduce<string[]>((accum, [key, value]) => {
      const appRegEx = /^APP_/;

      if (key.match(appRegEx)) {
        return [...accum, `${key.replace(appRegEx, "")}=${value}`];
      } else {
        if (!DEPLOY_SCRIPT_ENV_CONFIG.includes(key)) {
          throw new Error(
            `Sanity Check: Detected secret '${key}' not in 'DEPLOY_SCRIPT_ENV_CONFIG' and not prefixed with 'APP_'.`
          );
        }
      }

      return accum;
    }, []),
  ];
};

const getSecrets = async () => {
  const client = new SecretManagerServiceClient();

  const [{ payload }] = await client.accessSecretVersion({
    name: `projects/${ENVIRONMENT}-sss/secrets/${SECRET_ID}/versions/latest`,
  });

  const raw = payload?.data?.toString();

  if (!raw) {
    throw new Error("Invalid or missing secret data");
  }

  return dotenv.parse(raw);
};

const getHostname = (branch: string, secrets: dotenv.DotenvParseOutput) => {
  const { HOST } = secrets;

  if (!HOST) {
    throw new Error("`HOST` environment variable must be set");
  }

  if (["develop", "master"].includes(branch)) {
    return HOST;
  }

  const domain = HOST.match(/[a-zA-Z0-9-]+\.dev$/)?.[0] ?? "vercel.app";

  return `${
    `${APP_NAME}-git-${branch
      .replace("/", "-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .toLowerCase()}`
      .substring(0, 63) // Restrict to the allowable length - see https://en.wikipedia.org/wiki/Hostname#Restrictions_on_valid_host_names
      .replace(/-+$/, "") // Strip trailing hyphen-minuses
  }.${domain}`;
};

const deploy = async () => {
  const branch = getBranch();

  if (branch === "master" && ENVIRONMENT !== "prod") {
    throw new Error(
      "Master branch must be deployed using a production enviroment"
    );
  }

  const secrets = await getSecrets();

  if (secrets.DEPLOYMENTS_DISABLED) {
    console.info("Deployments have been disabled for this project");
    return;
  }

  const hostname = getHostname(branch, secrets);
  const appEnv = getAppEnv(secrets);

  /*
   * 1) Set the `ORIGIN` env var (as this depends on the alias)
   * 2) Explicity set the `NODE_ENV` to `production`. This won't affect the
   *    build step (where the value is set automatically) it will prevent
   *    devDependencies from being installed unnecessarily
   */
  let options = [
    "-b",
    `ORIGIN=https://${hostname}`,
    "-b",
    "NODE_ENV=production",
    "-m",
    `branch=${branch}`,
    "-m",
    `target=${
      branch === "master"
        ? "prod"
        : branch === "develop"
        ? "staging"
        : "feature"
    }`,
  ];
  let shouldAlias = true;

  if (branch === "master") {
    shouldAlias = false; // We'll rely on the project domain settings for production builds as this is more reliable than `vercel alias`
    options = [...options, "--prod", "--force"];
  }

  if (appEnv.length) {
    options = [
      ...appEnv.reduce<string[]>(
        (accum, envStr) => [...accum, "-b", envStr],
        []
      ),
      ...options,
    ];
  }

  try {
    const { deploymentId } = await vercel(options, secrets);

    console.info(deploymentId);

    if (!deploymentId) {
      throw new Error("Could not find a valid deployment ID");
    }

    if (shouldAlias) {
      await vercel(["alias", "set", deploymentId, hostname], secrets);
    }
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

deploy();
