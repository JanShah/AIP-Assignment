class Agent {
    constructor(config) {
        this.radius = config.robot_radius
        this.xOffset = config.sx % config.grid_size
        this.yOffset = config.sy % config.grid_size
        this.x = config.sx
        this.y = config.sy
        this.resolution = config.grid_size
        this.scale = config.fig_dim
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




window.addEventListener('DOMContentLoaded', start)
// let ctx
async function start() {
    const config = await getConfig()
    const agent = new Agent(config);
    const target = new Target(config)
    const grid = new Grid(config, agent, target)


    const listeners = new Listeners(agent, grid, target)
}




class Node {
    constructor(x, y, cost, parent) {
        this.x = x
        this.y = y
        this.cost = cost
        this.parent = parent
    }

    equals(node, radius = -1) {
        const dist = Math.sqrt((node.x - this.x) ** 2 + (node.y - this.y) ** 2)
        if (radius > -1) {
            
            if (dist < radius/2) {
                return true

            }
        }
        return this.x === node.x && this.y === node.y
    }
}

