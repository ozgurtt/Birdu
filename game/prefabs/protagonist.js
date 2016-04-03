'use strict';

var Protagonist = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'protagonist', frame);

  // initialize your prefab here
  
};

Protagonist.prototype = Object.create(Phaser.Sprite.prototype);
Protagonist.prototype.constructor = Protagonist;

Protagonist.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Protagonist;
