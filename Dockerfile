FROM oven/bun:1.0.30-alpine

WORKDIR /app

COPY packages/server/dist /app/dist

EXPOSE 8089

CMD bun run dist/server.js
