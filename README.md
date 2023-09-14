## Installation

Set up a [Github PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with the scope `packages:read` and make it available as `NODE_AUTH_TOKEN`, e.g. `export NODE_AUTH_TOKEN=your-pat-with-correct-scope`.

Then run (install instructions for bun: https://bun.sh/):

```bash
bun install
```

## Setting up enonic

Enonic is the CMS for nav.no. To communicate with the deployed dev instance enonic, you must be connected to nais-device and `team-personbruker-prod`. An another option is to replace ENONICXP_SERVICES with `https://www.nav.no/dekoratoren/`.
et another option is to set up enonic locally, but this is quite an exhaustive process. For more information visit the repo https://github.com/navikt/nav-enonicxp.

## Development

Run `bun run dev` to start development server.
