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
        this.follow = false
    }

    setXY(x, y) {
        this.x = x
        this.y = y
        this.setOffsets()
    }

    reScale(radius) {
        this.radius = radius
    }

    follower(isFollower) {
        this.follow = isFollower
    }

    moveOnPath(path) {
        this.path = path.reverse()
        this.speed = this.resolution * .1
        this.getTo()

    }

    getTo(destination = null) {
        if (destination === null && !this.path) return
        destination = this.path.pop()
        this.x = destination[0]
        this.y = destination[1]
        if (!this.path.length) delete this.path

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
        this.getTo()
    }

    motionModel4n() {
        return this.m4
    }

    motionModel8n() {
        return this.m8
    }
}
