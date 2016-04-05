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
