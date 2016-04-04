'use strict';

var movement_speed = 90;
var drag = 75;
var flap_delay = 60;

var Protagonist = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'b-1', frame);

  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(.5,.5);

  // add and play animations
  this.animations.add('idling', [0,1,2,3], flap_delay, true);
  this.animations.play('idling');

  // Bird PHYSICS
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = true;
  this.game.physics.arcade.gravity.y = 0;
  this.body.collideWorldBounds = true;
  this.body.bounce.set(0.4);

  this.body.drag.x = drag;
  this.body.drag.y = drag;

  //custom properties
  this.alive = false;
};

Protagonist.prototype = Object.create(Phaser.Sprite.prototype);
Protagonist.prototype.constructor = Protagonist;

Protagonist.prototype.update = function() {
  handleMovement(this);

};

function handleMovement(player){
  var moving_vertically = true;
  player.animations.getAnimation('idling').delay = flap_delay / 2;

  //VERTICAL MOVEMENT
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
  }else{
    moving_vertically = false
  }
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
  }
  //NO MOVEMENT
  else if(!moving_vertically)
  {
    player.game.physics.arcade.gravity.y = 90;
    player.animations.getAnimation('idling').delay = flap_delay;
    player.angle = 0;
  }

}

function getProtagonistArea(){
  return this.height * this.width;
}

module.exports = Protagonist;
