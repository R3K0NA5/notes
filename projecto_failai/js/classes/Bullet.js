class Bullet extends Sprite {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.speed = 5;
    }

    update() {
        // move the bullet
        this.y -= this.speed;

        // check for collisions with collision blocks
        for (const block of collisions.blocks) {
            if (this.intersects(block)) {
                // remove the bullet from the list of active bullets
                const index = player.bullets.indexOf(this);
                if (index > -1) {
                    player.bullets.splice(index, 1);
                }
            }
        }
    }
}