FROM oven/bun:0.8.1

WORKDIR /app

COPY package.json /app/
COPY *.ts /app/
COPY tsconfig.json /app/
COPY server /app/server
COPY views /app/views
COPY client /app/client
COPY dist /app/dist
COPY node_modules /app/node_modules

EXPOSE 3000

CMD NODE_ENV=production bun run serve