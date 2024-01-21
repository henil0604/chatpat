FROM node:20-alpine

USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node . .

ARG CONTAINER_PORT

RUN mkdir -p /home/node/.npm-global
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

RUN npm install -g pnpm
RUN pnpm install

RUN npm run build

CMD npm run preview:host -- --port $CONTAINER_PORT