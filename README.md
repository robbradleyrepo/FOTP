# fotp-frontend

A server-side rendered React application for Front of the Pack.

---

## Introduction

This SPA uses [TypeScript](https://www.typescriptlang.org/), [React](https://reactjs.org/), [Next.js](https://nextjs.org/), and [Styled Components](https://www.styled-components.com/).

---

### Git

We use [**Git Flow**](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) and so should you!

Git commit messages should always start with a verb, first character upper case and be in present-tense, imperative-style ("Add something").

Do **not** rebase _develop_ or _master_! When you merge into either always generate a merge commit.<br>
We prefer a clean history including branch merges.<br>
Feel free to rebase your branch before merge/push for a clean history!

---

## How to use

### Prerequisites

- git
- Node Version Manager ([NVM](https://github.com/creationix/nvm))

Recommended:

- React DevTools

### Setup

#### 1. Setup NodeJS and NPM

We use [NVM](https://github.com/creationix/nvm) to make sure all developers are running the version of NodeJS and NPM specified in the `.nvmrc` file.

##### Installation

Inside the `fotp-frontend` directory run:

```bash
nvm install
```

##### Run

Before running the app ensure you are using the right version of node and npm by running:

```bash
nvm use
```

#### 2. Setup `fotp-frontend`

##### Installation

```bash
git clone git@github.com:pawsdotcom/fotp-frontend.git
cd fotp-frontend
npm install
cp .env.example .env
```

Tweak your local environment variables accordingly in `.env`, then generate any required code using `npm run generate`.

##### Run

Development with HMR: `npm run dev`

### Deployments

We are using Vercel to host the frontend. We use Circle CI to build, test and
deploy the app. The `develop` branch is automatically deployed to the
[staging environment](https://fotp.dev). The `master` branch
is automatically deployed to the [production environment](https://fotp.com).
