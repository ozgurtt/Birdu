
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    //background image
    this.background = this.game.add.sprite(0,0,'background');
    this.background.height = this.game.world.height;
    this.background.width = this.game.world.width;

    //title of game text
    this.titleText = this.game.add.text(this.game.world.centerX, 0, 'B I R D U', this.game.global.title_font_style);
    this.titleText.anchor.setTo(0.5, 0.5);
    this.titleText.y = this.titleText.height/2; //must set after height is established

    //main image/logo + its animationsphaser
    this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'b-'+this.game.global.hero_sprite_number);
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

    //high score info
    this.maxScore = this.game.add.text(this.game.world.centerX, 0, '', this.game.global.text_font_style);
    this.maxScore.anchor.setTo(0.5, 0.5);
    this.maxScore.y = this.sprite.y + this.sprite.height/2 + this.maxScore.height/2;

    //display high score if possible
    if( typeof(Storage) !== "undefined") {
      var max = localStorage["maxScore"] || 0; //default value of 0 is it does not exist
      this.maxScore.text = 'High Score: '+max;
    }

    //tell user how to play (text)
    this.instructionsText = this.game.add.text(this.game.world.centerX, 0, 'Eat smaller birds to survive.\nClick to play!',this.game.global.text_font_style);
    this.instructionsText.y = this.maxScore.y + this.maxScore.height/2 + this.instructionsText.height/2;
    this.instructionsText.anchor.setTo(0.5, 0.5);

    //start game's music
    if(this.game.global.use_cordova_media_plugin){
      this.game.audio.background_music.play();
    }else{
      this.game.audio.background_music.loopFull(0.5);
    }

    //ensure that no text is too wide for the screen
    this.titleText.width = Math.min(this.titleText.width, window.innerWidth);
    this.maxScore.width = Math.min(this.maxScore.width, window.innerWidth);
    this.instructionsText.width = Math.min(this.instructionsText.width, window.innerWidth);

  /*  Does not work
      //ensure the entire menu is not too tall for the screen
      this.menu = game.add.group();
      this.menu.add(this.titleText);
      this.menu.add(this.sprite);
      this.menu.add(this.maxScore);
      this.menu.add(this.instructionsText);
      this.menu.height = Math.min(this.menu.height, window.innerHeight);
  */
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;
