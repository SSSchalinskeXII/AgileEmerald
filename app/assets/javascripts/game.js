var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update });

function preload() {
    
    game.load.image('background', '../assets/StarBackground.png') //Background
    game.load.image('player', '../assets/SpaceShip.png') //Player Character
    
}

var sprite;
var cursors;

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
}

