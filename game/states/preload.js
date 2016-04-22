
'use strict';
function Preload() {
  this.loading_bar = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    //loading image while loading other assets
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.loading_bar = this.add.sprite(0, this.game.height/2, 'preloader'); //positions loading icon on left side of game, middle of screen
    this.loading_bar.anchor.setTo(0, 0.5);//loading icon's anchor is its left side, middle of its height (so that it is placed vertically in the middle, but only grows to its right)
    this.loading_bar.width = this.game.width;//loading icon is the entire games width
    this.load.setPreloadSprite(this.loading_bar);//loading icon will grow to the right, completing when it hits the right side

    this.loading_text = this.add.text(this.game.world.centerX,
      this.loading_bar.y - this.loading_bar.height / 2 - 25,
      'Loading...', {font: "50px Arial", fill: "#000", stroke: "#fff", strokeThickness: 4});
    this.loading_text.anchor.setTo(0.5,0.5);

    //spritesheets
    this.load.spritesheet('b-10', 'assets/birds/b-10.png', 114.00000000000000000000, 93);
    this.load.spritesheet('b-11', 'assets/birds/b-11.png', 118.00000000000000000000, 100);
    this.load.spritesheet('b-12', 'assets/birds/b-12.png', 131.00000000000000000000, 101);
    this.load.spritesheet('b-13', 'assets/birds/b-13.png', 117.00000000000000000000, 88);
    this.load.spritesheet('b-14', 'assets/birds/b-14.png', 117.00000000000000000000, 95);
    this.load.spritesheet('b-15', 'assets/birds/b-15.png', 123.00000000000000000000, 72);
    this.load.spritesheet('b-16', 'assets/birds/b-16.png', 128.00000000000000000000, 98);
    this.load.spritesheet('b-17', 'assets/birds/b-17.png', 117.00000000000000000000, 101);
    this.load.spritesheet('b-18', 'assets/birds/b-18.png', 115.00000000000000000000, 94);
    this.load.spritesheet('b-19', 'assets/birds/b-19.png', 117.00000000000000000000, 85);
    this.load.spritesheet('b-1', 'assets/birds/b-1.png', 119.00000000000000000000, 78);
    this.load.spritesheet('b-20', 'assets/birds/b-20.png', 121.00000000000000000000, 100);
    this.load.spritesheet('b-21', 'assets/birds/b-21.png', 120.00000000000000000000, 94);
    this.load.spritesheet('b-22', 'assets/birds/b-22.png', 115.00000000000000000000, 96);
    this.load.spritesheet('b-23', 'assets/birds/b-23.png', 115.00000000000000000000, 82);
    this.load.spritesheet('b-24', 'assets/birds/b-24.png', 115.00000000000000000000, 82);
    this.load.spritesheet('b-25', 'assets/birds/b-25.png', 124.00000000000000000000, 102);
    this.load.spritesheet('b-26', 'assets/birds/b-26.png', 120.00000000000000000000, 132);
    this.load.spritesheet('b-27', 'assets/birds/b-27.png', 119.00000000000000000000, 110);
    this.load.spritesheet('b-28', 'assets/birds/b-28.png', 123.00000000000000000000, 96);
    this.load.spritesheet('b-29', 'assets/birds/b-29.png', 116.00000000000000000000, 87);
    this.load.spritesheet('b-2', 'assets/birds/b-2.png', 119.00000000000000000000, 81);
    this.load.spritesheet('b-30', 'assets/birds/b-30.png', 117.00000000000000000000, 115);
    this.load.spritesheet('b-31', 'assets/birds/b-31.png', 119.00000000000000000000, 121);
    this.load.spritesheet('b-32', 'assets/birds/b-32.png', 127.00000000000000000000, 148);
    this.load.spritesheet('b-33', 'assets/birds/b-33.png', 126.00000000000000000000, 99);
    this.load.spritesheet('b-34', 'assets/birds/b-34.png', 125.00000000000000000000, 102);
    this.load.spritesheet('b-35', 'assets/birds/b-35.png', 117.00000000000000000000, 104);
    this.load.spritesheet('b-36', 'assets/birds/b-36.png', 118.00000000000000000000, 107);
    this.load.spritesheet('b-3', 'assets/birds/b-3.png', 119.00000000000000000000, 85);
    this.load.spritesheet('b-4', 'assets/birds/b-4.png', 119.00000000000000000000, 83);
    this.load.spritesheet('b-5', 'assets/birds/b-5.png', 113.00000000000000000000, 77);
    this.load.spritesheet('b-6', 'assets/birds/b-6.png', 124.00000000000000000000, 98);
    this.load.spritesheet('b-7', 'assets/birds/b-7.png', 115.00000000000000000000, 72);
    this.load.spritesheet('b-8', 'assets/birds/b-8.png', 123.00000000000000000000, 107);
    this.load.spritesheet('b-9', 'assets/birds/b-9.png', 120.00000000000000000000, 94);

    //load static images
    this.load.image('meat', 'assets/meat.png');
    this.load.image('play', 'assets/icon_play.png');
    this.load.image('pause', 'assets/icon_pause.png');
    this.load.image('background', 'assets/background.png');

    //load sounds - the second parameter is an array containing the same audio file but in different formats.
    if( !this.game.global.use_cordova_media_plugin ){
      this.load.audio('bite_friendly', this.arrayOfCompatibleMusicFileNames('bite_friendly') );
      this.load.audio('bite_scary', this.arrayOfCompatibleMusicFileNames('bite_scary') );
      this.load.audio('tweet', this.arrayOfCompatibleMusicFileNames('tweet') );
      this.load.audio('levelup', this.arrayOfCompatibleMusicFileNames('levelup') );
      this.load.audio('background-music', this.arrayOfCompatibleMusicFileNames('the_plucked_bird') );
    }else{
      window.plugins.NativeAudio.preloadSimple('bite_friendly', this.arrayOfCompatibleMusicFileNames('bite_friendly')[0] );
      window.plugins.NativeAudio.preloadSimple('bite_scary', this.arrayOfCompatibleMusicFileNames('bite_scary')[0] );
      window.plugins.NativeAudio.preloadSimple('tweet', this.arrayOfCompatibleMusicFileNames('tweet')[0] );
      window.plugins.NativeAudio.preloadSimple('levelup', this.arrayOfCompatibleMusicFileNames('levelup')[0] );
      window.plugins.NativeAudio.preloadComplex('background-music', this.arrayOfCompatibleMusicFileNames('the_plucked_bird')[0] );
    }
  },
  //Phaser has support to load in multiple types of audio formats if the first supplied in the array is not compatible with the browser.
  //for this game I utilized wav, ogg, and mp3 (in that order)
  arrayOfCompatibleMusicFileNames: function(key){
    //old versions of android don't play music, they require an absolute pathname (instead of relative). This is a generic solution
    //http://stackoverflow.com/questions/4438822/playing-local-sound-in-phonegap?lq=1
    var path = window.location.pathname;
    path = path.substr( 0, path.lastIndexOf("/")+1 ); //need to remove 'index.html' from the end of pathname
    var aud = path+'assets/audio/';

    //aud = '/android_res/raw/'
    var wav = aud + 'wav/' + key + ".wav";
    var ogg = aud + 'ogg/' + key + ".ogg";

    return [ogg,wav];
  },
  create: function() {
    this.loading_bar.cropEnabled = false;

    //set up sound file callbacks, once preloader has finished. If desktop, then can use phaser loading system. Old versions of Android (with Cordova) do not support this though, so use Cordova plug-in
    if( !this.game.global.use_cordova_media_plugin ){
      this.game.audio = {
        bite_friendly: this.game.add.audio('bite_friendly'),
        bite_scary: this.game.add.audio('bite_scary'),
        tweet: this.game.add.audio('tweet'),
        levelup: this.game.add.audio('levelup'),
        background_music: this.game.add.audio('background-music')
      };
    }else{
      var game = this.game;
      var background_loop = function(status) {
          if( status==Media.MEDIA_STOPPED ) {
              game.audio.background_music.play();
          }
      };

      this.game.audio = {
        bite_friendly: new Media( this.arrayOfCompatibleMusicFileNames('bite_friendly')[0] ),
        bite_scary: new Media( this.arrayOfCompatibleMusicFileNames('bite_scary')[0] ),
        tweet: new Media( this.arrayOfCompatibleMusicFileNames('tweet')[0] ),
        levelup: new Media( this.arrayOfCompatibleMusicFileNames('levelup')[0] ),
        background_music: new Media( this.arrayOfCompatibleMusicFileNames('the_plucked_bird')[0],null,null,background_loop )
      };
    }
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
