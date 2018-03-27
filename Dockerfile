#node
FROM node:6.9.2

MAINTAINER blerterTeam

#apt
RUN apt-get update
#gulp
RUN npm install gulp -g

#create dir
RUN mkdir -p /blerter/app
RUN mkdir -p /blerter/swagger

#set dir
WORKDIR /blerter

#copy modules
COPY Gulpfile.js .
COPY package.json .
COPY server.js .
COPY app app
COPY swagger swagger
COPY server.sh .

#install dependencies
RUN npm install

#export port
EXPOSE 7004

#run scripts
CMD ["./server.sh"]
