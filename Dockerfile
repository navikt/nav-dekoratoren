FROM oven/bun:1.0.4

WORKDIR /app

COPY packages/server/dist /app/dist
COPY packages/server/public /app/public

EXPOSE 8089

CMD bun run dist/server.js
