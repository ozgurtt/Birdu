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
},{"./states/boot":5,"./states/gameover":6,"./states/menu":7,"./states/play":8,"./states/preload":9}],2:[function(require,module,exports){
'use strict';



/*

ENTIRE CLASS COPY + PASTED FROM  http://jsfiddle.net/lewster32/0yvemxnw/

I, James Lowrey, did not write this

*/





var PieProgress = function(game, x, y, radius, color, angle, text) {
  this._radius = radius;
  this._progress = 1;
  this.bmp = game.add.bitmapData(radius * 2, radius * 2);
  Phaser.Sprite.call(this, game, x, y, this.bmp);

  this.anchor.setTo(0.5,0.5);
  this.angle = angle || -90;
  this.color = color || "#fff";
  this.updateProgress();

  this.textItem = this.game.add.text(0,0, text, {font: "25px Arial", fill: "#ffffff", stroke: "#535353", strokeThickness: 5});
  this.textItem.anchor.setTo(0.5, 0.5);
  this.addChild(this.textItem);
  this.textItem.angle = -this.angle;
  this._text = text;
}

PieProgress.prototype = Object.create(Phaser.Sprite.prototype);
PieProgress.prototype.constructor = PieProgress;

PieProgress.prototype.updateProgress = function() {
    var progress = this._progress;
    progress = Phaser.Math.clamp(progress, 0.00001, 0.99999);

    this.bmp.clear();
    this.bmp.ctx.fillStyle = this.color;
    this.bmp.ctx.beginPath();
    this.bmp.ctx.arc(this._radius, this._radius, this._radius, 0, (Math.PI * 2) * progress, true);
    this.bmp.ctx.lineTo(this._radius, this._radius);
    this.bmp.ctx.closePath();
    this.bmp.ctx.fill();
    this.bmp.dirty = true;
}

Object.defineProperty(PieProgress.prototype, 'textValue', {
    get: function() {
        return this._text;
    },
    set: function(val) {
        this._text = val;
        this.textItem.setText(this.textValue);
    }
});

Object.defineProperty(PieProgress.prototype, 'radius', {
    get: function() {
        return this._radius;
    },
    set: function(val) {
        this._radius = (val > 0 ? val : 0);
        this.bmp.resize(this._radius * 2, this._radius * 2);
        this.updateProgress();
    }
});

Object.defineProperty(PieProgress.prototype, 'progress', {
    get: function() {
        return this._progress;
    },
    set: function(val) {
        this._progress = Phaser.Math.clamp(val, 0, 1);
        this.updateProgress();
    }
});

module.exports = PieProgress;

},{}],3:[function(require,module,exports){
'use strict';

var drag_value = 70;
var grav_value = drag_value + 30;
var base_hero_x_length_increase = 5;
var prev_pointer= {
  x: 0,
  y: 0,
  reachedPrevPointer:true
}
var pixel_margin_around_pointer_destination_goal = 1;
var no_movement = 10;

var Protagonist = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'b-28', frame);
  this.game.global.hero_sprite_number = 28;

  this.anchor.setTo(0.5, 0.5);
  this.scale.x = this.game.global.original_hero_scale;
  this.scale.y = this.game.global.original_hero_scale;

  // add animations + tweens specific for this sprite, and and play them if needed
  this.animations.add('idling', null, this.game.global.fps_of_flapping_sprites, true);
  this.animations.play('idling');

  // Bird PHYSICS. We want him to emulate the sky. So he will have to glide a bit before stopping, and will have gravity
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = true;
  this.body.gravity.y = grav_value;
  this.body.collideWorldBounds = true;
  this.body.bounce.set(0.4);
  this.body.drag.setTo(drag_value,drag_value) ;

  //start at center of screen
  this.position.setTo(game.world.centerX,game.world.centerY);

  //add an emitter to show little meat crumbs when this hero eats something
  this.emitter = this.game.add.emitter(0,0, 10);
  this.emitter.makeParticles('meat');
  this.emitter.setRotation(-100, 100);
  this.emitter.setXSpeed(-200,200);
  this.emitter.setYSpeed(-200,0);
  this.emitter.minParticleScale = 1;
  this.emitter.maxParticleScale = 1.2;
};

Protagonist.prototype = Object.create(Phaser.Sprite.prototype);
Protagonist.prototype.constructor = Protagonist;

Protagonist.prototype.update = function() {
  this.handlePlayerMovement();

  //emitter particles fade out over time
  this.emitter.forEachAlive(function(p){
		p.alpha = p.lifespan / this.lifespan;
  },this.emitter);


};

Protagonist.prototype.showCrumbs = function(){
  this.emitter.width = this.width;
  this.emitter.height = this.height;
  this.emitter.y = this.y;
  this.emitter.x = this.x;

  this.emitter.start(true, 1000, 100, this.game.global.getRandomInt(4,6) ); //particles emit at 100 ms, live for 100ms, 2 at a time
}

//when hero collides with an enemy that has a smaller area than him, must increase hero's size by an amount proportional to that area
Protagonist.prototype.sizeIncrease = function(enemy_area){
  var hero_area = this.game.global.area(this);

  var area_ratio = enemy_area / hero_area;
  var width_increase_size = base_hero_x_length_increase *  area_ratio;

  width_increase_size *= Math.sign(this.width);//width can be + or -, find its sign so it increases the correct amount
  this.setSizeFromWidth(this.width + width_increase_size);
},

Protagonist.prototype.setSizeFromWidth = function(new_width){
  this.width = new_width; //width is set by setting the 'x' scale under Phaser's hood
  this.scale.y = Math.abs(this.scale.x); // set the y scale to the same amount
},

Protagonist.prototype.handlePlayerMovement = function(){

  var moving_horizontally = true;
  this.animations.getAnimation('idling').speed = this.game.global.fps_of_flapping_sprites * 2;

  //detect mouse/tap clicks, and update hero's desired destination
  if(this.game.input.activePointer.isDown) {
    prev_pointer.x = this.game.input.activePointer.x;
    prev_pointer.y = this.game.input.activePointer.y;
    prev_pointer.reachedPrevPointer = false;
  }

  //move hero towards his desired destination (if he has one made from a click/tap), and turn it off when he reaches it
  if ( !prev_pointer.reachedPrevPointer ){
    //set to true when hero is approx at his destination (prev pointer's (x,y)
    var pixel_margin_around_pointer_destination_goal = 2;
    prev_pointer.reachedPrevPointer =
      this.x < prev_pointer.x+pixel_margin_around_pointer_destination_goal &&
      this.x > prev_pointer.x-pixel_margin_around_pointer_destination_goal &&
      this.y < prev_pointer.y+pixel_margin_around_pointer_destination_goal &&
      this.y > prev_pointer.y-pixel_margin_around_pointer_destination_goal;

    //move the hero towards his destination. Do this after setting the boolean, as the sprite may already be
    //at the desired spot. In which case, it should not move
    if ( !prev_pointer.reachedPrevPointer ){
      this.game.physics.arcade.moveToXY(this, prev_pointer.x, prev_pointer.y, this.game.global.hero_movement_speed);
    }

    //set sprite to face the same X direction that it is moving
    if(Math.sign(this.scale.x) != Math.sign(this.body.velocity.x) ){
      this.scale.x *= -1;
    }
    //set sprite to be angled towards its movement direction a bit
    this.angle = 15 * Math.sign(this.scale.x) * Math.sign(this.body.velocity.y);
  }
  //NOT MOVING
  else{
      this.animations.getAnimation('idling').speed = this.game.global.fps_of_flapping_sprites;
      this.angle = 0;
  }

}


module.exports = Protagonist;

},{}],4:[function(require,module,exports){
'use strict';

var num_enemy_spritesheets = 25;
//spritesheets of things other than a flapping/idling animation
var non_flapping_sprite_img_ids = [8,14,16,20,22,23,26,29,25,31,36];

var Sideways_enemy = function(game,hero) {
  Phaser.Sprite.call(this, game);

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);

  //kill sprite if it moves out of bounds of game screen
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;

  this.createNewEnemyBehaviors(hero);
};

Sideways_enemy.prototype = Object.create(Phaser.Sprite.prototype);
Sideways_enemy.prototype.constructor = Sideways_enemy;

Sideways_enemy.prototype.update = function() {

};

Sideways_enemy.prototype.createNewEnemyBehaviors = function(hero) {
  this.reset(0,0);//This moves the Game Object to the given x/y world coordinates and sets fresh, exists, visible and renderable to true.

  this.chooseRandomSpriteSheet();
  this.setSpriteSize(hero);
  this.determineSpriteBehavior();
};

Sideways_enemy.prototype.setSpriteSize = function(hero){
  var hero_area = this.game.global.area(hero);

  //how big enemy sprites can get depends on the hero's current size, and the game's level
  var my_area = hero_area;
  switch(this.game.global.level){
    case 0:
      my_area *= (Math.random() * 2 + 0.5);
      break;
    case 1:
      my_area *= (Math.random() * 2.5 + .6);
      break;
    case 2:
      my_area *= (Math.random() * 3 + 0.7);
      break;
    case 3:
      my_area *= (Math.random() * 3.5 + 0.85);
      break;
    case 4:
      my_area *= (Math.random() * 3.5 + 0.9);
      break;
    case 5:
      my_area *= (Math.random() * 4 + 0.93);
      break;
    default:
      my_area *= (Math.random() * 4 + 0.945);
      break;
  }

  my_area = Math.floor(my_area,this.game.width / 10);

  var aspect_ratio = Math.abs(this.width / this.height);
  var new_width = Math.sqrt(my_area / aspect_ratio); // Formula is : Area = width * height = width * (width / aspect_ratio)

  this.width = new_width;
  this.scale.y = Math.abs(this.scale.x);
}

Sideways_enemy.prototype.determineSpriteBehavior = function(){
  //randomly place sprite's y position such that it will be 100% on screen
  this.position.y = (this.game.world.height - this.height) * Math.random() + this.height/2;
  this.body.velocity.y = 0;
  this.body.allowGravity = false;

  if(Math.random() < 0.5){ //moves from left to right
    //start sprite a little bit outside the game on the left side
    this.position.x  = - this.width*.5;

    this.body.velocity.x = this.game.global.hero_movement_speed * .9;
    this.scale.x = Math.abs(this.scale.x); //face sprite right

  }
  else{ //moves from right to left
    //start sprite a little bit outside the game on the right side
    this.position.x  = this.game.world.width + this.width*.5;

    this.body.velocity.x = -this.game.global.hero_movement_speed * .9;
    this.scale.x = -1 * Math.abs(this.scale.x); //face sprite left
  }
}

Sideways_enemy.prototype.chooseRandomSpriteSheet = function(){
  //bird spritesheets are numbered 0-25, choose one at random
  var randImgId = this.game.global.getRandomInt(1, 35);

  while(randImgId != this.game.global.hero_sprite_number &&
    non_flapping_sprite_img_ids.indexOf(randImgId) > -1 ){
    randImgId = this.game.global.getRandomInt(1, 35);
  }

  //load sprite picture by concatenating the prefix 'b-' with the random sprite number.
  this.loadTexture('b-'+randImgId,0,true);

  //play an idling/flapping animation
  this.animations.add('idling', null,this.game.global.fps_of_flapping_sprites,true);
  this.animations.play('idling');
}

module.exports = Sideways_enemy;

},{}],5:[function(require,module,exports){

'use strict';

function Boot() {

}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');

    //set up global variables and functions
    this.game.global = {
      // Returns a uniformly distributed random integer between min (included) and max (excluded)
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
  }

};

module.exports = Boot;

},{}],6:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  init: function(gameScoreValue) {
    this.gameScore = gameScoreValue;
  },
  create: function () {
    //reset game variables
    this.game.global.level = 0;

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
        this.congratsTextString += "\nHigh Score: ";

        var new_highscore_txt = "";
        if (this.gameScore > max){
          localStorage["maxScore"] = this.gameScore;
          max = this.gameScore;
          new_highscore_txt += "\nNew High Score! ";
        }

        this.congratsTextString += max+new_highscore_txt;
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

},{}],7:[function(require,module,exports){

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
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center',stroke:"#000000", strokeThickness:2};

    //main image/logo + its animations
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'b-28');
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

    //title of game text
    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'Birdu', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    style.font = '18px Arial';

    //display high score if possible
    if( typeof(Storage) !== "undefined") {
      var max = localStorage["maxScore"] || 0; //default value of 0 is it does not exist
      this.maxScore = this.game.add.text(this.game.world.centerX, this.titleText.y + this.titleText.height/2 + 25, 'High Score: '+max, style);
      this.maxScore.anchor.setTo(0.5, 0.5);
    }

    //tell user how to play (text)
    this.instructionsText = this.game.add.text(this.game.world.centerX, this.titleText.y + 100, 'Eat smaller birds to survive. Click to play!',style);
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

},{}],8:[function(require,module,exports){

  'use strict';
  //required modules (classes) with the help of browserify
  var Protagonist = require('../prefabs/Protagonist');
  var Sideways_enemy = require('../prefabs/Sideways_enemy');
  var PieProgress = require('../prefabs/PieProgress');
  var text_margin_from_side_of_screen = 20;
  var progress_bar_radius = 32;

  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      //add background images
      this.background = this.game.add.sprite(0,0,'background');
      this.background.height = this.game.world.height;
      this.background.width = this.game.world.width;

      //Create the score label
      this.createScore();

      //progress bar
      this.progress_bar = new PieProgress(this.game,
        text_margin_from_side_of_screen+progress_bar_radius,
        text_margin_from_side_of_screen+progress_bar_radius,
        progress_bar_radius, "#fff",-90, this.game.global.level);
      this.progress_bar.progress = 0;

      this.game.world.add(this.progress_bar);

      //hero/player! Create last so he appears over top of other elements
      this.hero = new Protagonist(this.game, 100, this.game.height/2);
      this.game.add.existing(this.hero);

      // create and add a group to hold our enemies (for sprite recycling)
      this.enemies = this.game.add.group();

      // add a timer
      this.enemyGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * .4, this.generateEnemy, this);
      this.enemyGenerator.timer.start();

      //load audio
      this.eating_sound = this.game.add.audio('bite');
    },
    update: function() {
      this.game.physics.arcade.collide(this.hero, this.enemies, this.bird_collision, null, this);

      //While there is score in the score buffer, add it to the actual score
      if(this.scoreBuffer > 0){
          this.score += 1;
          this.scoreLabel.text = this.score;

          this.scoreBuffer--;
      }
    },
    //function to create an cool animating score, which will travel up to the player's total score, and disappear.
    createScoreAnimation: function(x, y, score){
        //Create a new label for the score
        var scoreAnimation = this.game.add.text(x, y, score.toString(), {font: "15px Arial", fill: "#39d179", stroke: "#ffffff", strokeThickness: 4});
        scoreAnimation.anchor.setTo(0.5, 0);

        //Tween this score label to the total score label
        var scoreTween = this.game.add.tween(scoreAnimation).to({x:this.scoreLabel.x, y: this.scoreLabel.y}, 800, Phaser.Easing.Exponential.In, true);

        //When the animation finishes, destroy this score label, trigger the total score labels animation and add the score
        scoreTween.onComplete.add(function(){
            scoreAnimation.destroy();
            this.scoreLabelTween.start();
            this.scoreBuffer += score;
        }, this);
    },
    //make player score visible at top of screen
    createScore: function(){
      this.score = 0; //players actual score
      this.scoreBuffer = 0; //how many points the player has that need to be “animated” into the main score

      //Create the score label
      this.scoreLabel = this.game.add.text(this.game.world.width - text_margin_from_side_of_screen, text_margin_from_side_of_screen, "0", {font: "45px Arial", fill: "#ffffff", stroke: "#535353", strokeThickness: 10});
      this.scoreLabel.anchor.setTo(1, 0);

      //Create a tween to grow (for 200ms) and then shrink back to normal size (in 200ms)
      this.scoreLabelTween = this.add.tween(this.scoreLabel.scale).to({ x: 1.5, y: 1.5}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);
    },
    bird_collision: function (hero, enemy) {
      this.eating_sound.play();

      //one of the objects is the hero, the other is a member of the 'enemies' group.
      //according to phaser docs, if one object is a sprite and the other a group, the sprite will always be the first parameter to collisionCallback function
      var hero_area = this.game.global.area(this.hero);
      var enemy_area = this.game.global.area(enemy);

      //if the hero is bigger than enemy (which is one of the collision objects), then he grows a bit. If he is smaller than it is game over
      if(hero_area > enemy_area){
        //increase hero's size and show some cool animations when he eats
        this.hero.sizeIncrease(enemy_area);
        this.hero.showCrumbs();
        this.eatingTween = this.add.tween(this.hero.scale).to({ x: this.hero.scale.x * 1.2, y: this.hero.scale.y * 1.2},75,
          Phaser.Easing.Linear.In).to({ x: this.hero.scale.x, y: this.hero.scale.y}, 75, Phaser.Easing.Linear.In);
        this.eatingTween.start();

        //show this meal's score travel up towards total score
        this.createScoreAnimation(this.hero.x,this.hero.y,Math.round(Math.sqrt(enemy_area)));

        //removes the enemy hero collides with, makes enemy availble for recycling
        enemy.exists = false;

        //check for a level increase
        if( this.game.global.area(this.hero) > this.game.global.level_up_hero_area){
          this.game.global.levelUp(this.game,this.hero,this.enemies);
        }

        //show level progress (after updating level)
        this.progress_bar.progress = this.game.global.area(this.hero) / this.game.global.level_up_hero_area;
        this.progress_bar.textValue = this.game.global.level;
      }
      else{
        this.game.state.start('gameover',true,false, this.score + this.scoreBuffer);
      }
    },
    generateEnemy: function() { //generate new pipes, recycling if possible
        var enemy = this.enemies.getFirstExists(false);//attempts to get the first element from a group that has its 'exists' property set to false.

        if(enemy) { //non-existing child of this.enemies found! Reset the poor fellow
          enemy.createNewEnemyBehaviors(this.hero);
        }else{//child not found, create a new one
          enemy = new Sideways_enemy(this.game,this.hero);
          this.game.add.existing(enemy); //must add to game before adding to group
          this.enemies.add(enemy);
        }
    }

  };

  module.exports = Play;

},{"../prefabs/PieProgress":2,"../prefabs/Protagonist":3,"../prefabs/Sideways_enemy":4}],9:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    //loading image while loading other assets
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.asset = this.add.sprite(0, this.game.height/2, 'preloader'); //positions loading icon on left side of game, middle of screen
    this.asset.anchor.setTo(0, 0.5);//loading icon's anchor is its left side, middle of its height
    this.asset.width = this.game.width;//loading icon is the entire games width
    this.load.setPreloadSprite(this.asset);//loading icon will grow to the right, completing when it hits the right side

    //spritesheets
    this.load.spritesheet('b-10', 'assets/birds/b-10.png', 114.00000000000000000000, 93);
    this.load.spritesheet('b-11', 'assets/birds/b-11.png', 118.00000000000000000000, 100);
    this.load.spritesheet('b-12', 'assets/birds/b-12.png', 131.00000000000000000000, 101);
    this.load.spritesheet('b-13', 'assets/birds/b-13.png', 117.00000000000000000000, 88);
    this.load.spritesheet('b-14', 'assets/birds/b-14.png', 117.00000000000000000000, 95);
    this.load.spritesheet('b-15', 'assets/birds/b-15.png', 123.00000000000000000000, 72);
    this.load.spritesheet('b-16', 'assets/birds/b-16.png', 128.00000000000000000000, 98);
    this.load.spritesheet('b-17', 'assets/birds/b-17.png', 117.00000000000000000000, 101);
    this.load.spritesheet('b-18', 'assets/birds/b-18.png', 115.00000000000000000000, 94);
    this.load.spritesheet('b-19', 'assets/birds/b-19.png', 117.00000000000000000000, 85);
    this.load.spritesheet('b-1', 'assets/birds/b-1.png', 119.00000000000000000000, 78);
    this.load.spritesheet('b-20', 'assets/birds/b-20.png', 121.00000000000000000000, 100);
    this.load.spritesheet('b-21', 'assets/birds/b-21.png', 120.00000000000000000000, 94);
    this.load.spritesheet('b-22', 'assets/birds/b-22.png', 115.00000000000000000000, 96);
    this.load.spritesheet('b-23', 'assets/birds/b-23.png', 115.00000000000000000000, 82);
    this.load.spritesheet('b-24', 'assets/birds/b-24.png', 115.00000000000000000000, 82);
    this.load.spritesheet('b-25', 'assets/birds/b-25.png', 124.00000000000000000000, 102);
    this.load.spritesheet('b-26', 'assets/birds/b-26.png', 120.00000000000000000000, 132);
    this.load.spritesheet('b-27', 'assets/birds/b-27.png', 119.00000000000000000000, 110);
    this.load.spritesheet('b-28', 'assets/birds/b-28.png', 123.00000000000000000000, 96);
    this.load.spritesheet('b-29', 'assets/birds/b-29.png', 116.00000000000000000000, 87);
    this.load.spritesheet('b-2', 'assets/birds/b-2.png', 119.00000000000000000000, 81);
    this.load.spritesheet('b-30', 'assets/birds/b-30.png', 117.00000000000000000000, 115);
    this.load.spritesheet('b-31', 'assets/birds/b-31.png', 119.00000000000000000000, 121);
    this.load.spritesheet('b-32', 'assets/birds/b-32.png', 127.00000000000000000000, 148);
    this.load.spritesheet('b-33', 'assets/birds/b-33.png', 126.00000000000000000000, 99);
    this.load.spritesheet('b-34', 'assets/birds/b-34.png', 125.00000000000000000000, 102);
    this.load.spritesheet('b-35', 'assets/birds/b-35.png', 117.00000000000000000000, 104);
    this.load.spritesheet('b-36', 'assets/birds/b-36.png', 118.00000000000000000000, 107);
    this.load.spritesheet('b-3', 'assets/birds/b-3.png', 119.00000000000000000000, 85);
    this.load.spritesheet('b-4', 'assets/birds/b-4.png', 119.00000000000000000000, 83);
    this.load.spritesheet('b-5', 'assets/birds/b-5.png', 113.00000000000000000000, 77);
    this.load.spritesheet('b-6', 'assets/birds/b-6.png', 124.00000000000000000000, 98);
    this.load.spritesheet('b-7', 'assets/birds/b-7.png', 115.00000000000000000000, 72);
    this.load.spritesheet('b-8', 'assets/birds/b-8.png', 123.00000000000000000000, 107);
    this.load.spritesheet('b-9', 'assets/birds/b-9.png', 120.00000000000000000000, 94);

    //load static images
    this.load.image('meat', 'assets/meat.png');
    this.load.image('background', 'assets/background.png');

    //load sounds
    this.load.audio('bite', 'assets/audio/bite.wav');
    this.load.audio('shrink', 'assets/audio/shrink.wav');
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

},{}]},{},[1])