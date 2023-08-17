# Scoping styling

- Have experimented with this in ./vite-plugin-prefix-class-id.js and ./literals-plugin.js. The problem is that views are used on both client and server. But they have different runtimes.

### Possible solutions

- Process views/ independently before it's used in the "runtimes". Then bundle both server and client, then run bun etc.
- Shadow DOc

Let's wait to see how much of an issue it is before spending a lot of time solving it.
