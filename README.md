## Installation

Set up a [Github PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with the scope `packages:read` and make it available as `NODE_AUTH_TOKEN`, e.g. `export NODE_AUTH_TOKEN=your-pat-with-correct-scope`.

Then run (install instructions for bun: https://bun.sh/):

```bash
bun install
```

Make sure NODE_AUTH_TOKEN is in your path

## Setup

To properly be able to make calls to enonic, you need to add these entries to your hosts file.

https://github.com/navikt/nav-enonicxp#etchosts

## Development

Run `bun run dev` to start development server.
