(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'birdu');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":4,"./states/gameover":5,"./states/menu":6,"./states/play":7,"./states/preload":8}],2:[function(require,module,exports){
'use strict';

var movement_speed = 90;
var drag_value = 75;
var animation_flap_delay_for_8_img_sprite = 60;

var Protagonist = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'b-1', frame);

  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(.5,.5);

  // add animations specific for this sprite, and and play them
  this.animations.add('idling', [0,1,2,3], animation_flap_delay_for_8_img_sprite, true);
  this.animations.play('idling');

  // Bird PHYSICS. We want him to emulate the sky. So he will have to glide a bit before stopping, and will have gravity (check player movement method)
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = true;
  this.game.physics.arcade.gravity.y = 0;
  this.body.collideWorldBounds = true;
  this.body.bounce.set(0.4);
  this.body.drag.setTo(drag_value,drag_value) ;

  //custom properties
  this.alive = false;
};

Protagonist.prototype = Object.create(Phaser.Sprite.prototype);
Protagonist.prototype.constructor = Protagonist;

Protagonist.prototype.update = function() {
  handlePlayerMovement(this);

};

function handlePlayerMovement(player){

  // Prevent directions and space key events bubbling up to browser,
  // since these keys will make web page scroll which is not
  // expected.
  player.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN
  ]);

  var moving_horizontally = true;
  player.animations.getAnimation('idling').delay = animation_flap_delay_for_8_img_sprite / 2;

  //HORIZONTAL MOVEMENT
  if (player.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
  {
    player.game.physics.arcade.gravity.y = 0;
    player.scale.x = Math.abs(player.scale.x); //face sprite right
    player.body.velocity.x = movement_speed;
    player.angle = 15;
  }
  else if (player.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
  {
    player.game.physics.arcade.gravity.y = 0;
    player.scale.x = -1 * Math.abs(player.scale.x);//face sprite left
    player.body.velocity.x = -movement_speed;
    player.angle = -15;
  }else{
    moving_horizontally = false
  }

  //VERTICAL MOVEMENT (put it after horizontal check, so that the direction the bird is looking will consider vertical movement more important than horizontal)
  if (player.game.input.keyboard.isDown(Phaser.Keyboard.UP))
  {
    player.game.physics.arcade.gravity.y = 0;
    player.body.velocity.y = -movement_speed;
    if(player.scale.x > 0){ //sprite is facing right
      player.angle = -15;
    }else{//sprite is facing left
      player.angle = 15;
    }
  }
  else if (player.game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
  {
    player.body.velocity.y = movement_speed;
    if(player.scale.x > 0){ //sprite is facing right
      player.angle = 15;
    }else{//sprite is facing left
      player.angle = -15;
    }
  }
  //NO MOVEMENT
  else if(!moving_horizontally)
  {
    player.game.physics.arcade.gravity.y = 90;
    player.animations.getAnimation('idling').delay = animation_flap_delay_for_8_img_sprite;
    player.angle = 0;
  }

}

function getProtagonistArea(){
  return this.height * this.width;
}

module.exports = Protagonist;

},{}],3:[function(require,module,exports){
'use strict';

var num_enemy_spritesheets = 25;
var animation_flap_delay_for_8_img_sprite = 10;

var Sideways_enemy = function(game,hero) {
  Phaser.Sprite.call(this, game);

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);

  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;

  this.reset(hero);
};

Sideways_enemy.prototype = Object.create(Phaser.Sprite.prototype);
Sideways_enemy.prototype.constructor = Sideways_enemy;

Sideways_enemy.prototype.update = function() {

};

Sideways_enemy.prototype.reset = function(hero) {
  this.exists = true;

  chooseRandomSpriteSheet(this);
  setSpriteSize(hero,this);
  startMovement(this);
};
Sideways_enemy.prototype.revive = Sideways_enemy.prototype.reset; //do the same thing on revive and reset, basically just recycle the sprite

function setSpriteSize(hero,enemy_sprite){
  var hero_area = hero.height * hero.width;
  var my_area = hero_area * (Math.random() * 3 + 0.1) ; //area of this enemy sprite is 0.1 thru 3 times hero's current area
  var side_length = Math.sqrt(my_area);

  enemy_sprite.width = side_length; //forces sprite to be a perfect square, even tho not all sprites are (not good!)
  enemy_sprite.height = side_length;
}

function startMovement(sprite){
  //randomly place sprite's y position such that it will be 100% on screen
  sprite.position.y = (sprite.game.world.height - sprite.height) * Math.random();
  sprite.body.velocity.y = 0;
  sprite.body.allowGravity = false;

  if(Math.random() < 0.5){ //moves from left to right
    //start sprite outside the game on the left side
    sprite.position.x  = - sprite.width;

    sprite.body.velocity.x = 100;
    sprite.scale.x = Math.abs(sprite.scale.x); //face sprite right

  }
  else{ //moves from right to left
    //start sprite outside the game on the right side
    sprite.position.x  = sprite.game.world.width + sprite.width;

    sprite.body.velocity.x = -100;
    sprite.scale.x = -1 * Math.abs(sprite.scale.x); //face sprite left
  }
}

function chooseRandomSpriteSheet(sprite){
  //bird spritesheets are numbered 0-25, choose one at random
  var randImgId = getRandomInt(0, 26);

  //load sprite picture by concatenating the prefix 'b-' with the random sprite number.
  sprite.loadTexture('b-'+randImgId,0,true);

  //play an idling/flapping animation
  var idlingAnimArray = getIdlingAnimationArray(randImgId);
  var animDelay = animation_flap_delay_for_8_img_sprite * (idlingAnimArray.length / 8.0);   //depending on how many images are in the idling animation, adjust the delay such that everyone flaps at the same speed
  sprite.animations.add('idling', idlingAnimArray, animDelay, true);
  sprite.animations.play('idling');
}

//spritesheets have 2, 4, or 8 images in their idling (flapping) animations. Here is that info hard coded
function getIdlingAnimationArray(spritesheet_index){
  switch(spritesheet_index){
    case 1:
    case 5:
    case 7:
    case 8:
    case 9:
    case 14:
    case 17:
    case 20:
    case 22:
      return [0,1,2,3,4,5,6,7];
    case 4:
    case 10:
    case 12:
    case 13:
    case 15:
    case 16:
      return [0,1];
    default:
      return [0,1,2,3];
  }
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = Sideways_enemy;

},{}],4:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],5:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],6:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],7:[function(require,module,exports){

  'use strict';
  //required modules (classes) with the help of browserify
  var Protagonist = require('../prefabs/Protagonist');
  var Sideways_enemy = require('../prefabs/Sideways_enemy');

  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      //add background images
      this.background = this.game.add.sprite(0,0,'background');
      this.background.height = this.game.world.height;
      this.background.width = this.game.world.width;


      this.hero = new Protagonist(this.game, 100, this.game.height/2);
      this.game.add.existing(this.hero);

      // create and add a group to hold our enemies (for sprite recycling)
      this.enemies = this.game.add.group();

      // add a timer
      this.enemyGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * .1, this.generateEnemy, this);
      this.enemyGenerator.timer.start();
    },
    update: function() {
      this.game.physics.arcade.collide(this.hero, this.enemies, this.bird_collision, null, this);
    },
    bird_collision: function (hero, enemy) {
      //one of the objects is the hero, the other is a member of the 'enemies' group.
      //according to phaser docs, if one object is a sprite and the other a group, the sprite will always be the first parameter to collisionCallback function
      var hero_area = Math.abs(this.hero.height * this.hero.width);
      var enemy_area = Math.abs(enemy.height * enemy.width);

      //if the hero is bigger than enemy (which is one of the collision objects), then he grows a bit. If he is smaller than it is game over
      if(hero_area > enemy_area){
        //resize the hero to be a bit bigger than his previous size
        this.hero.scale.x = 1.1 * this.hero.scale.x;
        this.hero.scale.y = 1.1 * this.hero.scale.y;

        //remove the enemy he collides with
        enemy.exists = false;
      }
      else{
        this.game.state.start('gameover');
      }
    },
    generateEnemy: function() { //generate new pipes, recycling if possible
        var enemy = this.enemies.getFirstExists(false);//attempts to get the first element from a group that has its 'exists' property set to false.

        if(enemy) { //non-existing child of this.enemies found! Revive the poor fellow
          enemy.revive(this.hero);
        }else{//child not found, create a new one
          enemy = new Sideways_enemy(this.game,this.hero);
          this.game.add.existing(enemy); //must add to game before adding to group
          this.enemies.add(enemy);
        }
    }

  };

  module.exports = Play;

},{"../prefabs/Protagonist":2,"../prefabs/Sideways_enemy":3}],8:[function(require,module,exports){

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

    this.load.image('background', 'assets/background.png');
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

},{}]},{},[1])