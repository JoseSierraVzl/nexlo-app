FROM node:24.0.0

RUN mkdir /app

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "dev"]