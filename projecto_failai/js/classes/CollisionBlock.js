class CollisionBlock {
    constructor({ position, height = 10 }) {
        this.position = position
        this.width = 10
        this.height = height
    }

    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0)'   /* colision block spalva*/
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
    }
}
