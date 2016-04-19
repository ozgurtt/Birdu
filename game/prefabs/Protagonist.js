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
  console.log(this.body.velocity.x);
}

module.exports = Protagonist;
