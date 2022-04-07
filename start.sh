#!/usr/bin/bash

# make sure packages are up to date
pkg update
pkg upgrade -y

git pull # make sure git repo is up to date

adb tcpip 5555 # attempt to start port on other kiosk 

npm i # make sure npm is up to date
npm run build # build bootstrap files
npm start # start program