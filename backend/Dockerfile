FROM node:16.19.0

WORKDIR /app

COPY package.json .
RUN yarn

COPY . .

EXPOSE 5000

CMD ["yarn", "start"]
