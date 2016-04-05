
  'use strict';
  //required modules (classes) with the help of browserify
  var Protagonist = require('../prefabs/Protagonist');
  var Sideways_enemy = require('../prefabs/Sideways_enemy');

  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      //add background images
      this.background = this.game.add.sprite(0,0,'background');
      this.background.height = this.game.world.height;
      this.background.width = this.game.world.width;


      this.hero = new Protagonist(this.game, 100, this.game.height/2);
      this.game.add.existing(this.hero);

      // create and add a group to hold our enemies (for sprite recycling)
      this.enemies = this.game.add.group();
      for(var i=0;i<20;i++){
        this.generateEnemy();
      }
    },
    update: function() {
      this.game.physics.arcade.collide(this.hero, this.enemies, this.bird_collision, null, this);
    },
    bird_collision: function (hero, enemy) {
      //one of the objects is the hero, the other is a member of the 'enemies' group.
      //according to phaser docs, if one object is a sprite and the other a group, the sprite will always be the first parameter to collisionCallback function
      var hero_area = this.hero.height * this.hero.width;
      var enemy_area = enemy.height * enemy.width;

      //if the hero is bigger than enemy (which is one of the collision objects), then he grows a bit. If he is smaller than it is game over
      if(hero_area > enemy_area){
        //resize the hero to be a bit bigger than his previous size
        var new_scale = 1.1 * this.hero.scale.x;
        this.hero.scale.setTo(new_scale,new_scale);

        //remove the enemy he collides with
        enemy.exists = false;
      }
      else{
        this.game.state.start('gameover');
      }
    },
    generateEnemy: function() { //generate new pipes, recycling if possible
        var enemy = this.enemies.getFirstExists(false);//attempts to get the first element from a group that has it's exists property set to false.
        if(!enemy) { //If the pipes group doesn't have any non-existant children, we have to create a new PipeGroup.
            enemy = new Sideways_enemy(this.game,this.hero);
            this.game.add.existing(enemy); //must add to game before adding to group
            this.enemies.add(enemy);
        }
        enemy.reset(this.hero);//set enemy to new location, movement pattern, size, spritesheet, etc
    }

  };

  module.exports = Play;
