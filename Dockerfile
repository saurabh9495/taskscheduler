FROM node:8

WORKDIR /usr/src/app

COPY . .

RUN ls -la

RUN npm install -g serve

CMD serve -s build

EXPOSE 5000