#!/bin/sh

grunt build #compile js

echo "deleting old files"
sudo rm -rf /var/www/html/birdu/ #delte current contents of localhost's game directory

echo "copying over new files"
sudo cp -a $(pwd)/dist /var/www/html/birdu/ #copy over files to that directory
