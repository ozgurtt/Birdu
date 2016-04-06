'use strict';

var num_enemy_spritesheets = 25;
var animation_flap_delay_for_8_img_sprite = 10;

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

  chooseRandomSpriteSheet(this);
  setSpriteSize(hero,this);
  determineSpriteBehavior(this);
};

function setSpriteSize(hero,enemy_sprite){
  var aspect_ratio = Math.abs(enemy_sprite.width / enemy_sprite.height);

  var hero_area = Math.abs(hero.height * hero.width);
  var my_area = hero_area * (Math.random() * 3 + 0.1) ; //area of this enemy sprite is 0.1 thru 3 times hero's current area

  var new_width = Math.sqrt(my_area / aspect_ratio); // Formula is : Area = width * height = width * (width / aspect_ratio)

  enemy_sprite.width = new_width; //forces sprite to be a perfect square, even tho not all sprites are (not good!)
  enemy_sprite.height = new_width * (1 / aspect_ratio);
}

function determineSpriteBehavior(sprite){
  //randomly place sprite's y position such that it will be 100% on screen
  sprite.position.y = (sprite.game.world.height - sprite.height) * Math.random();
  sprite.body.velocity.y = 0;
  sprite.body.allowGravity = false;

  if(Math.random() < 0.5){ //moves from left to right
    //start sprite a little bit outside the game on the left side
    sprite.position.x  = - sprite.width*.5;

    sprite.body.velocity.x = 100;
    sprite.scale.x = Math.abs(sprite.scale.x); //face sprite right

  }
  else{ //moves from right to left
    //start sprite a little bit outside the game on the right side
    sprite.position.x  = sprite.game.world.width + sprite.width*.5;

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

// Returns a uniformly distributed random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = Sideways_enemy;
