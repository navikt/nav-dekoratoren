FROM mcr.microsoft.com/playwright:v1.44.1-jammy

WORKDIR /app

COPY . .

RUN npm install --global bun
RUN bun install
RUN cp packages/server/.env.sample packages/server/.env

CMD ["bunx", "playwright", "test"]