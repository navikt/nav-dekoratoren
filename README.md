# Table of contents

- 🔨 [installation](#installation)
- 💻 [Development](#development)

---

## Installation

Set up a [Github PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with the scope `packages:read` and make it available as `NODE_AUTH_TOKEN`, e.g. `export NODE_AUTH_TOKEN=your-pat-with-correct-scope`.

Then run (install instructions for bun: https://bun.sh/):

```bash
bun install
```

## Development

Run `bun run dev` to start development server.

### Updating snapshots

To update snapshots when you've made changes to the markup that is produced. Run: `bun test --update-snapshots`
