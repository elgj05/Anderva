#!/bin/bash

echo "Building Client"
cd client
NODE_ENV='production'
yarn install --prod
yarn run build
sudo cp -RTv build/ /var/www/vhosts/anderva.app/panel.anderva.app/
sudo chown anderva:psacln -R /var/www/vhosts/anderva.app/panel.anderva.app/

cd ..
echo "DONE"
