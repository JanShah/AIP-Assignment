class Agent {
    constructor(config) {
        this.radius = config.robot_radius
        this.x = config.sx
        this.y = config.sy
        this.resolution = config.grid_size
        this.setOffsets()
        this.m4 = [
            [1, 0, 1],
            [0, 1, 1],
            [-1, 0, 1],
            [0, -1, 1]
        ]
        this.m8 = [
            [-1, 0, 1],
            [-1, 1, Math.sqrt(2)],
            [0, 1, 1],
            [1, 1, Math.sqrt(2)],
            [1, 0, 1],
            [1, -1, Math.sqrt(2)],
            [0, -1, 1],
            [-1, -1, Math.sqrt(2)]
        ]
    }

    reScale(radius) {
        this.radius = radius
    }

    setOffsets() {
        this.xOffset = this.x % this.resolution
        this.yOffset = this.y % this.resolution
    }

    draw(ctx) {
        ctx.fillStyle = colours.agent.fill
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
    }

    motionModel4n() {
        return this.m4
    }

    motionModel8n() {
        return this.m8
    }
}
