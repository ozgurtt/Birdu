
'use strict';

function Boot() {}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');

    //force game to fill up screen
    this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

    //set up global variables and functions
    this.game.global = {
      // Returns a uniformly distributed random integer between min (included) and max (excluded)
      getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      },
      levelUp: function(game,hero,enemies){
        this.level ++;

        game.state.states.play.levelup_sound.play();
        game.state.states.play.levelup_text.visible = true;
        game.state.states.play.levelup_text_tween.start();

        //update hero's size, sprite, speed, etc as necessary
        var shrinkToOriginalSize = game.add.tween(hero.scale).to({ x: this.original_hero_scale * Math.sign(hero.scale.x) , y: this.original_hero_scale}, 500, Phaser.Easing.Linear.In);
        shrinkToOriginalSize.start();

        this.hero_movement_speed = Math.min(225,this.hero_movement_speed + 20);
      },
      area: function(sprite){//must use Math.abs, as 'x' scales can be different, causing negative area values
        return Math.abs(sprite.width * sprite.height);
      },
      fps_of_flapping_sprites: 9,
      score: Number(localStorage["currentGameScore"]) || 0,
      scoreBuffer: Number(localStorage["currentGameScoreBuffer"]) || 0,
      hero_movement_speed: 120,
      hero_sprite_number: 28,
      level: Number(localStorage["level"]) || 0,
      level_up_hero_area: 1000,
      original_hero_scale: .3,
      title_font_style:{ font: '82px papercuts', fill: '#ffffff', align: 'center', stroke:"#000000", strokeThickness:6},
      text_font_style:{ font: '28px papercuts', fill: '#ffffff', align: 'center', stroke:"#000000", strokeThickness:3},
      score_font_style:{font: "45px papercuts", fill: "#ffffff", stroke: "#535353", strokeThickness: 10}
    };

  },
  create: function() {
    //start preload game state
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;
