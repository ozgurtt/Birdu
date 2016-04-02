#birdu

I am working on a fish-eats-fish game to acclimate myself to the phaser ecosystem. 

[Click Here to play](http://jtronlabs.github.io/Fishu/dist/index.html)

Basic instructions on what I've done as are follows:


```
#first, install phaser game generator for easy, consistent phaser setup ::: #https://github.com/codevinsky/generator-phaser-official
#install npm, then bower, then yo (in order to run our generator-phaser-official)
sudo apt-get install nodejs #Web server
sudo apt-get install npm #The NodeJS package manager
npm install -g bower #package manager
npm install -g yo #client-side dev stack, helps devs quickly build high quality web apps
npm install -g grunt-cli #task-based command line build tool for JavaScript projects

sudo npm install -g yo generator-phaser-official #YeoMan tool to auto-gen phaser game project


yo phaser-official #Generate a project in current directory (phaser is v2.4.6 at time of writing)
grunt #will auto-compile JS file as you modify code, and will save production output to /dist directory


#later you can generate prefabs with
yo phaser-official:prefab "prefab_name"
```
