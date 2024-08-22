# Contributing to the Decorator
It is Team Personbruker has the daily responsibility for the Decorator, but we welcome input, suggestions, or PRs from others! This documentation details how to start the Decorator locally, add an issue to the Github repository or submit a pull request.

## Starting the Decorator locally

### 1. Clone the Decorator:

  ```bash
  git clone https://github.com/navikt/decorator-next.git
  ```

### 2. Set up NODE_AUTH_TOKEN with your own PAT (Personal Access Token)
Some of the dependencies are located in a private container registry. To be able to install these, you need to set up a Github Personal Access Token (PAT).

1. Go to [Github token settings](https://github.com/settings/tokens) and create a new PAT if you don't already have one. Remember to include the `packages:read` scope and authorize ```navikt``` (Configure SSO -> "Authorize navikt").

2. Make the PAT available as the `NODE_AUTH_TOKEN`:<br>In Terminal: `export NODE_AUTH_TOKEN=your-path-with-correct-scope`<br>Windows Powershell: `$env:NODE_AUTH_TOKEN="your-path-with-correct-scope"`
.

**Tip**: Step 2 will set the `NODE_AUTH_TOKEN` environment for that particular Terminal or PowersShell session. If you'd like to permanently make your PAT available, consider using [1Password to load secrets into the environment](https://developer.1password.com/docs/cli/secrets-environment-variables/) or equivalent. Do not write your PAT directly to `.bash_profile` for security reasons.

### 3. The Decorator uses [Bun](https://bun.sh) as the Javascript runtime instead of NodeJS.
If you already have Bun installed on your machine, skip this step.

You can install Bun globally on your machine like this:

  ```bash
  npm install -g bun
  ```

(You can also install Bun with Brew, curl, etc: https://bun.sh/docs/installation).


### 4. Navigate to the root of the repository and install dependencies

  ```bash
  cd decorator-next

  bun install | bun run build
  ```

### 5. Start the Decorator locally

  ```bash
  bun run dev
  ```

You should now be able to open the Decorator at http://localhost:8089/.

## About architecture and technical solution
This section aims to explain how the Decorator is enginered:
- Overall architecture
- Key concepts
- Web components and styling
- Serverside vs Clientside rendring
- Caching

## General development information

### Styling

//Todo: Is this still relevant?

_Troubleshooting_:

-   If you're having trouble with design tokens not being loaded, it may be because your element is not in the scope of the elements defined in postcss.config.js [prefixer configuration](https://github.com/navikt/decorator-next/blob/main/packages/client/postcss.config.js)

### Storybook
You can find an overview and documentation for each component in
[Storybook](https://navikt.github.io/decorator-next/?path=/docs/feedback-success--docs).

### Resources

-   [Typescript documentation for Bun](https://bun.sh/docs/typescript)

## Testing
The Decorator uses Snapshot tests. These may fail if you make changes to the markup. To update snapshots after making changes, run

```bash
bun test --update-snapshots
```

## Contribution guidelines:

We welcome contributions and PRs! Before you get started:

- check if there is a similar open PR already.
- link any existing issues to your PR for easy tracking.
- write clear commit messages (i.e., not "fix stuff again").
- ask for help if you're unsure or need assistance with testing!
- the dev ingress is used by many applications. Therefore, branches that are deployed here should be as stable as possible, even when they are still in testing.

