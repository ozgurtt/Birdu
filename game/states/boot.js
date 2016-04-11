
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
      levelUp: function(game,hero,enemies){
        this.level ++;

        var good_job_audio = game.add.audio('shrink');
        good_job_audio.play();

        //update all enemy speeds as they move across the screen
        enemies.forEach(function(enemy){
          enemy.body.velocity.x += 5 * Math.sign(enemy.body.velocity.x);
        });

        //update hero's size, sprite, speed, etc as necessary
        var shrinkToOriginalSize = game.add.tween(hero.scale).to({ x: this.original_hero_scale * Math.sign(hero.scale.x) , y: this.original_hero_scale}, 500, Phaser.Easing.Linear.In);
        shrinkToOriginalSize.start();
      },
      area: function(sprite){//must use Math.abs, as 'x' scales can be different, causing negative area values
        return Math.abs(sprite.width * sprite.height);
      },
      fps_of_flapping_sprites: 9, //frames per second for a sprite with only 4 images
      hero_movement_speed: 120,
      hero_sprite_number: 0,
      level: 0,
      level_up_hero_area: 9500,
      original_hero_scale: .3
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
