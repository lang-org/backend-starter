FROM node:10
WORKDIR /app
ADD . /app
RUN npm install -g typescript@3.3.3
RUN yarn
