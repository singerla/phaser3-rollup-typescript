import Phaser from 'phaser';

export default class Demo extends Phaser.Scene {
  crab: any;
  player: any;

  constructor() {
    super('GameScene');
  }
  
  preload() {
    this.load.atlas('sea', 'assets/animations/seacreatures_json.png', 'assets/animations/seacreatures_json.json');

    //  Just a few images to use in our underwater scene
    this.load.image('undersea', 'assets/pics/undersea.jpg');
    this.load.image('coral', 'assets/pics/seabed.png');

    this.load.image('ground', 'assets/pics/platform.png');
    this.load.spritesheet('dude', 
        'assets/pics/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );

    this.load.image('star', 'assets/pics/star.png');
    this.load.image('logo', 'assets/pics/LogoGame.png');

    this.load.image('Sonne', 'assets/pics/Sonne.png');

    this.load.audio("Sonne", ["assets/audio/Sonne.mp3"]);
  }

  create() {
    this.add.image(400, 300, 'undersea');

    this.anims.create({ key: 'jellyfish', frames: this.anims.generateFrameNames('sea', { prefix: 'blueJellyfish', end: 32, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'crab', frames: this.anims.generateFrameNames('sea', { prefix: 'crab1', end: 25, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'octopus', frames: this.anims.generateFrameNames('sea', { prefix: 'octopus', end: 24, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'purpleFish', frames: this.anims.generateFrameNames('sea', { prefix: 'purpleFish', end: 20, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'stingray', frames: this.anims.generateFrameNames('sea', { prefix: 'stingray', end: 23, zeroPad: 4 }), repeat: -1 });

    const jellyfish = this.add.sprite(300, 520, 'seacreatures');
    jellyfish.play('jellyfish');

    const bigCrab = this.add.sprite(550, 480, 'seacreatures').setOrigin(0).play('crab');
    const smallCrab = this.add.sprite(730, 515, 'seacreatures').setScale(0.5).setOrigin(0).play('crab');
    const octopus = this.add.sprite(100, 100, 'seacreatures').play('octopus');
    const fish = this.add.sprite(600, 200, 'seacreatures').play('purpleFish');
    const ray = this.add.sprite(100, 300, 'seacreatures').play('stingray');

    this.tweens.add({
      targets: bigCrab,
      x: 450,
      duration: 1500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    });

    this.add.image(0, 466, 'coral').setOrigin(0);
    this.add.image(0, 0, 'logo').setOrigin(0);

    const platforms = this.physics.add.staticGroup();
    platforms.create(410, 578, 'ground').setScale(2).refreshBody();
    platforms.create(600, 480, 'ground');
    platforms.create(250, 370, 'ground').setScale(0.5).refreshBody();
    platforms.create(450, 170, 'ground').setScale(0.5).refreshBody();
    platforms.create(50, 280, 'ground');
    platforms.create(750, 120, 'ground');

    this.player = this.physics.add.sprite(220, 350, 'dude');    

    this.player.setBounce(0.5);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.player.body.setGravityY(200)


    const stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 120, y: 0, stepX: 30 }
    });

    stars.children.iterate(function (child: any) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    const collectStar = (player: any, star: any) => {
      star.disableBody(true, true);
    }

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(this.player, stars, collectStar, undefined, this);


    const drops = this.physics.add.group();
    drops.create(600, 480, 'Sonne').setScale(0.5);
    drops.create(50, 180, 'Sonne').setScale(0.5);
    this.physics.add.collider(drops, platforms);
    
    this.physics.add.collider(this.player, drops, (player: any, drop: any) => {
      this.sound.play("Sonne")
      drop.disableBody(true, true);
    });
    
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown)
    {
        this.player.setVelocityX(-160);
        this.player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        this.player.setVelocityX(160);
        this.player.anims.play('right', true);
    }
    else
    {
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
    }

    if (cursors.up.isDown && this.player.body.touching.down)
    {
        this.player.setVelocityY(-330);
    }
  }
}
