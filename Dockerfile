FROM node:20-alpine3.17

COPY package.json /app/package.json
COPY srcs /app/srcs
COPY client /app/client
COPY static /app/static

WORKDIR /app

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
