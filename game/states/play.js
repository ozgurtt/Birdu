
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

      //Create the score label at top right of screen
      this.scoreLabel = this.game.add.text(this.game.world.width - text_margin_from_side_of_screen,
         text_margin_from_side_of_screen,
         this.game.global.score.toString(),
         this.game.global.score_font_style);
      this.scoreLabel.anchor.setTo(1, 0);
      //Create a tween to grow (for 200ms) and then shrink back to normal size (in 200ms)
      this.scoreLabelTween = this.add.tween(this.scoreLabel.scale).to({ x: 1.5, y: 1.5}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);


      //play/pause icon
      this.pause_icon = this.game.add.sprite(this.game.world.width - text_margin_from_side_of_screen - pause_icon_length/2,
        this.game.world.height - text_margin_from_side_of_screen - pause_icon_length/2,
        'pause');
      this.pause_icon.width = pause_icon_length;
      this.pause_icon.height = pause_icon_length;
      this.pause_icon.anchor.setTo(0.5,0.5);
      this.pause_icon.inputEnabled = true;
      this.pause_icon.events.onInputUp.add(this.pauseGame, this);
      this.game.input.onDown.add(this.resumeGame, this); //add a listener for unpausing the game. Cannot be bound to a sprite or text (as these become paused as well)!!!

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
      // Prevent directions key events bubbling up to browser,
      // since these keys will make web page scroll which is not
      // expected. These inputs can be used by the protagonist prefab
      this.game.input.keyboard.addKeyCapture([
          Phaser.Keyboard.LEFT,
          Phaser.Keyboard.RIGHT,
          Phaser.Keyboard.UP,
          Phaser.Keyboard.DOWN
      ]);

      //load the pause menu (just some text in this game) after the hero, so that it appears over top
      this.pause_text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Paused", this.game.global.score_font_style);
      this.pause_text.anchor.setTo(0.5,0.5);
      this.pause_text.visible = false;

      // create and add a group to hold our enemies (for sprite recycling)
      this.enemies = this.game.add.group();

      // add a timer
      this.enemyGenerator = this.game.time.events.loop(this.game.global.default_time_btw_enemy_spawns, this.generateEnemy, this);
      this.enemyGenerator.timer.start();

      //load audio
      this.game.global.playAudio("tweet",this.game);

      //things to be shown upon leveling up
      this.levelup_text = this.game.add.text(this.game.world.centerX,0,
        "Level Up",
        this.game.global.score_font_style);
      this.levelup_text.anchor.setTo(0.5,0.5);
      this.levelup_text.y = text_margin_from_side_of_screen + this.levelup_text.height/2;
      this.levelup_text.visible = false;

      //combo variables
      this.combo_original_bird_score = 0; //score that is added by eating birds in a combo series. Nothing added from the combo itself
      this.combo_count = 0;
      this.combo_timer = null;
    },
    pauseGame: function() {
      if(!this.game.paused){
        console.log('Gameplay has paused');
        
        this.pause_icon.loadTexture('play'); //load a different image for play/pause icon

        this.pause_text.visible = true; //open 'pause menu'

        //For devices that use cordova-media-plugin instead of Phaser, must pause audio
        if(this.game.global.use_cordova_media_plugin){
          for( var audio in this.game.audio){
            audio.pause();
          }
        }

        //this.saveGameState();

        this.game.paused = true; //actually pause the game
      }
    },
    saveGameState: function(){
      //save the game's state to local storage
      if( typeof(Storage) !== "undefined") {
          localStorage["level"] = this.game.global.level;
          localStorage["currentGameScore"] = this.game.global.score;
          localStorage["currentGameScoreBuffer"] = this.game.global.scoreBuffer;
      }
    },
    resumeGame: function(){
      console.log('Gameplay has resumed');
      if(this.game.paused){
        this.pause_icon.loadTexture('pause');

        this.pause_text.visible = false;

        this.game.paused = false;

        //For devices that use cordova-media-plugin instead of Phaser, must pause audio
        if(this.game.global.use_cordova_media_plugin){
          for( var audio in this.game.audio){
            audio.play();
          }
        }
      }
    },
    update: function() {
      this.game.physics.arcade.collide(this.hero, this.enemies, this.bird_collision, null, this);

      //While there is score in the score buffer, add it to the actual score
      if(this.game.global.scoreBuffer > 0){
          this.game.global.score += 1;
          this.scoreLabel.text = this.game.global.score.toString();

          this.game.global.scoreBuffer--;
      }
    },
    //function to create an cool animating score, which will travel up to the player's total score, and disappear.
    createScoreAnimation: function(score){
        //Create a new label for the score
        var scoreAnimationText = this.game.add.text(this.hero.x, this.hero.y, score.toString(), this.game.global.score_animating_font_style);
        scoreAnimationText.anchor.setTo(0.5, 0);

        //Tween this score label to the total score label
        var scoreTween = this.add.tween(scoreAnimationText).to({x:this.scoreLabel.x, y: this.scoreLabel.y}, 800, Phaser.Easing.Exponential.In, true);

        //When the animation finishes, destroy this score label, trigger the total score labels animation and add the score
        scoreTween.onComplete.add(function(){
            scoreAnimationText.destroy();
            this.scoreLabelTween.start();
            this.game.global.scoreBuffer += score;
        }, this);
    },
    bird_collision: function (hero, enemy) {
      //one of the objects is the hero, the other is a member of the 'enemies' group.
      //according to phaser docs, if one object is a sprite and the other a group, the sprite will always be the first parameter to collisionCallback function
      var hero_area = this.game.global.area(this.hero);
      var enemy_area = this.game.global.area(enemy);

      //if the hero is bigger than enemy (which is one of the collision objects), then he grows a bit. If he is smaller than it is game over
      if(hero_area > enemy_area){
        this.game.global.playAudio("bite_friendly",this.game);
        //increase hero's size and show some cool animations when he eats
        this.hero.sizeIncrease(enemy_area);
        this.hero.showCrumbs();
        this.eatingTween = this.add.tween(this.hero.scale).to({ x: this.hero.scale.x * 1.2, y: this.hero.scale.y * 1.2},75,
          Phaser.Easing.Linear.In).to({ x: this.hero.scale.x, y: this.hero.scale.y}, 75, Phaser.Easing.Linear.In);
        this.eatingTween.start();

        //show this meal's score travel up towards total score. add it to current combo
        var score_increase = Math.round(Math.sqrt(enemy_area) * (1+this.game.global.level/10) );
        this.createScoreAnimation(score_increase);

        //increase combo and score amount. (Re)start the end-of-combo timer as needed
        this.combo_original_bird_score += score_increase;
        this.combo_count += 1;
        if( this.combo_timer ){//true if it is not null. Thus a timer is already running
          this.game.time.events.remove(this.combo_timer);//stop previous timer from firing the 'completedCombo' events
          this.combo_timer = this.game.time.events.add(Phaser.Timer.SECOND, this.completedCombo, this);//restart the timer
        }else{
          this.combo_timer = this.game.time.events.add(Phaser.Timer.SECOND, this.completedCombo, this);
        }

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

        //make birds spawn a little less frequently as their size increases. Put this last, as things above may shrink/grow the hero
        this.enemyGenerator.delay = this.enemySpawnDelay();
      }
      else{
        this.game.global.playAudio("bite_scary",this.game);
        this.game.state.start('gameover',true,false);
      }
    },
    enemySpawnDelay: function(){
      var hero_area_ratio = this.game.global.area(this.hero) / this.game.global.level_up_hero_area;

      //hero's area is >= to level_up_hero_area. Thus he has leveled up, and the tween has not yet ran and reduced his size back to original. Jut set it to original
      if(hero_area_ratio > 1){
        hero_area_ratio = 0;
      }

      //some formula i made up to make spawn time increase as a function of the hero's size
      return this.game.global.default_time_btw_enemy_spawns * (1 + hero_area_ratio * 0.5);
    },
    //Create cool text+tweens for displaying number of combos+how much score it added, then add that score to total
    completedCombo: function(){
      if(this.combo_count > 1){
        var score_combo_adds = Math.round(this.combo_original_bird_score * (this.combo_count / 10.0) );

        //Create a new label for displaying how many combos the user got
        var comboText = this.game.add.text(this.hero.x, this.hero.y,
          "Combo x"+this.combo_count.toString(), this.game.global.score_animating_font_style);
        comboText.anchor.setTo(0.5, 0);
        //show the number of combos for a little while. After that delay, show a growing/shrinking tween
        var display_combo_score = this.add.tween(comboText.scale).to({ x: 1.1, y: 1.1}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In,5000)
        //change the text to the score the combo added when first tween starts
        display_combo_score.onComplete.add(function(){
            comboText.setText(score_combo_adds);
        }, this);

        //Tween this score/combo label to the total score label
        var scoreTween = this.add.tween(comboText).to({x:this.scoreLabel.x, y: this.scoreLabel.y}, 800, Phaser.Easing.Exponential.In, true,800);
        //When the animation finishes, destroy this score/combo label, trigger the total score labels animation and add the score
        scoreTween.onComplete.add(function(){
            comboText.destroy();
            this.scoreLabelTween.start();
            this.game.global.scoreBuffer += score_combo_adds;
        }, this);
      }
      //reset combo stats and set the timer to null (it has already completed [hence we're in this function], so we do not need to remove it from events queue)
      this.combo_original_bird_score = 0;
      this.combo_count = 0;
      this.combo_timer = null;
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
