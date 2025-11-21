FROM node:24.0.0

RUN mkdir app

WORKDIR /app

COPY . . 
RUN yarn install

RUN yarn prisma generate --schema prisma/schema.prisma

EXPOSE 4000

CMD ["yarn", "dev"]