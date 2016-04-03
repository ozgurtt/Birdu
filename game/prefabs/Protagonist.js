'use strict';

var movement_speed = 90;
var drag = 75;

var Protagonist = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'b-1', frame);

  this.anchor.setTo(0.5, 0.5);

  // add and play animations
  this.animations.add('idling', [0,1,2,3], 12, true);
  this.animations.play('idling');

  // Bird PHYSICS
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;
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
  //HORIZONTAL MOVEMENT
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
  {
      this.body.velocity.x = movement_speed;
      this.angle = 15;
  }
  else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
  {
      this.body.velocity.x = -movement_speed;
      this.angle = -15;
  }
  else
  {
    this.angle = 0;
  }

  //VERTICAL MOVEMENT
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
  {
      this.body.velocity.y = -movement_speed;
      this.angle = -15;
  }
  else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
  {
      this.body.velocity.y = movement_speed;
      this.angle = 15;
  }

};

module.exports = Protagonist;
