
FROM node:7.8.0
RUN npm install -g create-react-app
RUN mkdir -p /home/node/project
ADD package.json /home/node/project/package.json
RUN cd /home/node/project/
RUN npm install --save-dev rebuild node-sass --force
EXPOSE 3000 3001
ENTRYPOINT cd /home/node/project/ && npm install && npm run docker
