#!/bin/sh


echo "deleting old files"
rm -rf dist
sudo rm -rf /var/www/html/birdu/ #delte current contents of localhost's game directory

echo "copying new build to localhost"
grunt build #compile js
sudo cp -a $(pwd)/dist /var/www/html/birdu/ #copy over files to that directory

