FROM oven/bun:1.1.20-alpine

WORKDIR /app

COPY packages/server/dist /app/dist
COPY packages/client/dist/assets /app/public/assets

EXPOSE 8089

CMD bun run dist/server.js
