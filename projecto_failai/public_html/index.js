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
        if (symbol === 80001) {
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
        if (symbol === 80002) {
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

    player.checkForHorizontalCanvasCollision()
    player.update()

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
