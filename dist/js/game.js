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

var Bird_enemy = function(game, parent) {
  Phaser.Group.call(this, game, parent);

  // initialize your prefab here

};

Bird_enemy.prototype = Object.create(Phaser.Group.prototype);
Bird_enemy.prototype.constructor = Bird_enemy;

Bird_enemy.prototype.update = function() {

  // write your prefab's specific update code here

};

module.exports = Bird_enemy;

},{}],3:[function(require,module,exports){
'use strict';

var movement_speed = 90;
var drag = 75;

var Protagonist = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'b-1', frame);

  this.anchor.setTo(0.5, 0.5);

  // add and play animations
  this.animations.add('my-flap', [0,1,2,3], 12, true);
  this.animations.play('my-flap');

  // enable physics on the bird
  // and disable gravity on the bird
  // until the game is started
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;
  this.alive = false;
  this.body.drag.x = drag;
  this.body.drag.y = drag;

};

Protagonist.prototype = Object.create(Phaser.Sprite.prototype);
Protagonist.prototype.constructor = Protagonist;

Protagonist.prototype.update = function() {
  //HORIZONTAL MOVEMENT
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
  {
      this.body.velocity.x = movement_speed;
      this.angle = 15;
  }
  else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
  {
      this.body.velocity.x = -movement_speed;
      this.angle = -15;
  }
  else
  {
    this.angle = 0;
  }

  //VERTICAL MOVEMENT
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
  {
      this.body.velocity.y = -movement_speed;
      this.angle = -15;
  }
  else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
  {
      this.body.velocity.y = movement_speed;
      this.angle = 15;
  }

};

module.exports = Protagonist;

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
  var enemies = require('../prefabs/Bird_enemy');

  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      //this.game.physics.arcade.gravity.y = 1200;
      this.background = this.game.add.sprite(0,0,'background');
      this.background.height = this.game.world.height;
      this.background.width = this.game.world.width;

      this.hero = new Protagonist(this.game, 100, this.game.height/2);
      this.game.add.existing(this.hero);

      // Prevent directions and space key events bubbling up to browser,
      // since these keys will make web page scroll which is not
      // expected.
      this.game.input.keyboard.addKeyCapture([
          Phaser.Keyboard.LEFT,
          Phaser.Keyboard.RIGHT,
          Phaser.Keyboard.UP,
          Phaser.Keyboard.DOWN,
          Phaser.Keyboard.SPACEBAR
      ]);
    },
    update: function() {

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };

  module.exports = Play;

},{"../prefabs/Bird_enemy":2,"../prefabs/Protagonist":3}],8:[function(require,module,exports){

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
    this.load.spritesheet('b-0', 'assets/birds/b-0.png',70,50);
    this.load.spritesheet('b-1', 'assets/birds/b-1.png',61.25,50);
    this.load.spritesheet('b-2', 'assets/birds/b-2.png',70,50);
    this.load.spritesheet('b-3', 'assets/birds/b-3.png',70,50);
    this.load.spritesheet('b-4', 'assets/birds/b-4.png',70,50);
    this.load.spritesheet('b-5', 'assets/birds/b-5.png',70,50);
    this.load.spritesheet('b-6', 'assets/birds/b-6.png',70,50);
    this.load.spritesheet('b-7', 'assets/birds/b-7.png',70,50);
    this.load.spritesheet('b-8', 'assets/birds/b-8.png',70,50);
    this.load.spritesheet('b-9', 'assets/birds/b-9.png',70,50);
    this.load.spritesheet('b-10', 'assets/birds/b-10.png',70,50);
    this.load.spritesheet('b-11', 'assets/birds/b-11.png',70,50);
    this.load.spritesheet('b-12', 'assets/birds/b-12.png',61,50);
    this.load.spritesheet('b-13', 'assets/birds/b-13.png',70,50);
    this.load.spritesheet('b-14', 'assets/birds/b-14.png',70,50);
    this.load.spritesheet('b-15', 'assets/birds/b-15.png',70,50);
    this.load.spritesheet('b-16', 'assets/birds/b-16.png',70,50);
    this.load.spritesheet('b-17', 'assets/birds/b-17.png',70,50);
    this.load.spritesheet('b-18', 'assets/birds/b-18.png',70,50);
    this.load.spritesheet('b-19', 'assets/birds/b-19.png',70,50);
    this.load.spritesheet('b-20', 'assets/birds/b-20.png',70,50);
    this.load.spritesheet('b-21', 'assets/birds/b-21.png',70,50);
    this.load.spritesheet('b-22', 'assets/birds/b-22.png',70,50);
    this.load.spritesheet('b-23', 'assets/birds/b-23.png',70,50);
    this.load.spritesheet('b-24', 'assets/birds/b-24.png',70,50);
    this.load.spritesheet('b-25', 'assets/birds/b-25.png',70,50);

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