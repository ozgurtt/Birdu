(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var Cordova_Api_Manager = function() {  }
Cordova_Api_Manager.prototype.constructor = Cordova_Api_Manager;

Cordova_Api_Manager.prototype = {
    cordovaDeviceReady: function(game){
      /*
      Cordova's function that signals the devicec is ready. add listeners and Cordova API calls here.

      When an event handler gets called (all functions in this object are event handlers),
      "this" no longer references the "Cordova_Api_Manager" object, instead it is global scope.
      You need to capture "this" into a local variable that the functions will capture.
      http://stackoverflow.com/questions/1081499/accessing-an-objects-property-from-an-event-listener-call-in-javascript?answertab=votes#tab-top

      There is a bit of a hack here. Cordova API calls typically have no parameters, but I need to reference this current object (and the Phaser game in later API calls)
      So 'this' will be saved to a variable, and when the cordovaDeviceReady function is called in a different context, it will have a
      saved reference to the needed objects.

      Also, this function returns a function (a parameter-less one). This is because Cordova API calls don't usually have parameters, but
      I need to access the Phaser game. So I can pass down references in these functions, and return ones Cordova can use.
      */

      var context = this;
      return function(){
        console.log("CORDOVA DEVICE APIS READY AND AVAILABLE");

        document.addEventListener("pause", context.onPauseByCordova(game), false);
        document.addEventListener("resume", context.onResumeByCordova(game), false);
      }
    },
    onPauseByCordova: function(game){
      //the actual onPause function used by cordova cannot have parameters, but needs a way to reference the game.
      //So the 'game' parameter acts as a saved reference to the Phaser game, and a parameter-less function is returned for Cordova's API call
      return function(){
        console.log("Cordova has paused the game");

        if( game.state.current == "play" ){//if play state is active, call the play state's pause function (which will alter the UI)
          game.state.states.play.pauseGame(); //call the play state's pauseGame function
        }

        game.paused = true; //pause the game last (since previous functions may modify the game or UI)
      }
    },
    onResumeByCordova: function(game){
      return function(){
        console.log("Cordova has resumed the game");

        if( game.state.current != "play" ){//if play state is NOT active, avoid resuming the game (allow the user to resume it)
          game.paused = false; //actually resume the game
        }
      }
    }
  }

module.exports = Cordova_Api_Manager;

},{}],2:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'birdu');
  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  //Call to use Cordova APIs. CordovaHelper will take care of everything.
  var CordovaHelper = require('../assets/Cordova_Api_Manager');//this is the path to access assets from the build ('dist') folder
  document.addEventListener("deviceready", new CordovaHelper().cordovaDeviceReady(game), false);

  game.state.start('boot');
};

},{"../assets/Cordova_Api_Manager":1,"./states/boot":6,"./states/gameover":7,"./states/menu":8,"./states/play":9,"./states/preload":10}],3:[function(require,module,exports){
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

  this.textItem = this.game.add.text(0,0, text, {font: "26px papercuts", fill: "#ffffff", stroke: "#535353", strokeThickness: 5});
  this.textItem.anchor.setTo(0.5, 0.4);
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

},{}],4:[function(require,module,exports){
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
  Phaser.Sprite.call(this, game, x, y, 'b-'+game.global.hero_sprite_number, frame);

  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(this.game.global.original_hero_scale, this.game.global.original_hero_scale);

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

  width_increase_size *= this.game.global.sign(this.width);//width can be + or -, find its sign so it increases the correct amount
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

  //user is pressing the keyboard
  if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP)
  || this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)
  || this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)
  || this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ){
    prev_pointer.reachedPrevPointer = true; //turn off last mouse/tap movement

    //We know user is pressing up, down, left, or right. Check which on it is and adjust accordingly
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)){         this.body.velocity.y = -this.game.global.hero_movement_speed; } //Up
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){  this.body.velocity.y = this.game.global.hero_movement_speed;  } //Down
    else{ this.body.gravity.y = 0; } //moving horizontally. Set gravity to 0

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){this.body.velocity.x = this.game.global.hero_movement_speed; }  //Right
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){ this.body.velocity.x = -this.game.global.hero_movement_speed;  }//Left

    this.setLookingDirection();
  }
  //move hero towards his desired destination (if he has one made from a click/tap), and turn it off when he reaches it
  else if ( !prev_pointer.reachedPrevPointer ){
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

    this.setLookingDirection();
  }
  //NOT MOVING
  else{
    this.body.gravity.y = grav_value;
    this.animations.getAnimation('idling').speed = this.game.global.fps_of_flapping_sprites;
    this.angle = 0;
  }

}

Protagonist.prototype.setLookingDirection = function(){
  //set sprite to face the same X direction that it is moving
  if(Math.abs(this.body.velocity.x) > 0 &&//need to check for zero in case user moves straight up/down
    this.game.global.sign(this.scale.x) != this.game.global.sign(this.body.velocity.x) ){
    this.scale.x *= -1;
  }
  //set sprite to be angled towards its movement direction a bit
  this.angle = 15 * this.game.global.sign(this.scale.x) * this.game.global.sign(this.body.velocity.y);
}

module.exports = Protagonist;

},{}],5:[function(require,module,exports){
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
  var area_range = Math.min(3.5, 1.75 + this.game.global.level * .4);
  var min_area = Math.min(0.945, 0.6 + this.game.global.level * .09);

  var my_area = hero_area * (area_range * Math.random() + min_area);

  var aspect_ratio = Math.abs(this.width / this.height);
  var new_width = Math.sqrt(my_area / aspect_ratio); // Formula is : Area = width * height = width * (width / aspect_ratio)

  this.width = new_width;
  this.scale.y = Math.abs(this.scale.x);
}

Sideways_enemy.prototype.determineSpriteBehavior = function(){
  //randomly place sprite's y position such that it will be 100% on screen
  this.position.y = (this.game.world.height - this.height) * Math.random() + this.height/2;
  this.body.velocity.y = 0;
  this.body.velocity.x = this.game.global.hero_movement_speed * (Math.random() * 0.1 + Math.min(0.98, 0.9 + this.game.global.level * 0.01));
  this.body.allowGravity = false;

  if(Math.random() < 0.5){ //moves from left to right
    //start sprite a little bit outside the game on the left side
    this.position.x  = - this.width*.5;

    this.scale.x = Math.abs(this.scale.x); //face sprite right
  }
  else{ //moves from right to left
    //start sprite a little bit outside the game on the right side
    this.position.x  = this.game.world.width + this.width*0.5;

    this.scale.x = -1 * Math.abs(this.scale.x); //face sprite left

    this.body.velocity.x *= -1;//reverse movement direction
  }
}

Sideways_enemy.prototype.chooseRandomSpriteSheet = function(){
  //bird spritesheets are numbered 0-25, choose one at random
  var randImgId = this.game.global.getRandomInt(1, 35);

  while(randImgId == this.game.global.hero_sprite_number ||
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

},{}],6:[function(require,module,exports){

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

},{}],7:[function(require,module,exports){

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

},{}],8:[function(require,module,exports){

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
    this.background_music = this.game.add.audio('background-music');
    this.background_music.loopFull(0.5);

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

},{}],9:[function(require,module,exports){

  'use strict';
  //required modules (classes) with the help of browserify
  var Protagonist = require('../prefabs/Protagonist');
  var Sideways_enemy = require('../prefabs/Sideways_enemy');
  var PieProgress = require('../prefabs/PieProgress');
  var text_margin_from_side_of_screen = 20;
  var progress_bar_radius = 32;
  var pause_icon_length = 36;

  function Play() {}

  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      //add background images
      this.background = this.game.add.sprite(0,0,'background');
      this.background.height = this.game.world.height;
      this.background.width = this.game.world.width;

      //Create the score label at top right of screen
      this.scoreLabel = this.game.add.text(this.game.world.width - text_margin_from_side_of_screen,
         text_margin_from_side_of_screen,
         this.game.global.score.toString(),
         this.game.global.score_font_style);
      this.scoreLabel.anchor.setTo(1, 0);
      //Create a tween to grow (for 200ms) and then shrink back to normal size (in 200ms)
      this.scoreLabelTween = this.add.tween(this.scoreLabel.scale).to({ x: 1.5, y: 1.5}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);


      //play/pause icon
      this.pause_icon = this.game.add.sprite(this.game.world.width - text_margin_from_side_of_screen - pause_icon_length/2,
        this.game.world.height - text_margin_from_side_of_screen - pause_icon_length/2,
        'pause');
      this.pause_icon.width = pause_icon_length;
      this.pause_icon.height = pause_icon_length;
      this.pause_icon.anchor.setTo(0.5,0.5);
      this.pause_icon.inputEnabled = true;
      this.pause_icon.events.onInputUp.add(this.pauseGame, this);
      this.game.input.onDown.add(this.resumeGame, this); //add a listener for unpausing the game. Cannot be bound to a sprite or text (as these become paused as well)!!!

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
      // Prevent directions key events bubbling up to browser,
      // since these keys will make web page scroll which is not
      // expected. These inputs can be used by the protagonist prefab
      this.game.input.keyboard.addKeyCapture([
          Phaser.Keyboard.LEFT,
          Phaser.Keyboard.RIGHT,
          Phaser.Keyboard.UP,
          Phaser.Keyboard.DOWN
      ]);

      //load the pause menu (just some text in this game) after the hero, so that it appears over top
      this.pause_text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Paused", this.game.global.score_font_style);
      this.pause_text.anchor.setTo(0.5,0.5);
      this.pause_text.visible = false;

      // create and add a group to hold our enemies (for sprite recycling)
      this.enemies = this.game.add.group();

      // add a timer
      this.enemyGenerator = this.game.time.events.loop(this.game.global.default_time_btw_enemy_spawns, this.generateEnemy, this);
      this.enemyGenerator.timer.start();

      //load audio
      this.eat_sound = this.game.add.audio('bite_friendly');
      this.eaten_sound = this.game.add.audio('bite_scary');
      this.lose_sound = this.game.add.audio('lose');
      this.tweet_sound = this.game.add.audio('tweet');
      this.tweet_sound.play();

      //things to be shown upon leveling up
      this.levelup_sound = this.game.add.audio('levelup');
      this.levelup_text = this.game.add.text(this.game.world.centerX,0,
        "Level Up",
        this.game.global.score_font_style);
      this.levelup_text.anchor.setTo(0.5,0.5);
      this.levelup_text.y = text_margin_from_side_of_screen + this.levelup_text.height/2;
      this.levelup_text.visible = false;

      //combo variables
      this.combo_original_bird_score = 0; //score that is added by eating birds in a combo series. Nothing added from the combo itself
      this.combo_count = 0;
      this.combo_timer = null;
    },
    pauseGame: function() {
      console.log('Gameplay has paused');
      if(!this.game.paused){
        this.pause_icon.loadTexture('play'); //load a different image for play/pause icon

        this.pause_text.visible = true; //open 'pause menu'

        //this.saveGameState();

        this.game.paused = true; //actually pause the game
      }
    },
    saveGameState: function(){
      //save the game's state to local storage
      if( typeof(Storage) !== "undefined") {
          localStorage["level"] = this.game.global.level;
          localStorage["currentGameScore"] = this.game.global.score;
          localStorage["currentGameScoreBuffer"] = this.game.global.scoreBuffer;
      }
    },
    resumeGame: function(){
      if(this.game.paused){
        this.pause_icon.loadTexture('pause');

        this.pause_text.visible = false;

        this.game.paused = false;
      }
    },
    update: function() {
      this.game.physics.arcade.collide(this.hero, this.enemies, this.bird_collision, null, this);

      //While there is score in the score buffer, add it to the actual score
      if(this.game.global.scoreBuffer > 0){
          this.game.global.score += 1;
          this.scoreLabel.text = this.game.global.score.toString();

          this.game.global.scoreBuffer--;
      }
    },
    //function to create an cool animating score, which will travel up to the player's total score, and disappear.
    createScoreAnimation: function(score){
        //Create a new label for the score
        var scoreAnimationText = this.game.add.text(this.hero.x, this.hero.y, score.toString(), this.game.global.score_animating_font_style);
        scoreAnimationText.anchor.setTo(0.5, 0);

        //Tween this score label to the total score label
        var scoreTween = this.add.tween(scoreAnimationText).to({x:this.scoreLabel.x, y: this.scoreLabel.y}, 800, Phaser.Easing.Exponential.In, true);

        //When the animation finishes, destroy this score label, trigger the total score labels animation and add the score
        scoreTween.onComplete.add(function(){
            scoreAnimationText.destroy();
            this.scoreLabelTween.start();
            this.game.global.scoreBuffer += score;
        }, this);
    },
    bird_collision: function (hero, enemy) {
      //one of the objects is the hero, the other is a member of the 'enemies' group.
      //according to phaser docs, if one object is a sprite and the other a group, the sprite will always be the first parameter to collisionCallback function
      var hero_area = this.game.global.area(this.hero);
      var enemy_area = this.game.global.area(enemy);

      //if the hero is bigger than enemy (which is one of the collision objects), then he grows a bit. If he is smaller than it is game over
      if(hero_area > enemy_area){
        this.eat_sound.play();
        //increase hero's size and show some cool animations when he eats
        this.hero.sizeIncrease(enemy_area);
        this.hero.showCrumbs();
        this.eatingTween = this.add.tween(this.hero.scale).to({ x: this.hero.scale.x * 1.2, y: this.hero.scale.y * 1.2},75,
          Phaser.Easing.Linear.In).to({ x: this.hero.scale.x, y: this.hero.scale.y}, 75, Phaser.Easing.Linear.In);
        this.eatingTween.start();

        //show this meal's score travel up towards total score. add it to current combo
        var score_increase = Math.round(Math.sqrt(enemy_area) * (1+this.game.global.level/10) );
        this.createScoreAnimation(score_increase);

        //increase combo and score amount. (Re)start the end-of-combo timer as needed
        this.combo_original_bird_score += score_increase;
        this.combo_count += 1;
        if( this.combo_timer ){//true if it is not null. Thus a timer is already running
          this.game.time.events.remove(this.combo_timer);//stop previous timer from firing the 'completedCombo' events
          this.combo_timer = this.game.time.events.add(Phaser.Timer.SECOND, this.completedCombo, this);//restart the timer
        }else{
          this.combo_timer = this.game.time.events.add(Phaser.Timer.SECOND, this.completedCombo, this);
        }

        //removes the enemy hero collides with, makes enemy availble for recycling
        enemy.exists = false;

        //update progress bar after eating something
        this.progress_bar.progress = this.game.global.area(this.hero) / this.game.global.level_up_hero_area;

        //check for a level increase
        if( this.game.global.area(this.hero) > this.game.global.level_up_hero_area){
          this.game.global.levelUp(this.game,this.hero,this.enemies);

          this.progress_bar.progress = 0;
          this.progress_bar.textValue = this.game.global.level;
        }

        //make birds spawn a little less frequently as their size increases. Put this last, as things above may shrink/grow the hero
        this.enemyGenerator.delay = this.enemySpawnDelay();
      }
      else{
        this.eaten_sound.play();
        this.game.state.start('gameover',true,false);
      }
    },
    enemySpawnDelay(){
      var hero_area_ratio = this.game.global.area(this.hero) / this.game.global.level_up_hero_area;

      //hero's area is >= to level_up_hero_area. Thus he has leveled up, and the tween has not yet ran and reduced his size back to original. Jut set it to original
      if(hero_area_ratio > 1){
        hero_area_ratio = 0;
      }

      //some formula i made up to make spawn time increase as a function of the hero's size
      return this.game.global.default_time_btw_enemy_spawns * (1 + hero_area_ratio * 0.5);
    },
    //Create cool text+tweens for displaying number of combos+how much score it added, then add that score to total
    completedCombo: function(){
      if(this.combo_count > 1){
        var score_combo_adds = Math.round(this.combo_original_bird_score * (1+this.combo_count / 10.0) - this.combo_original_bird_score);

        //Create a new label for displaying how many combos the user got
        var comboText = this.game.add.text(this.hero.x, this.hero.y,
          "Combo x"+this.combo_count.toString(), this.game.global.score_animating_font_style);
        comboText.anchor.setTo(0.5, 0);
        //show the number of combos for a little while. After that delay, show a growing/shrinking tween
        var display_combo_score = this.add.tween(comboText.scale).to({ x: 1.1, y: 1.1}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In,5000)
        //change the text to the score the combo added when first tween starts
        display_combo_score.onComplete.add(function(){
            comboText.setText(score_combo_adds);
        }, this);

        //Tween this score/combo label to the total score label
        var scoreTween = this.add.tween(comboText).to({x:this.scoreLabel.x, y: this.scoreLabel.y}, 800, Phaser.Easing.Exponential.In, true,800);
        //When the animation finishes, destroy this score/combo label, trigger the total score labels animation and add the score
        scoreTween.onComplete.add(function(){
            comboText.destroy();
            this.scoreLabelTween.start();
            this.game.global.scoreBuffer += score_combo_adds;
        }, this);
      }
      //reset combo stats and set the timer to null (it has already completed [hence we're in this function], so we do not need to remove it from events queue)
      this.combo_original_bird_score = 0;
      this.combo_count = 0;
      this.combo_timer = null;
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

},{"../prefabs/PieProgress":3,"../prefabs/Protagonist":4,"../prefabs/Sideways_enemy":5}],10:[function(require,module,exports){

'use strict';
function Preload() {
  this.loading_bar = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    //loading image while loading other assets
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.loading_bar = this.add.sprite(0, this.game.height/2, 'preloader'); //positions loading icon on left side of game, middle of screen
    this.loading_bar.anchor.setTo(0, 0.5);//loading icon's anchor is its left side, middle of its height (so that it is placed vertically in the middle, but only grows to its right)
    this.loading_bar.width = this.game.width;//loading icon is the entire games width
    this.load.setPreloadSprite(this.loading_bar);//loading icon will grow to the right, completing when it hits the right side

    this.loading_text = this.add.text(this.game.world.centerX,
      this.loading_bar.y - this.loading_bar.height / 2 - 25,
      'Loading...', {font: "50px Arial", fill: "#000", stroke: "#fff", strokeThickness: 4});
    this.loading_text.anchor.setTo(0.5,0.5);

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
    this.load.image('play', 'assets/icon_play.png');
    this.load.image('pause', 'assets/icon_pause.png');
    this.load.image('background', 'assets/background.png');

    //load sounds
    this.load.audio('bite_friendly', 'assets/audio/bite_friendly.wav');
    this.load.audio('bite_scary', 'assets/audio/bite_scary.wav');
    this.load.audio('tweet', 'assets/audio/tweet.wav');
    this.load.audio('levelup', 'assets/audio/levelup.wav');
    this.load.audio('background-music', 'assets/audio/the_plucked_bird.wav');
  },
  create: function() {
    this.loading_bar.cropEnabled = false;
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

},{}]},{},[2])