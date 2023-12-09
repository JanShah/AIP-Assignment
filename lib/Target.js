class Target {
    constructor({ gx, gy, grid_size: radius }) {
        this.x = gx
        this.y = gy
        this.radius = radius
    }
    draw(ctx) {
        ctx.fillStyle = colours.target.fill
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
    }
}
