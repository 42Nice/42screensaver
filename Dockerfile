FROM node:20-alpine3.17

COPY . /app
WORKDIR /app

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]