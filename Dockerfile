FROM node:18

WORKDIR /app/backend

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "start:prod"]

