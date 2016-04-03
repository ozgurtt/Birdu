'use strict';

var Bird_enemy = function(game, parent) {
  Phaser.Group.call(this, game, parent);

  // initialize your prefab here

};

Bird_enemy.prototype = Object.create(Phaser.Group.prototype);
Bird_enemy.prototype.constructor = Bird_enemy;

Bird_enemy.prototype.update = function() {

  // write your prefab's specific update code here

};

module.exports = Bird_enemy;
