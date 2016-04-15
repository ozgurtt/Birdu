
'use strict';
function GameOver() {}

GameOver.prototype = {
  //init takes parameters and sets class variables
  init: function() {

  },
  create: function () {
    //set background image
    this.background = this.game.add.sprite(0,0,'background');
    this.background.height = this.game.world.height;
    this.background.width = this.game.world.width;

    //Game Over! text
    this.titleText = this.game.add.text(this.game.world.centerX, 0, 'Game Over!', this.game.global.title_font_style);
    this.titleText.anchor.setTo(0.5, 0.5);
    this.titleText.y = this.titleText.height/2; //must set after height is established

    //main image/logo + its animations
    this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'b-29');
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

    //new high score text
    this.congratsTextString = "Better luck next time.\n";
    if( typeof(Storage) !== "undefined") { //newHighScore is passed to gameover from play state
        var max = localStorage["maxScore"] || 0; //default value of 0 is it does not exist
        var highscore_txt = "High Score: ";

        var gameScore = this.game.global.score + this.game.global.scoreBuffer;
        if (gameScore > max){
          localStorage["maxScore"] = gameScore;
          max = gameScore;
          highscore_txt = "New "+highscore_txt;
        }

        this.congratsTextString += highscore_txt+max;

        //reset stored game state
        localStorage["level"] = 0;
        localStorage["currentGameScore"] = 0;
        localStorage["currentGameScoreBuffer"] = 0;
    }

    //generic good job text
    this.congratsText = this.game.add.text(this.game.world.centerX,  0, this.congratsTextString, this.game.global.text_font_style);
    this.congratsText.anchor.setTo(0.5, 0.5);
    this.congratsText.y = this.sprite.y + this.sprite.height/2 + this.congratsText.height/2; //must set after height is established

    //restart game text
    this.instructionText = this.game.add.text(this.game.world.centerX, 0, 'Click to play again!', this.game.global.text_font_style);
    this.instructionText.anchor.setTo(0.5, 0.5);
    this.instructionText.y = this.congratsText.y + this.congratsText.height/2 + this.instructionText.height/2; //must set after height is established

    //reset game variables
    this.game.global.level = 0;
    this.game.global.hero_movement_speed = 120;
    this.game.global.score = 0;
    this.game.global.scoreBuffer = 0;

    //ensure that text can fit on screen
    this.titleText.width = Math.min(this.titleText.width, window.innerWidth);
    this.congratsText.width = Math.min(this.congratsText.width, window.innerWidth);
    this.instructionText.width = Math.min(this.instructionText.width, window.innerWidth);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;
