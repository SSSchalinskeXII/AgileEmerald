var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update });

function preload() {
    
    game.load.image('background', '../images/StarBackground.png') //Background
    game.load.image('player', '../images/SpaceShip.png') //Player Character
    
}

var sprite;
var cursors;

function create() {
    
}

function update() {
    
}

