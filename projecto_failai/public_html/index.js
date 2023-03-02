const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1000
canvas.height = 1000
const scaledCanvas = {
    width: canvas.width / 1,
    height: canvas.height / 1,
}
const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += 800) {
    floorCollisions2D.push(floorCollisions.slice(i, i + 800))
}
const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 83539) {
            collisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 10,
                        y: y * 10,
                    },
                })
            )
        }
    })
})
const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i += 800) {
    platformCollisions2D.push(platformCollisions.slice(i, i + 800))
}
const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 83539) {
            platformCollisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 10,
                        y: y * 10,
                    },
                    /*height: 4,*/
                })
            )
        }
    })
})



class Projectile {
    constructor({ position, velocity, camerabox }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 3;
        this.camerabox = camerabox;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (
            this.position.x < this.camerabox.position.x ||
            this.position.x > this.camerabox.position.x + this.camerabox.width ||
            this.position.y < this.camerabox.position.y ||
            this.position.y > this.camerabox.position.y + this.camerabox.height
        ) {
            // Remove the projectile from the projectiles array if it's outside of the camerabox
            projectiles.splice(projectiles.indexOf(this), 1);
        }
    }

    isCollidingWith(enemy) {
        const dx = this.position.x - (enemy.hitbox.position.x + enemy.hitbox.width / 2);
        const dy = this.position.y - (enemy.hitbox.position.y + enemy.hitbox.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + Math.max(enemy.hitbox.width, enemy.hitbox.height) / 3;
    }
}



const projectiles = []
const gravity = 0.1
const player = new Player({
    position: {
        x: 100,
        y: 700,
    },
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc: '../img/soldier/idle.png',
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: '../img/soldier/idle.png',
            frameRate: 8,
            frameBuffer: 200,
        },
        Run: {
            imageSrc: '../img/soldier/begimas.png',
            frameRate: 8,
            frameBuffer: 12,
        },
        Jump: {
            imageSrc: '../img/soldier/begimas.png',
            frameRate: 8,
            frameBuffer: 200,
        },
        Fall: {
            imageSrc: '../img/soldier/falling.png',
            frameRate: 8,
            frameBuffer: 200,
        },
        FallLeft: {
            imageSrc: '../img/soldier/fallingk.png',
            frameRate: 8,
            frameBuffer: 200,
        },
        RunLeft: {
            imageSrc: '../img/soldier/begimask.png',
            frameRate: 8,
            frameBuffer: 12,
        },
        IdleLeft: {
            imageSrc: '../img/soldier/idlek.png',
            frameRate: 8,
            frameBuffer: 200,
        },
        JumpLeft: {
            imageSrc: '../img/soldier/jumpk.png',
            frameRate: 8,
            frameBuffer: 200,
        },
    },
})
function createEnemy(x, y, imageSrc, frameRate,frameBuffer) {
    return new Enemy({
        position: {
            x,
            y,
        },
        collisionBlocks,
        platformCollisionBlocks,
        imageSrc,
        frameRate,
    });
}
const enemy1 = createEnemy(300, 700, '../img/soldier/idle.png', 8,200);
const enemy2 = createEnemy(600, 700, '../img/soldier/idle.png', 8);
const enemy3 = createEnemy(900, 700, '../img/soldier/idle.png', 8);
const enemy4 = createEnemy(1200, 700, '../img/soldier/idle.png', 8);
const enemy5 = createEnemy(1500, 700, '../img/soldier/idle.png', 8);
const enemy6 = createEnemy(1800, 700, '../img/soldier/idle.png', 8);
const enemy7 = createEnemy(2000, 700, '../img/soldier/idle.png', 8);
const enemy8 = createEnemy(2500, 700, '../img/soldier/idle.png', 8);
const enemy9 = createEnemy(3000, 700, '../img/soldier/idle.png', 8);
const enemy10 = createEnemy(3400, 700, '../img/soldier/idle.png', 8);
const enemy11 = createEnemy(3800, 700, '../img/soldier/idle.png', 8);
const enemy12 = createEnemy(4200, 700, '../img/soldier/idle.png', 8);
const enemies = [ enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7, enemy8, enemy9, enemy10, enemy11, enemy12 ];
const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
}
const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: '../img/background.png',
})
const backgroundImageHeight = 1000
const camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height,
    },
}
let score = 0;

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.save()
    c.scale(1, 1)
    c.translate(camera.position.x, camera.position.y)
    background.update()
    collisionBlocks.forEach((collisionBlock) => {
        collisionBlock.update()
    })
    platformCollisionBlocks.forEach((block) => {
        block.update()
    })
    // Check for collisions between projectiles and enemies
    for (let i = 0; i < projectiles.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (projectiles[i].isCollidingWith(enemies[j])) {
                // Increase the score by 100
                score += 100;
                // Remove the enemy from the enemies array
                enemies.splice(j, 1);
                // Remove the projectile from the projectiles array
                projectiles.splice(i, 1);
                // Exit the loop since a projectile can only hit one enemy
                break;
            }
        }
    }
    // Update the remaining enemies
    enemies.forEach((enemy) => {
        enemy.checkForHorizontalCanvasCollision()
        enemy.update()
        // Draw the hitbox for the enemy
        c.fillStyle = 'rgba(85,255,0,0)'
        c.fillRect(
            enemy.hitbox.position.x,
            enemy.hitbox.position.y,
            enemy.hitbox.width,
            enemy.hitbox.height
        )
    })
    // Update the player and projectiles
    player.checkForHorizontalCanvasCollision()
    player.update()

    projectiles.forEach((projectile) => {
        projectile.update();
    });

    player.velocity.x = 0
    if (keys.d.pressed) {
        player.switchSprite('Run')
        player.velocity.x = 2
        player.lastDirection = 'right'
        player.shouldPanCameraToTheLeft({ canvas, camera })
    } else if (keys.a.pressed) {
        player.switchSprite('RunLeft')
        player.velocity.x = -2
        player.lastDirection = 'left'
        player.shouldPanCameraToTheRight({ canvas, camera })
    } else if (player.velocity.y === 0) {
        if (player.lastDirection === 'right') player.switchSprite('Idle')
        else player.switchSprite('IdleLeft')
    }

    if (player.velocity.y < 0) {
        player.shouldPanCameraDown({ camera, canvas })
        if (player.lastDirection === 'right') player.switchSprite('Jump')
        else player.switchSprite('JumpLeft')
    } else if (player.velocity.y > 0) {
        player.shouldPanCameraUp({ camera, canvas })
        if (player.lastDirection === 'right') player.switchSprite('Fall')
        else player.switchSprite('FallLeft')
    }

    c.fillStyle = 'white';
    c.font = '20px Arial';
    c.fillText(`Score: ${score}`, 10, 30);
    c.restore()
}
animate()
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 'w':
            player.velocity.y = -4
            break
        case ' ':
            console.log('space')
            projectiles.push (new Projectile({
                position: { x: player.position.x + player.width, y: player.position.y +50 },
                velocity: { x:10, y: 0 },
                camerabox: player.camerabox, // pass the camerabox to the constructor
            }))
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
})