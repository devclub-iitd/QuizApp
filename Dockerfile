FROM node:latest

RUN mkdir /code
WORKDIR /code

COPY package*.json ./
RUN npm install

COPY . .

ENTRYPOINT ["/code/entrypoint.sh"]
