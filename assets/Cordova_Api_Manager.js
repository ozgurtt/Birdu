
var Cordova_Api_Manager = function() {  }
Cordova_Api_Manager.prototype.constructor = Cordova_Api_Manager;

Cordova_Api_Manager.prototype = {
    cordovaDeviceReady: function(game){
      /*
      Cordova's function that signals the devicec is ready. add listeners and Cordova API calls here.

      When an event handler gets called (all functions in this object are event handlers),
      "this" no longer references the "Cordova_Api_Manager" object, instead it is global scope.
      You need to capture "this" into a local variable that the functions will capture.
      http://stackoverflow.com/questions/1081499/accessing-an-objects-property-from-an-event-listener-call-in-javascript?answertab=votes#tab-top

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
        }

        //For devices that use cordova-media-plugin instead of Phaser, must pause audio (Phaser pauses audio in pauseGame)
        if(game.global.use_cordova_media_plugin() ){
          for(var key in game.global.playable_audio_hash){
            game.global.get_audio_file(key,null,game).stop();
          }
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

        //For devices that use cordova-media-plugin instead of Phaser, must manually start each desired audio over when game resumes (Phaser handles this much better on its own)
        if(this.game.global.use_cordova_media_plugin() ){
          this.game.global.playAudio('background_music',this.game,true);
        }
      }
    }
  }

module.exports = Cordova_Api_Manager;
