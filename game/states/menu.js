
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

    //font styles for all text
    var style = { font: '90px papercuts', fill: '#ffffff', align: 'right', stroke:"#000000", strokeThickness:5 };

    //main image/logo + its animations
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'b-28');
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

    //title of game text
    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'B I R D U', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    style.font = '30px papercuts';
    style.strokeThickness = 2;

    this.maxScore = this.game.add.text(this.game.world.centerX, this.titleText.y + this.titleText.height/2 + 25, '', style);
    this.maxScore.anchor.setTo(0.5, 0.5);

    //display high score if possible
    if( typeof(Storage) !== "undefined") {
      var max = localStorage["maxScore"] || 0; //default value of 0 is it does not exist
      this.maxScore.text = 'High Score: '+max;
    }

    //tell user how to play (text)
    this.instructionsText = this.game.add.text(this.game.world.centerX, this.maxScore.y + 25, 'Eat smaller birds to survive. click to play!',style);
    this.instructionsText.anchor.setTo(0.5, 0.5);

    //start game's music
    this.background_music = this.game.add.audio('background-music');
    this.background_music.loopFull(0.5);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;
