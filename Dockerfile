FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

ENV NODE_ENV=production

WORKDIR /app

COPY packages/server/dist /app/dist
COPY packages/client/dist/assets /app/public/assets

EXPOSE 8089

CMD ["dist/server.js"]
