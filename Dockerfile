FROM node:22

WORKDIR /index

COPY package*.json ./

RUN npm cache clean --force && npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
