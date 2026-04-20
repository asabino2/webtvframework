FROM node:20-alpine

RUN apk add --no-cache git

ARG APP_REPO_URL=https://github.com/asabino2/webtvframework.git
ARG APP_REPO_REF=main

RUN git clone --depth 1 --branch ${APP_REPO_REF} ${APP_REPO_URL} /app

WORKDIR /app

RUN npm ci --omit=dev && npm cache clean --force


RUN mkdir -p /app/data && chown -R node:node /app

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

USER node

CMD ["node", "server.js"]