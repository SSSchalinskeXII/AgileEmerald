var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update });

function preload() {
    
    game.load.image('background', '../images/StarBackground.png') //Background
    game.load.image('player', '../images/SpaceShip.png') //Player Character
    
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
    
}

function update() {
    
}

