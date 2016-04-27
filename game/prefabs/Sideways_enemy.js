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
