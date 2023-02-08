FROM node:12.18.3

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN ls
RUN npm install
COPY . .

EXPOSE 1337

CMD ["node", "server.js"]