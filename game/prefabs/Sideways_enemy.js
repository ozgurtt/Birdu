'use strict';

var num_enemy_spritesheets = 25;
var animation_flap_delay_for_8_img_sprite = 10;

var Sideways_enemy = function(game, parent) {
  Phaser.Sprite.call(this, game);
  parent.add(this);

  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;

  chooseRandomSpriteSheet(this);
  setSpriteSize(this);
  startMovement(this);
};

Sideways_enemy.prototype = Object.create(Phaser.Sprite.prototype);
Sideways_enemy.prototype.constructor = Sideways_enemy;

Sideways_enemy.prototype.update = function() {

  // write your prefab's specific update code here

};

function setSpriteSize(sprite){

}

function startMovement(sprite){
  //randomly place sprite's y position such that it will be 100% on screen
  sprite.position.y = (sprite.game.world.height - sprite.height) * Math.random();

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
    case 12:
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