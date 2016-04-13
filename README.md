#birdu

I am working on a bird-eats-bird game to acclimate myself to the phaser ecosystem.

[Click Here to play](http://jtronlabs.github.io/Birdu/dist/index.html)

Basic instructions on what I've done as are follows:

##Installing Phaser Build systems

```
#first, install phaser game generator for easy, consistent phaser setup ::: #https://github.com/codevinsky/generator-phaser-official
#install npm, then bower, then yo (in order to run our generator-phaser-official)
sudo apt-get install nodejs #Web server
sudo apt-get install npm #The NodeJS package manager
npm install -g bower #package manager
npm install -g yo #client-side dev stack, helps devs quickly build high quality web apps
npm install -g grunt-cli #task-based command line build tool for JavaScript projects

sudo npm install -g yo generator-phaser-official #YeoMan tool to auto-gen phaser game project

cd ~/Documents
yo phaser-official #Generate a project in current directory (phaser is v2.4.6 at time of writing)
grunt #will auto-compile JS file as you modify code, and will save production output to /dist directory


#later you can generate prefabs with
yo phaser-official:prefab "prefab_name"
```

##Setting up Cordova
```
#https://cordova.apache.org/docs/en/4.0.0/guide/cli/
sudo npm install -g cordova

cd ~/Documents
cordova create cordova-birdu com.jtronlabs.birdu Birdu #cordova-birdu = directory name, com.jtronlabs.birdu = reverse domain-style identifier, Birdu = application's display title
cd cordova-birdu
cordova platform add android
cordova platforms ls #show platforms
rm -rf ~/Documents/cordova-birdu/www #delete current Cordova 'www' files
cp -r ~/Documents/birdu/dist ~/Documents/cordova-birdu/www #copy game files to old 'www' directory location
cordova build
```
