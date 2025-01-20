# Contributing to the Decorator
The Team Personbruker has the daily responsibility for the Decorator, but we welcome input, suggestions, and PRs from others! This documentation details how to start the Decorator locally, add an issue to the GitHub repository, or submit a pull request.

## Starting the Decorator locally

### 1. Clone the Decorator:

  ```bash
  git clone https://github.com/navikt/nav-dekoratoren.git
  ```

### 2. Set up NODE_AUTH_TOKEN with your own PAT (Personal Access Token)
Some of the dependencies are located in a private container registry. To install these, you need to set up a GitHub Personal Access Token (PAT).

1. Go to [Github token settings](https://github.com/settings/tokens) and create a new PAT if you don't already have one. Remember to include the `packages:read` scope and authorize ```navikt``` (Configure SSO -> "Authorize navikt").

2. Make the PAT available as the `NODE_AUTH_TOKEN`:<br>In Terminal: `export NODE_AUTH_TOKEN=your-path-with-correct-scope`<br>Windows Powershell: `$env:NODE_AUTH_TOKEN="your-path-with-correct-scope"`
.

**Tip**: Step 2 will set the `NODE_AUTH_TOKEN` environment variable for that particular Terminal or PowerShell session. If you'd like to make your PAT permanently available, consider using [1Password to load secrets into the environment](https://developer.1password.com/docs/cli/secrets-environment-variables/) or an equivalent method. Do not write your PAT directly to `.bash_profile` for security reasons.

### 3. The Decorator uses [Bun](https://bun.sh) as the Javascript runtime instead of NodeJS.
If you already have Bun installed on your machine, you can skip this step.

You can install Bun globally on your machine like this:

  ```bash
  npm install -g bun
  ```

(You can also install Bun with Brew, curl, etc: https://bun.sh/docs/installation).


### 4. Navigate to the root of the repository and install dependencies

  ```bash
  cd nav-dekoratoren

  bun install | bun run build
  ```

### 5. Start the Decorator locally

  ```bash
  bun run dev
  ```

You should now be able to open the Decorator at http://localhost:8089/.

## Contribution

### Guidelines:
Some kind reminders before you start:
- Check if there is already a similar open PR.
- Link any existing issues to your PR for easy tracking.
- Write clear commit messages and PR descriptions (e.g., not "fix stuff again"). Note that PRs only allow squashing when merging into main.
- Ask for help if you're unsure or need assistance with testing!
- The dev ingress is used by many applications in Nav and is expected to be stable. If you're unsure about your changes, there is a beta ingress where things are allowed to break. See the Action `Deploy to Team Nav.no beta`.

### Linting and testing
Husky runs linting when you commit your changes. You may also run `bunx lint-staged --config package.json` on your staged files.

Testing is done with `bun run test` and runs the test suites for the `/client` and `/server` packages.

### Deploying to dev
If you'd like to test your branch, you can deploy it using the workflow trigger in GitHub Actions. See the Actions tab in the GitHub repository:
- `Deploy to dev`: Use this if you're confident that your branch and code changes are stable.
- `Deploy to Team nav.no beta`: Use this if you'd like to test things that might break.

### Deploying to production
When your PR has been approved, you may merge it and trigger a production deployment by creating a new version release:
1. In GitHub, click "Releases" and then "Draft a new release."
2. Make sure that you create a new release tag in the proper format `vx.x.x` and also consider whether this is a major, minor, or patch release.
3. Click `Generate release notes` to automatically fetch PR references into the description, where you can make final adjustments and comments before hitting `Publish release`.


## Architecture and technical solution
This section aims to explain how the Decorator is engineered:
- Overall architecture
- Web components and styling
- Server-side vs. client-side rendering
- Miscellaneous services for surveys and analytics

### Overall architecture
The Decorator is written without using any particular frameworks. Everything is based on native web APIs and features without any augmentation. This is to keep the Decorator as light as possible.

The source code is divided into packages:
- **client:** Client-side code and components.
- **server:** All elements and code that can be run on the server as part of server-side rendering, including the actual `server.ts` that manages all API routing.
- **icons:** All icons, both custom for the Decorator and icons from `@navikt/aksel-icons`.
- **shared:** Functions and types that are shared between packages.
- **next-pages-router-example:** A small Next.js app that allows you to preview the Decorator at `localhost:8089` when you run `bun run dev`.

These packages act as separate workspaces and are also built separately through command chaining. See the `build` script in `package.json`. The reason for this package strategy is that each package has its own variations in how it is built. For example, `icons` will run a custom build script (`build-icons.ts`) to compile both custom icons and `@navikt/aksel-icons` into the `dist` folder.

### Web components and styling
Most components are built using Web Components, which help encapsulate structure and styling, preventing styling and scripts from leaking into other parts of the Decorator. You can [find more on Web Components here](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).

### Serverside vs clientside rendering
The Decorator aims to do as much server rendering as possible before delivering content to your application.

### Task analytics
Task Analytics allows teams to run surveys based on matching URLs. The tasks are configured in a [separate configuration repo](https://github.com/navikt/nav-dekoratoren-config) and are injected into the Decorator. Please contact Team Personbruker if you would like to learn more about Task Analytics or if you have a survey that you would like to set up.

### Hotjar
Hotjar is behavior analytics software that allows you to see interaction heatmaps and analyze user behavior in your application. Hotjar is enabled by default in the Decorator, and content is masked to prevent unintentional leaks of personal information to Hotjar. See [readme.md](/README.md#maskhotjar) for information on how to turn off masking.

### Storybook
You can find an overview and documentation for each component in [Storybook](https://navikt.github.io/decorator-next).

You can also run Storybook locally, e.g., if you're working on a particular component:

```bash
npm run storybook
```

You should now be able to open Storybook in your browser at [http://localhost:6006](http://localhost:6006).

#### Creating new components or changing existing ones
Stories for each component are prefixed with `.story.tsx`. Please remember to update any prop changes or add stories if you're creating a new component for the Decorator.

### Resources

-   [Typescript documentation for Bun](https://bun.sh/docs/typescript)



