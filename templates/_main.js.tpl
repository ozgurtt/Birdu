'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(<%= gameWidth %>, <%= gameHeight %>, Phaser.AUTO, '<%= _.slugify(projectName) %>');
  // Game States
  <% _.forEach(gameStates, function(gameState) {  %>game.state.add('<%= gameState.shortName %>', require('./states/<%= gameState.shortName %>'));
  <% }); %>

  //Call to use Cordova APIs. CordovaHelper will take care of everything.
  var CordovaHelper = require('../assets/Cordova_Api_Manager');//this is the path to access assets from the build ('dist') folder
  document.addEventListener("deviceready", new CordovaHelper().cordovaDeviceReady(game), false);

  game.state.start('boot');
};
