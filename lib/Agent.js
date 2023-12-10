class Agent {
    constructor(config) {
        this.radius = config.robot_radius
        this.x = config.sx
        this.y = config.sy
        this.resolution = config.grid_size
        this.setOffsets()
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

    static motionModel4n() {
        return [
            [1, 0, 1],
            [0, 1, 1],
            [-1, 0, 1],
            [0, -1, 1]
        ]
    }

    static motionModel8n() {
        return [
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
}
