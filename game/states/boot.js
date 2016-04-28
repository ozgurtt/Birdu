
'use strict';

function Boot() {}

Boot.prototype = {
  preload: function() {
    console.log(navigator.userAgent);

    this.load.image('preloader', 'assets/preloader.gif');

    //force game to fill up screen
    this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

    //set up global variables and functions
    this.game.global = {
      // Returns a uniformly distributed random integer between min (included) and max (excluded)
      getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      },
      //sign (+ or -) of a number. Chromium and some browsers do not have this built in, add it here for better compatibility
      sign: function(x){
        if( +x === x ) { // check if a number was given
            return (x === 0) ? x : (x > 0) ? 1 : -1;
        }
        return NaN;
      },
      levelUp: function(game,hero,enemies){
        this.level ++;

        game.state.states.play.levelup_sound.play();
        game.state.states.boot.playLevelUpTweens(game, game.state.states.play.levelup_text);

        //update hero's size, sprite, speed, etc as necessary
        var shrinkToOriginalSize = game.add.tween(hero.scale).to({ x: this.original_hero_scale * this.sign(hero.scale.x) , y: this.original_hero_scale}, 500, Phaser.Easing.Linear.In);
        shrinkToOriginalSize.start();

        this.hero_movement_speed = Math.min(225,this.hero_movement_speed + 20);
      },
      area: function(sprite){//must use Math.abs, as 'x' scales can be different, causing negative area values
        return Math.abs(sprite.width * sprite.height);
      },
      package_name: "com.jtronlabs.birdu",
      fps_of_flapping_sprites: 9,
      score: Number(localStorage["currentGameScore"]) || 0,
      scoreBuffer: Number(localStorage["currentGameScoreBuffer"]) || 0,
      hero_movement_speed: 120,
      hero_sprite_number: 28,
      level: Number(localStorage["level"]) || 0,
      level_up_hero_area: 9200,
      original_hero_scale: .3,
      default_time_btw_enemy_spawns: Phaser.Timer.SECOND * .4,
      title_font_style:{ font: '82px papercuts', fill: '#ffffff', align: 'center', stroke:"#000000", strokeThickness:6},
      text_font_style:{ font: '28px papercuts', fill: '#ffffff', align: 'center', stroke:"#000000", strokeThickness:3},
      score_font_style:{ font: "45px papercuts", fill: "#ffffff", stroke: "#535353", strokeThickness: 10},
      score_animating_font_style:{font: "15px papercuts", fill: "#39d179", stroke: "#ffffff", strokeThickness: 4}
    };
  },
  playLevelUpTweens: function(game,textObj){
    textObj.scale.setTo(2,2);
    textObj.angle = -10;
    textObj.visible = true;

    //tween in the level up text, and hide + reset it on completion
    this.levelup_text_grow_tween = game.add.tween(textObj.scale)
      .from({x:0.1, y: 0.1}, 1000, Phaser.Easing.Linear.None, true)
    this.levelup_text_rotate_tween = game.add.tween(textObj)
      .to({angle: 10}, 100, Phaser.Easing.Linear.None, true, 0, -1, true);

    this.levelup_text_grow_tween.onComplete.add(function(){
      textObj.scale.setTo(1.5,1.5);
      textObj.angle = -10;
      textObj.visible = false;
      this.levelup_text_rotate_tween.stop();
    },this);
  },
  create: function() {
    //start preload game state
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;
