
'use strict';
function GameOver() {}

GameOver.prototype = {
  init: function(gameScoreValue) {
    this.gameScore = gameScoreValue;
  },
  create: function () {
    //set background image
    this.background = this.game.add.sprite(0,0,'background');
    this.background.height = this.game.world.height;
    this.background.width = this.game.world.width;

    //Game Over! text
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center',stroke:"#000000", strokeThickness:2};
    this.titleText = this.game.add.text(this.game.world.centerX, 100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    //new high score text
    style.font = '32px Arial';
    this.congratsTextString = "Better luck next time. ";
    if( typeof(Storage) !== "undefined") { //newHighScore is passed to gameover from play state
        var max = localStorage["maxScore"] || 0; //default value of 0 is it does not exist
        if (this.gameScore > max){
          localStorage["maxScore"] = this.gameScore;
          this.congratsTextString += "\n New High Score: "+this.gameScore
        }
    }

    //generic good job text
    this.congratsText = this.game.add.text(this.game.world.centerX,  this.titleText.y + this.titleText.height/2 + 100, this.congratsTextString, style);
    this.congratsText.anchor.setTo(0.5, 0.5);

    //restart game text
    style.font = '16px Arial';
    this.instructionText = this.game.add.text(this.game.world.centerX, this.congratsText.y + this.congratsText.height/2 + 50, 'Click To Play Again', style);
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;
