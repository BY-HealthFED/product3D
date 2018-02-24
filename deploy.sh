#!/bin/bash
yarn build:uat
scp -r ./build/* www@192.168.103.107:~/web/product3D
