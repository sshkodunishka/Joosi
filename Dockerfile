FROM node:18.12.1

COPY . /app

COPY package*.json ./app

WORKDIR /app

RUN npm install

CMD ["npm", "run", "start:dev"]