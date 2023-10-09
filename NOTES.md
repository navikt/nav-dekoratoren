# Notes

## Scoping styling

- Have experimented with this in ./vite-plugin-prefix-class-id.js and ./literals-plugin.js. The problem is that views are used on both client and server. But they have different runtimes.

### Possible solutions

- Process views/ independently before it's used in the "runtimes". Then bundle both server and client, then run bun etc.
- Shadow DOc

Let's wait to see how much of an issue it is before spending a lot of time solving it.

---

## Forbedringer av README

- Beskrive NODE_AUTH_TOKEN

## Forslag til fiksing av markup og styling

### Generelt

- Font-smoothing?
- Mobile first mediaqueries
- Nested vs. grouping mediaqueries
- Aksel-tokens, decorator tokens og hardkodede verdier
- Bytte ut ID-selectors med klasser
- Unngå element- og pseudo-selectors (p :last-child)
- Logical, short- & long-hand properties.
- Gjøre alle ikoner og logo til komponenter og samkjøre oppsett
- Linting av duplikatregler
- Rydde opp i referanser fra shared til client
- Validere HTML
- Vurdere PostCSS-plugin for nesting av media queries

### Åpen meny

- Bytte ut nested list med div på gruppenivå?
