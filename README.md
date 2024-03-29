#birdu

I am working on a bird-eats-bird game to acclimate myself to the phaser ecosystem.

[Click Here to play](http://jtronlabs.github.io/Birdu/dist/index.html)

[Click Here to view it on the Google Play Store](https://play.google.com/store/apps/details?id=com.jtronlabs.birdu)

Basic instructions on what I've done as are follows:

##Installing Phaser Build systems

```
#The Phaser game generator provides easy, consistent phaser setup ::: #https://github.com/codevinsky/generator-phaser-official
#To install, first get dependencies. Install npm, then bower, then yo (in order to run our generator-phaser-official)
sudo apt-get install nodejs #Web server
sudo apt-get install npm #The NodeJS package manager
npm install -g bower #package manager
npm install -g yo #client-side dev stack, helps devs quickly build high quality web apps
npm install -g grunt-cli #task-based command line build tool for JavaScript projects

sudo npm install -g yo generator-phaser-official #Desired YeoMan tool to auto-gen phaser game project

cd ~/Documents
yo phaser-official #Generate a project in current directory (phaser is v2.4.6 at time of writing)
grunt #will auto-compile JS file as you modify code, and will save production output to /dist directory


#later you can generate prefabs with
yo phaser-official:prefab "prefab_name"
```

##Installing Android Dependencies
```
#java 8
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java8-installer
sudo apt-get install oracle-java8-set-default

#Android Studio and SDK
sudo apt-get install libc6:i386 libncurses5:i386 libstdc++6:i386 lib32z1 #Android Studio's 32 bit dependencies for 64 bit systems
sudo apt-add-repository ppa:paolorotolo/android-studio #Project for auto-installing AS thru command line - https://paolorotolo.github.io/android-studio/
sudo apt-get update
sudo apt-get install android-studio
/opt/android-studio/bin/studio.sh #Must open AS and do the first time setup, in order to install the SDK correctly
sed -i '1s/^/export PATH=$ANDROID_HOME\/platform-tools:$PATH \n/' ~/.bashrc #export android paths
sed -i '1s/^/export PATH=$ANDROID_HOME\/tools:$PATH \n/' ~/.bashrc
sed -i '1s/^/export ANDROID_HOME="\/home\/james\/Android\/Sdk\/" \n/' ~/.bashrc #need to export ANDROID_HOME to bash's PATH. Use 'sed' to insert a ANDROID_HOME's path into the bashrc profile, permanently adding this path variable. You can check your bashrc with 'nano ~/.bashrc', and the ANDROID_HOME should be the first line
sed -i '1s/^/export PATH=$ANDROID_HOME\/tools:$PATH \n/' ~/.bashrc

/home/james/Android/Sdk/tools/android #Open SDK Manager and install a bunch of required tools
#Now you're set to compile Cordova to Android projects!
```

##Using Cordova
```
#https://cordova.apache.org/docs/en/4.0.0/guide/cli/
sudo npm install -g cordova
cordova plugin add org.apache.cordova.console #debugging capabilities

cd ~/Documents
cordova create cordova-birdu com.jtronlabs.birdu Birdu #cordova-birdu = directory name, com.jtronlabs.birdu = reverse domain-style identifier, Birdu = application's display title
cd cordova-birdu
cordova platform add android
cordova platforms ls #show platforms
rm -rf ~/Documents/cordova-birdu/www #delete current Cordova 'www' files
cp -r ~/Documents/birdu/dist ~/Documents/cordova-birdu/www #copy game files to old 'www' directory location
cordova build

#plug in your Android phone ( with USB debugging and non-Play store apps allowed), and wait for a pop-up that says that you trust this computer

cordova run android
#edit your config.xml to personalize your app

#generate final release with
cordova build --release android

#it helps to run this in Android studio, instead of the command line (for the logcat messages). Follow the instructions under "Opening a Project in Android Studio": https://cordova.apache.org/docs/en/6.x/guide/platforms/android/
#Also, if you want to run Android Virtual Devices then you may need KVM - https://help.ubuntu.com/community/KVM/Installation
```
