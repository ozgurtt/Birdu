
'use strict';

function Boot() {

}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');

    //set up global variables and functions
    this.game.global = {
      // Returns a uniformly distributed random integer between min (included) and max (excluded)
      getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      },
      levelUp: function(game,hero,enemies){
        this.level ++;

        var good_job_audio = game.add.audio('shrink');
        good_job_audio.play();

        //update hero's size, sprite, speed, etc as necessary
        var shrinkToOriginalSize = game.add.tween(hero.scale).to({ x: this.original_hero_scale * Math.sign(hero.scale.x) , y: this.original_hero_scale}, 500, Phaser.Easing.Linear.In);
        shrinkToOriginalSize.start();

        this.hero_movement_speed = Math.min(225,this.hero_movement_speed + 20);
      },
      area: function(sprite){//must use Math.abs, as 'x' scales can be different, causing negative area values
        return Math.abs(sprite.width * sprite.height);
      },
      fps_of_flapping_sprites: 9,
      hero_movement_speed: 120,
      hero_sprite_number: 28,
      level: 0,
      level_up_hero_area: 9200,
      original_hero_scale: .3
    };

  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }

};

module.exports = Boot;
