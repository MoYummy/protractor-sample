FROM node:8.2
RUN npm i -g gulp-cli
WORKDIR /myapp
ADD package.json /myapp/package.json
RUN npm i
ADD tsconfig.json /myapp/tsconfig.json
ADD gulpfile.js /myapp/gulpfile.js
ADD gulp /myapp/gulp
