var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('background', '../images/StarBackground.png') //Background
    game.load.spritesheet('player', '../images/shipSprite.png', 329, 158, 4) //Player Character
    game.load.image('bullet', '../images/Bullet.png') //Bullets
    game.load.image('asteroid', '../images/SpaceRock.png') //Asteroids
    game.load.image('startBtn', '../images/startBtn.png') //Start Button
    game.load.image('pauseBtn', '../images/pauseBtn.png') //Pause Button
    game.load.image('playAgain', '../images/playAgain.png') //Play Again Button
    game.load.image('resume', '../images/resume.png') //Resume Button
    game.load.image('gameOver', '../images/gameOverText.png') //Game Over Text
    game.load.image('ammo', '../images/SpaceJunk.png') // Ammo powerup.
};

// Variables
var sprite;
var cursors;
var weapon;
var fireButton;
var pauseKey;
var safeTime;
var respawnTime = 2000; // 2 seconds rocks wont fly at player
var startAmmo = 10; // Starting ammo
var playerAlive = true;
var asteroidCount = 3; // Starting asteroids
var totalAsteroids = asteroidCount;
var liveAsteroids;
var lives = 3; // Starting lives
var ammo = startAmmo;
var ammoSpawnTime = 10000; // 10 seconds between ammo drops
var totalSatAmmo = 0;
var x2; // Fly to point

function create() {

    // Add background
    game.add.sprite(0, 0, 'background');
    
    // Add player sprite
    player = game.add.sprite(game.world.width * .5, game.world.height - 150, 'player', 2);
    
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

    // Define pause key
    pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

    // Add Asteroid sprite and allow physics
    asteroidGroup = game.add.group();
    asteroidGroup.enableBody = true;
    asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;

    resetAsteroids();

    // Pause menu
    // Create a pause button
    pause_button = game.add.button(730, 20, 'pauseBtn', pause, this);

    // Start with game paused
    game.paused = true;

    // Start Game Button
    start_button = game.add.button(game.world.centerX - 110, 350, 'startBtn', unpause, this);

    // Display number of lives
    lives_label = game.add.text(20, 20, 'Lives: ' + lives, { font: '24px Lucida Console', fill: '#fff' });

    // Dusplay ammo count
    ammo_label = game.add.text(20, 50, 'Ammo: ' + ammo,  { font: '24px Lucida Console', fill: '#fff' });

    // Add Satallite (ammo) sprite and allow physics
    satelliteAmmoGroup = game.add.group();
    satelliteAmmoGroup.enableBody = true;
    //satelliteAmmoGroup.physicsBodyType = Phaser.Physics.ARCADE;

}

function update() {
    
    cursors = game.input.keyboard.createCursorKeys();
    
    // Movement
    if (cursors.up.isDown) {
        if (playerAlive) {
            player.frame = 0;
        } else {
            player.frame = 1;
        }
        game.physics.arcade.accelerationFromRotation(player.rotation, 200, player.body.acceleration);
    
    } else {
        if (playerAlive) {
            player.frame = 2;
        } else {
            player.frame = 3;
        }
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
        updateAmmo();
    }

    // Pause key
    if(pauseKey.isDown) {
        pause();
    }

    // Asteroid track towards player movement & collision
    for (i=0; i < totalAsteroids; i++) {
        if (playerAlive == true) {
            //game.physics.arcade.moveToObject(asteroidGroup.children[i], player, 60);
            game.physics.arcade.collide(player, asteroidGroup.children[i], shipHit, null, this);
        } else {
            asteroidGroup.children[i].velocity = asteroidGroup.children[i].velocity;
        }
        game.physics.arcade.overlap(asteroidGroup.children[i], weapon.bullets, hitAsteroid, null, this);
        // When the asteroid leaves the world bounds kill it
        asteroidGroup.children[i].events.onOutOfBounds.add(asteroidOOB, this);
    }

    for (i=0; i < totalSatAmmo; i++) {
        game.physics.arcade.overlap(player, satelliteAmmoGroup.children[i], shipHitSatelliteAmmo, null, this);
        game.physics.arcade.overlap(satelliteAmmoGroup.children[i], weapon.bullets, hitSatelliteAmmo, null, this);
    }

    // Make player vulnerable again after a time has passed
    if (safeTime < game.time.now) {
        playerAlive = true;
    }

    // Spawn ammo drops at intervals minimum 10 seonds increasing by 5 seconds
    if (ammoSpawnTime < game.time.now) {
        resetSatelliteAmmo();
        ammoSpawnTime = game.time.now  + 10000;
    }
}

// Create asteroids
function resetAsteroids () {
    for (i=0; i < asteroidCount; i++) {
        x = Math.random() * 800;
        y = 0;
        createAsteroid(x, y, 'asteroid');
    }
    liveAsteroids = asteroidCount;
    if (totalAsteroids != asteroidCount) {
        totalAsteroids += asteroidCount;
    }
}

// Create an asteroid
function createAsteroid (x, y, asset) {
    asteroid = this.asteroidGroup.create(x, y, asset);
    asteroid.anchor.setTo(0.5, 0.5);
    // Randomly set speed between 40 and 90
    n = Math.floor((Math.random() * 50) + 40);
    game.physics.arcade.moveToObject(asteroid, player, n);
    // Randomly set size
    s = Math.random() + .1;
    asteroid.scale.setTo(s);
    // needed to kill asteroid as it leaves the world
    asteroid.checkWorldBounds = true;
}

// Asteroid hit 
function hitAsteroid (rock, bullet) {
    rock.kill();
    bullet.kill();
    liveAsteroids--;
    if (liveAsteroids == 0) {
        asteroidCount++;
        resetAsteroids();
    }
}

// Asteroids leaves world bounds
function asteroidOOB (asteroid) {
    asteroid.kill();
    liveAsteroids--
    if (liveAsteroids == 0) {
        asteroidCount++;
        resetAsteroids();
    }
}

// Ship is hit by asteroid
function shipHit (ship) {
    lives --;
    playerAlive = false;
    ship.kill();
    
    // Determine if it is a game over or not
    if (lives > 0) {
        respawnPlayer();
    } else {
        gameOver();
    }

    updateLives();
}

// Update lives
function updateLives () {
    lives_label.setText("Lives: " + lives);
}

// Respawn player
function respawnPlayer () {
    player.reset(game.world.width * .5, game.world.height - 150);
    safeTime = game.time.now + respawnTime;
    weapon.firelimit = startAmmo;
    ammo = startAmmo;
    weapon.resetShots();
    updateAmmo();
}

// Create asteroids
function resetSatelliteAmmo () {
    x = Math.random() * 800;
    y = 0;
    createSatelliteAmmo(x, y, 'ammo');
}

// Create an asteroid
function createSatelliteAmmo (x, y, asset) {
    satAmmo = this.satelliteAmmoGroup.create(x, y, asset);
    satAmmo.anchor.setTo(0.5, 0.5);
    // Randomly set speed between 40 and 90
    n = Math.floor((Math.random() * 100) + 70);
    // set size
    satAmmo.scale.setTo(.25);
    // needed to kill satAmmo as it leaves the world
    satAmmo.checkWorldBounds = true;
    // Increase totalSatAmmo
    totalSatAmmo++;
    // Fly to point
    x2 = Math.random() * 800;
    game.physics.arcade.moveToXY(satelliteAmmoGroup.children[i], x2, 650, n);

}

// Bullet Collides with Satalite Ammo
function hitSatelliteAmmo (satAmmo, bullet) {
    satAmmo.kill();
    bullet.kill();
}

// Ship Collides with Satalite Ammo
function shipHitSatelliteAmmo (player, satAmmo) {
    satAmmo.kill();
    weapon.resetShots();
    updateAmmo();
}

// StatliteAmmo leaves world bounds
function satAmmoOOB (satAmmo) {
    satAmmo.kill();
}

// Update Ammo Counter
function updateAmmo () {
    ammo = startAmmo - weapon.shots;
    ammo_label.setText("Ammo: " + ammo);
}

// Pause function
function pause() {

    // Only act if unpaused
    if (!(game.paused)) {
        
        // Pause the game
        game.paused = true;

        // Add start button
        start_button = game.add.button(game.world.centerX - 110, 350, 'resume', unpause, this, 2, 1, 0);
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

// Game Over
function gameOver () {
    game.paused = true;
    gameOver = game.add.sprite(game.world.width -775, game.world.height - 400, 'gameOver'); // image in the future
    //gameOver = game.add.text(game.world.width -600, game.world.height - 400, 'GAME OVER!', { font: '60px Arial', fill: '#fff' }); // Text for now
}