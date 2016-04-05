
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

      // add a timer
      this.enemyGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * .1, this.generateEnemy, this);
      this.enemyGenerator.timer.start();

      //load audio
      this.eating_sound = this.game.add.audio('gulp');
      this.background_music = this.game.add.audio('background-music');
      this.background_music.loopFull(0.6);

    },
    update: function() {
      this.game.physics.arcade.collide(this.hero, this.enemies, this.bird_collision, null, this);
    },
    bird_collision: function (hero, enemy) {
      this.eating_sound.play();

      //one of the objects is the hero, the other is a member of the 'enemies' group.
      //according to phaser docs, if one object is a sprite and the other a group, the sprite will always be the first parameter to collisionCallback function
      var hero_area = Math.abs(this.hero.height * this.hero.width);//must use Math.abs, as 'x' scales can be different, causing negative area values
      var enemy_area = Math.abs(enemy.height * enemy.width);

      //if the hero is bigger than enemy (which is one of the collision objects), then he grows a bit. If he is smaller than it is game over
      if(hero_area > enemy_area){
        //resize the hero to be a bit bigger than his previous size
        this.hero.scale.x = 1.1 * this.hero.scale.x;
        this.hero.scale.y = 1.1 * this.hero.scale.y;

        //remove the enemy he collides with
        enemy.exists = false;
      }
      else{
        this.background_music.stop();
        this.game.state.start('gameover');
      }
    },
    generateEnemy: function() { //generate new pipes, recycling if possible
        var enemy = this.enemies.getFirstExists(false);//attempts to get the first element from a group that has its 'exists' property set to false.

        if(enemy) { //non-existing child of this.enemies found! Reset the poor fellow
          enemy.createNewEnemyBehaviors(this.hero);
        }else{//child not found, create a new one
          enemy = new Sideways_enemy(this.game,this.hero);
          this.game.add.existing(enemy); //must add to game before adding to group
          this.enemies.add(enemy);
        }
    }

  };

  module.exports = Play;
