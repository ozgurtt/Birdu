'use strict';

var drag_value = 75;
var base_hero_x_length_increase = 5;

var Protagonist = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'b-28', frame);
  this.game.global.hero_sprite_number = 28;

  this.anchor.setTo(0.5, 0.5);
  this.scale.x = this.game.global.original_hero_scale;
  this.scale.y = this.game.global.original_hero_scale;

  // add animations + tweens specific for this sprite, and and play them if needed
  this.animations.add('idling', null, this.game.global.fps_of_flapping_sprites, true);
  this.animations.play('idling');

  // Bird PHYSICS. We want him to emulate the sky. So he will have to glide a bit before stopping, and will have gravity (check player movement method)
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = true;
  this.game.physics.arcade.gravity.y = 0;
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
  this.handlePlayerMovement(this);

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

Protagonist.prototype.handlePlayerMovement = function(player){

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
  player.animations.getAnimation('idling').speed = this.game.global.fps_of_flapping_sprites * 2;

  //HORIZONTAL MOVEMENT
  if (player.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
  {
    player.game.physics.arcade.gravity.y = 0;
    player.scale.x = Math.abs(player.scale.x); //face sprite right
    player.body.velocity.x = this.game.global.hero_movement_speed;
    player.angle = 15;
  }
  else if (player.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
  {
    player.game.physics.arcade.gravity.y = 0;
    player.scale.x = -1 * Math.abs(player.scale.x);//face sprite left
    player.body.velocity.x = -this.game.global.hero_movement_speed;
    player.angle = -15;
  }else{
    moving_horizontally = false
  }

  //VERTICAL MOVEMENT (put it after horizontal check, so that the direction the bird is looking will consider vertical movement more important than horizontal)
  if (player.game.input.keyboard.isDown(Phaser.Keyboard.UP))
  {
    player.game.physics.arcade.gravity.y = 0;
    player.body.velocity.y = -this.game.global.hero_movement_speed;
    if(player.scale.x > 0){ //sprite is facing right
      player.angle = -15;
    }else{//sprite is facing left
      player.angle = 15;
    }
  }
  else if (player.game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
  {
    player.body.velocity.y = this.game.global.hero_movement_speed;
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
    player.animations.getAnimation('idling').speed = this.game.global.fps_of_flapping_sprites;
    player.angle = 0;
  }

}


module.exports = Protagonist;
