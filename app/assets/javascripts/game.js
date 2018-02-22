var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update });

function preload() {
    
    game.load.image('background', '../assets/StarBackground.png') //Background
    game.load.image('player', '../assets/SpaceShip.png') //Player Character
    game.load.image('bullet', '../assets/bullet.png') //Bullets
    
}

var sprite;
var cursors;
var weapon;
var fireButton;

function create() {

    // Add background
    game.add.sprite(0, 0, 'background');
    
    // Add player sprite
    player = game.add.sprite(375, game.world.height - 150, 'player');
    
    // Add physics to player
    game.physics.arcade.enable(player);
    
    // Prevent player from leaving game window
    player.body.collideWorldBounds = true;
    
    // Scale player sprite
    player.scale.setTo(.25);
    
    // Set rotation around center of player sprite
    player.anchor.setTo(0.5, 0.5);

    //  Creates 30 bullets, using the 'bullet' graphic
    weapon = game.add.weapon(30, 'bullet');

    //  The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 800;

    // The rate at which bullets are fired
    weapon.fireRate = 200;

    // Set weapon to player
    weapon.trackSprite(player, 50, 0, true);

    // Set bullet scale
    weapon.bullets.setAll('scale.x', 0.1);
    weapon.bullets.setAll('scale.y', 0.1);

    // Define fire button
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {
    
    cursors = game.input.keyboard.createCursorKeys();
    
    // Movement
    if (cursors.up.isDown) {
        
        game.physics.arcade.accelerationFromRotation(player.rotation, 200, player.body.acceleration);
    
    } else {
        
        player.body.acceleration.set(0);
    
    }

    // Rotation
    if (cursors.left.isDown) {
    
        player.body.angularVelocity = -300;
    
    } else if (cursors.right.isDown) {
    
        player.body.angularVelocity = 300;
    
    } else {
        
        player.body.angularVelocity = 0;
    
    }

    if (fireButton.isDown) {

        weapon.fire();

    }
}

