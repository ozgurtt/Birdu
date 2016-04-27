'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'birdu');
  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  //Call to use Cordova APIs. CordovaHelper will take care of everything.
  var CordovaHelper = require('../assets/Cordova_Api_Manager');//this is the path to access assets from the build ('dist') folder
  document.addEventListener("deviceready", new CordovaHelper().cordovaDeviceReady(game), false);

  game.state.start('boot');
};
