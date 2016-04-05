
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    //loading image while loading other assets
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.asset = this.add.sprite(this.width/2, this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.asset);

    //individual images
    this.load.spritesheet('b-0', 'assets/birds/b-0.png',72.75,50);
    this.load.spritesheet('b-1', 'assets/birds/b-1.png',61.25,50);
    this.load.spritesheet('b-2', 'assets/birds/b-2.png',58.75,50);
    this.load.spritesheet('b-3', 'assets/birds/b-3.png',57,50);
    this.load.spritesheet('b-4', 'assets/birds/b-4.png',60,50);
    this.load.spritesheet('b-5', 'assets/birds/b-5.png',61.625,50);
    this.load.spritesheet('b-6', 'assets/birds/b-6.png',57.333,50);
    this.load.spritesheet('b-7', 'assets/birds/b-7.png',58.128,45);
    this.load.spritesheet('b-8', 'assets/birds/b-8.png',49.25,50);
    this.load.spritesheet('b-9', 'assets/birds/b-9.png',63.25,50);
    this.load.spritesheet('b-10', 'assets/birds/b-10.png',45.75,50);
    this.load.spritesheet('b-11', 'assets/birds/b-11.png',72.75,50);
    this.load.spritesheet('b-12', 'assets/birds/b-12.png',61,50);
    this.load.spritesheet('b-13', 'assets/birds/b-13.png',52.25,50);
    this.load.spritesheet('b-14', 'assets/birds/b-14.png',51.4,50);
    this.load.spritesheet('b-15', 'assets/birds/b-15.png',56.5,50);
    this.load.spritesheet('b-16', 'assets/birds/b-16.png',59.5,50);
    this.load.spritesheet('b-17', 'assets/birds/b-17.png',61.8,50);
    this.load.spritesheet('b-18', 'assets/birds/b-18.png',69.5,50);
    this.load.spritesheet('b-19', 'assets/birds/b-19.png',69.5,50);
    this.load.spritesheet('b-20', 'assets/birds/b-20.png',73.25,50);
    this.load.spritesheet('b-21', 'assets/birds/b-21.png',64.167,50);
    this.load.spritesheet('b-22', 'assets/birds/b-22.png',61.8,50);
    this.load.spritesheet('b-23', 'assets/birds/b-23.png',63,50);
    this.load.spritesheet('b-24', 'assets/birds/b-24.png',69.25,50);
    this.load.spritesheet('b-25', 'assets/birds/b-25.png',52.667,50);

    //load static images
    this.load.image('background', 'assets/background.png');

    //load sounds
    this.load.audio('gulp', 'assets/audio/gulp.wav');
    this.load.audio('background-music', 'assets/audio/the_plucked_bird.mp3');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
