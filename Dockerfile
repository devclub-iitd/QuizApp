FROM node:latest

RUN mkdir /code
WORKDIR /code

RUN apt-get update && apt-get install postgresql-client -y

COPY . .
RUN npm install

ENTRYPOINT ["/code/entrypoint.sh"]
