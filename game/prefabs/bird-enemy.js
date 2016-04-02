'use strict';

var Bird-enemy = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'bird-enemy', frame);

  // initialize your prefab here

};

Bird-enemy.prototype = Object.create(Phaser.Sprite.prototype);
Bird-enemy.prototype.constructor = Bird-enemy;

Bird-enemy.prototype.update = function() {
  
  // write your prefab's specific update code here

};

module.exports = Bird-enemy;
