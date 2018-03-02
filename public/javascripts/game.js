var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('background', '../images/StarBackground.png') //Background
    game.load.image('player', '../images/SpaceShip.png') //Player Character
    game.load.image('bullet', '../images/Bullet.png') //Bullets
    game.load.image('asteroid', '../images/SpaceRock.png') //Asteroids
};
var sprite;
var cursors;
var weapon;
var fireButton;
var safeTime;
var respawnTime = 2000; // 2 seconds rocks wont fly at player
var startAmmo = 10; // Starting ammo
var playerAlive = true;
var asteroidCount = 3;
var totalAsteroids = asteroidCount;
var lives = 3;

function create() {

    // Add background
    game.add.sprite(0, 0, 'background');
    
    // Add player sprite
    player = game.add.sprite(game.world.width * .5, game.world.height - 150, 'player');
    
    // Add physics to player
    game.physics.arcade.enable(player);
    
    // Prevent player from leaving game window
    player.body.collideWorldBounds = true;
    
    // Scale player sprite
    player.scale.setTo(.15);
    
    // Set rotation around center of player sprite
    player.anchor.setTo(0.5, 0.5);

    // Set drag
    player.body.drag.set(100);

    // Set max speed
    player.body.maxVelocity.set(300);

    // Creates 30 bullets, using the 'bullet' graphic
    weapon = game.add.weapon(30, 'bullet');

    // The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 800;

    // The rate at which bullets are fired
    weapon.fireRate = 200;

    // The ammo count
    weapon.fireLimit = startAmmo;

    // Set weapon to player
    weapon.trackSprite(player, 25, 0, true);

    // Set bullet scale
    weapon.bullets.setAll('scale.x', 0.05);
    weapon.bullets.setAll('scale.y', 0.05);

    // Define fire button
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // Add Asteroid sprite
    asteroidGroup = game.add.group();
    asteroidGroup.enableBody = true;
    asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;

    resetAsteroids();

    // Pause menu
    // Create a pause button
    pause_button = game.add.button(700, 20, 'pauseBtn', pause, this);

    // Start with game paused
    game.paused = true;

    // Start Game Button
    start_button = game.add.button(game.world.centerX - 95, 400, 'startBtn', unpause, this);
}

// Pause function
function pause() {

    // Only act if unpaused
    if (!(game.paused)) {
        
        // Pause the game
        game.paused = true;

        // Add start button
        start_button = game.add.button(game.world.centerX - 95, 400, 'resume', unpause, this, 2, 1, 0);
    }
};

// Unpause function
function unpause(){

    // Only act if paused
    if (game.paused) {

        // Remove the start button
        start_button.destroy();

        // Unpause the game
        game.paused = false;
    }
}

function createAsteroid (x, y, asset) {
    asteroid = this.asteroidGroup.create(x, y, asset);
    asteroid.anchor.setTo(0.5, 0.5);

    game.physics.arcade.velocityFromRotation(1.53, 10, asteroid.body.velocity);
    game.physics.arcade.moveToObject(asteroid, player, 10);

}

function resetAsteroids () {
    for (i=0; i < asteroidCount; i++) {
        x = Math.random() * 800;
        y = 0;
        createAsteroid(x, y, 'asteroid');
    }
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

    // Weapons fire 
    if (fireButton.isDown) {

        weapon.fire();
    }

    // Pause key
    if(pauseKey.isDown) {
        pause();
    }

    // Asteroid track towards player movement & collision
    for (i=0; i < totalAsteroids; i++) {
        if (playerAlive == true) {
            game.physics.arcade.moveToObject(asteroidGroup.children[i], player, 60);
            game.physics.arcade.collide(player, asteroidGroup.children[i], shipHit, null, this);
            game.physics.arcade.overlap(asteroidGroup.children[i], weapon.bullets, hitAsteroid, null, this);
        } else {
            asteroidGroup.children[i].velocity = asteroidGroup.children[i].velocity;
        }
        
    }

    if (safeTime < game.time.now) {
        playerAlive = true;
    }

}

function hitAsteroid (rock, bullet) {
    rock.kill();
    bullet.kill();
}

function shipHit (ship) {
    if (lives > 0) {
        lives --;
        playerAlive = false;
        respawnPlayer();
    } else {
        ship.kill();
        playerAlive = false;
    }
}

function respawnPlayer () {
    player.reset(game.world.width * .5, game.world.height - 150);
    safeTime = game.time.now + respawnTime;
    weapon.firelimit = startAmmo;
    weapon.resetShots();
}