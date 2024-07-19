FROM oven/bun:1.1.20-alpine

WORKDIR /app

COPY packages/server/dist /app/dist

EXPOSE 8089

CMD bun run dist/server.js
