class Target {
    constructor({ gx, gy, grid_size: radius }) {
        this.x = gx
        this.y = gy
        this.radius = radius
    }
    draw(ctx, boundaryDistance) {
        ctx.fillStyle = colours.target.fill
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = colours.target.stroke
        ctx.beginPath()
        ctx.arc(this.x, this.y, boundaryDistance/2, 0, Math.PI * 2)
        ctx.stroke()
    }

    setXY(x, y) {
        this.x = x
        this.y = y
    }
}
