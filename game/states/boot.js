
'use strict';

function Boot() {

}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');

    //set up global variables and functions
    this.game.global = {
      getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      },
      fps_of_flapping_sprites: 7, //frames per second for a sprite with only 4 images
      hero_movement_speed: 120
    };

  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  },
  // Returns a uniformly distributed random integer between min (included) and max (excluded)
  getRandomInt:function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

};

module.exports = Boot;
