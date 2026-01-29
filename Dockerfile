FROM oven/bun:1.3.6-alpine

WORKDIR /app

COPY packages/server/dist /app/dist
COPY packages/client/dist/assets /app/public/assets

EXPOSE 8089

CMD bun run dist/server.js
