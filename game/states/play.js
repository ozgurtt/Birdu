
  'use strict';
  //required modules (classes) with the help of browserify
  var Protagonist = require('../prefabs/Protagonist');
  var Sideways_enemy = require('../prefabs/Sideways_enemy');
  var PieProgress = require('../prefabs/PieProgress');
  var text_margin_from_side_of_screen = 20;
  var progress_bar_radius = 32;
  var pause_icon_length = 36;

  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      //add background images
      this.background = this.game.add.sprite(0,0,'background');
      this.background.height = this.game.world.height;
      this.background.width = this.game.world.width;

      //Create the score label
      this.createScore();

      //play+pause icons
      this.pause_icon = this.game.add.sprite(this.game.world.width - text_margin_from_side_of_screen - pause_icon_length/2,
        this.game.world.height - text_margin_from_side_of_screen - pause_icon_length/2,
        'pause');
      this.pause_icon.width = pause_icon_length;
      this.pause_icon.height = pause_icon_length;
      this.pause_icon.anchor.setTo(0.5,0.5);
      this.pause_icon.inputEnabled = true;
      this.pause_icon.events.onInputUp.add(this.pauseGame, this);
      this.game.input.onDown.add(this.unpauseGame, this); //add a listener for unpausing the game. Cannot be bound to a sprite or text (as these become paused as well)!!!

      //progress bar
      this.progress_bar = new PieProgress(this.game,
        text_margin_from_side_of_screen+progress_bar_radius,
        text_margin_from_side_of_screen+progress_bar_radius,
        progress_bar_radius, "#fff",-90, this.game.global.level);
      this.progress_bar.progress = 0;

      this.game.world.add(this.progress_bar);

      //hero/player! Create last so he appears over top of other elements
      this.hero = new Protagonist(this.game, 100, this.game.height/2);
      this.game.add.existing(this.hero);

      //load the pause menu (just some text in this game) after the hero, so that it appears over top
      this.pause_text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Paused", {font: "30px papercuts", fill: "#ffffff", stroke: "#535353", strokeThickness: 10});
      this.pause_text.anchor.setTo(0.5,0.5);
      this.pause_text.visible = false;

      // create and add a group to hold our enemies (for sprite recycling)
      this.enemies = this.game.add.group();

      // add a timer
      this.enemyGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * .4, this.generateEnemy, this);
      this.enemyGenerator.timer.start();

      //load audio
      this.eating_sound = this.game.add.audio('bite');
    },
    pauseGame: function() {
      if(!this.game.paused){
        this.pause_icon.loadTexture('play'); //load a different image for play/pause icon

        this.pause_text.visible = true; //open 'pause menu'

        this.game.paused = true; //actually pause the game
      }
    },
    unpauseGame: function(){
      if(this.game.paused){
        this.pause_icon.loadTexture('pause');

        this.pause_text.visible = false;

        this.game.paused = false;
      }
    },
    update: function() {
      this.game.physics.arcade.collide(this.hero, this.enemies, this.bird_collision, null, this);

      //While there is score in the score buffer, add it to the actual score
      if(this.scoreBuffer > 0){
          this.score += 1;
          this.scoreLabel.text = this.score;

          this.scoreBuffer--;
      }
    },
    //function to create an cool animating score, which will travel up to the player's total score, and disappear.
    createScoreAnimation: function(x, y, score){
        //Create a new label for the score
        var scoreAnimation = this.game.add.text(x, y, score.toString(), {font: "15px papercuts", fill: "#39d179", stroke: "#ffffff", strokeThickness: 4});
        scoreAnimation.anchor.setTo(0.5, 0);

        //Tween this score label to the total score label
        var scoreTween = this.game.add.tween(scoreAnimation).to({x:this.scoreLabel.x, y: this.scoreLabel.y}, 800, Phaser.Easing.Exponential.In, true);

        //When the animation finishes, destroy this score label, trigger the total score labels animation and add the score
        scoreTween.onComplete.add(function(){
            scoreAnimation.destroy();
            this.scoreLabelTween.start();
            this.scoreBuffer += score;
        }, this);
    },
    //make player score visible at top of screen
    createScore: function(){
      this.score = 0; //players actual score
      this.scoreBuffer = 0; //how many points the player has that need to be “animated” into the main score

      //Create the score label
      this.scoreLabel = this.game.add.text(this.game.world.width - text_margin_from_side_of_screen, text_margin_from_side_of_screen, "0", {font: "45px papercuts", fill: "#ffffff", stroke: "#535353", strokeThickness: 10});
      this.scoreLabel.anchor.setTo(1, 0);

      //Create a tween to grow (for 200ms) and then shrink back to normal size (in 200ms)
      this.scoreLabelTween = this.add.tween(this.scoreLabel.scale).to({ x: 1.5, y: 1.5}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);
    },
    bird_collision: function (hero, enemy) {
      this.eating_sound.play();

      //one of the objects is the hero, the other is a member of the 'enemies' group.
      //according to phaser docs, if one object is a sprite and the other a group, the sprite will always be the first parameter to collisionCallback function
      var hero_area = this.game.global.area(this.hero);
      var enemy_area = this.game.global.area(enemy);

      //if the hero is bigger than enemy (which is one of the collision objects), then he grows a bit. If he is smaller than it is game over
      if(hero_area > enemy_area){
        //increase hero's size and show some cool animations when he eats
        this.hero.sizeIncrease(enemy_area);
        this.hero.showCrumbs();
        this.eatingTween = this.add.tween(this.hero.scale).to({ x: this.hero.scale.x * 1.2, y: this.hero.scale.y * 1.2},75,
          Phaser.Easing.Linear.In).to({ x: this.hero.scale.x, y: this.hero.scale.y}, 75, Phaser.Easing.Linear.In);
        this.eatingTween.start();

        //show this meal's score travel up towards total score
        this.createScoreAnimation(this.hero.x,this.hero.y,Math.round(Math.sqrt(enemy_area)));

        //removes the enemy hero collides with, makes enemy availble for recycling
        enemy.exists = false;

        //update progress bar after eating something
        this.progress_bar.progress = this.game.global.area(this.hero) / this.game.global.level_up_hero_area;

        //check for a level increase
        if( this.game.global.area(this.hero) > this.game.global.level_up_hero_area){
          this.game.global.levelUp(this.game,this.hero,this.enemies);

          this.progress_bar.progress = 0;
          this.progress_bar.textValue = this.game.global.level;
        }
      }
      else{
        this.game.state.start('gameover',true,false, this.score + this.scoreBuffer);
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
