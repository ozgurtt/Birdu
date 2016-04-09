'use strict';

var num_enemy_spritesheets = 25;
var animation_flap_delay_for_8_img_sprite = 10;
//spritesheets of things other than a flapping/idling animation
var forbidden_img_ids_for_flapping = [8,14,16,20,22,23,26,29,25,31,36];

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
  var aspect_ratio = Math.abs(this.width / this.height);

  var hero_area = Math.abs(hero.height * hero.width);
  var my_area = hero_area * (Math.random() * 3.5 + 0.5) ; //area of this enemy sprite is 0.1 thru 3 times hero's current area

  var new_width = Math.sqrt(my_area / aspect_ratio); // Formula is : Area = width * height = width * (width / aspect_ratio)

  this.width = new_width; //forces sprite to be a perfect square, even tho not all sprites are (not good!)
  this.height = new_width * (1 / aspect_ratio);
}

Sideways_enemy.prototype.determineSpriteBehavior = function(){
  //randomly place sprite's y position such that it will be 100% on screen
  this.position.y = (this.game.world.height - this.height) * Math.random() + this.height/2;
  this.body.velocity.y = 0;
  this.body.allowGravity = false;

  if(Math.random() < 0.5){ //moves from left to right
    //start sprite a little bit outside the game on the left side
    this.position.x  = - this.width*.5;

    this.body.velocity.x = 100;
    this.scale.x = Math.abs(this.scale.x); //face sprite right

  }
  else{ //moves from right to left
    //start sprite a little bit outside the game on the right side
    this.position.x  = this.game.world.width + this.width*.5;

    this.body.velocity.x = -100;
    this.scale.x = -1 * Math.abs(this.scale.x); //face sprite left
  }
}

Sideways_enemy.prototype.chooseRandomSpriteSheet = function(){
  //bird spritesheets are numbered 0-25, choose one at random
  var randImgId = this.game.global.getRandomInt(1, 35);

  while(forbidden_img_ids_for_flapping.indexOf(randImgId) > -1 ){
    randImgId = this.game.global.getRandomInt(1, 35);
  }

  //load sprite picture by concatenating the prefix 'b-' with the random sprite number.
  this.loadTexture('b-'+randImgId,0,true);

  //play an idling/flapping animation
  var idlingAnimArray = getIdlingAnimationArray(randImgId);
  var animDelay = animation_flap_delay_for_8_img_sprite * (idlingAnimArray.length / 8.0);   //depending on how many images are in the idling animation, adjust the delay such that everyone flaps at the same speed
  this.animations.add('idling', idlingAnimArray, animDelay, true);
  this.animations.play('idling');
}

//spritesheets have 2, 4, or 8 images in their idling (flapping) animations. Here is that info hard coded
function getIdlingAnimationArray(spritesheet_index){
  switch(spritesheet_index){
    case 5:
    case 10:
    case 15:
    case 18:
    case 30:
    case 32:
    case 33:
      return [0,1,2,3,4,5,6,7];
    case 24:
      return [0,1,2,3,4,5,6];
    case 8:
    case 13:
    case 14:
    case 16:
    case 17:
    case 19:
    case 20:
    case 22:
    case 25:
    case 26:
    case 27:
    case 29:
    case 31:
    case 34:
    case 35:
    case 36:
      return [0,1];
    default:
      return [0,1,2,3];
  }
}

module.exports = Sideways_enemy;
