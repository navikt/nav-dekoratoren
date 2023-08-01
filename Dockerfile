FROM node:18

WORKDIR /app

COPY package.json /app/
COPY *.ts /app/
COPY tsconfig.json /app/
COPY views /app/views
COPY dist /app/dist
COPY node_modules /app/node_modules

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "yarn", "serve" ]