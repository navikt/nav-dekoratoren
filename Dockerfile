FROM oven/bun:1.0.17

WORKDIR /app

CMD bun run build

COPY packages/server/dist /app/dist
COPY packages/server/public /app/public

EXPOSE 8089

CMD bun run dist/server.js
