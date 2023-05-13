FROM node:18

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run build

CMD [ "node", "dist/src/main.js" ]