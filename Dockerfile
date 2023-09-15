FROM oven/bun:1.0.1

WORKDIR /app

COPY package.json /app/
COPY *.ts /app/
COPY packages/server /app/packages/server
COPY packages/client /app/packages/client
COPY packages/shared /app/packages/shared
COPY dist /app/dist
COPY node_modules /app/node_modules

EXPOSE 8089

CMD NODE_ENV=production bun run serve
