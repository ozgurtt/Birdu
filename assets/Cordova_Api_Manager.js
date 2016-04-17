
/*
// Game States
var Boot = require('./states/boot');
var Gameover =  require('./states/gameover');
var Menu = require('./states/menu');
var Play = require('./states/play');
var Preload = require('./states/preload');
*/

var Cordova_Api_Manager = function() {  }
Cordova_Api_Manager.prototype.constructor = Cordova_Api_Manager;

Cordova_Api_Manager.prototype = {
    cordovaDeviceReady: function(game){
      /*
      Cordova's function that signals the devicec is ready. add listeners and Cordova API calls here.

      There is a bit of a hack here. Cordova API calls typically have no parameters, but I need to reference this current object (and the Phaser game in later API calls)
      So 'this' will be saved to a variable, and when the cordovaDeviceReady function is called in a different context, it will have a
      saved reference to the needed objects.

      Also, this function returns a function (a parameter-less one). This is because Cordova API calls don't usually have parameters, but
      I need to access the Phaser game. So I can pass down references in these functions, and return ones Cordova can use.
      */

      var context = this;
      return function(){
        console.log("CORDOVA DEVICE APIS READY AND AVAILABLE");

        document.addEventListener("pause", context.onPauseByCordova(game), false);
        document.addEventListener("resume", context.onResumeByCordova(game), false);
      }
    },
    onPauseByCordova: function(game){
      //the actual onPause function used by cordova cannot have parameters, but needs a way to reference the game.
      //So the 'game' parameter acts as a saved reference to the Phaser game, and a parameter-less function is returned for Cordova's API call
      return function(){
        console.log("Cordova has paused the game");

        if( game.state.current == "play" ){//if play state is active, call the play state's pause function (which will alter the UI)
          game.state.states.play.pauseGame(); //call the play state's pauseGame function
          game.state.states.play.saveGameState();
        }

        game.paused = true; //pause the game last (since previous functions may modify the game or UI)
      }
    },
    onResumeByCordova: function(game){
      return function(){
        console.log("Cordova has resumed the game");

        if( game.state.current != "play" ){//if play state is NOT active, avoid resuming the game (allow the user to resume it)
          game.paused = false; //actually resume the game
        }
      }
    }
  }

module.exports = Cordova_Api_Manager;