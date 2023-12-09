class Grid {
    #activeMotionModel

    constructor(config, agent, target) {
        this.scale = config.fig_dim
        this.cells = config.grid
        const canvas = document.getElementById('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = config.grid.length * config.fig_dim
        canvas.height = config.grid[0].length * config.fig_dim
        this.#activeMotionModel = Agent.motionModel4n()
        this.activeHeuristic = euclidian
        this.target = target
        

        // https://stackoverflow.com/questions/34309228/html-canvas-at-varying-pixel-densities
        if (window.devicePixelRatio !== 1) {
            var w = canvas.width, h = canvas.height;

            // scale the canvas by window.devicePixelRatio
            canvas.setAttribute('width', w * window.devicePixelRatio);
            canvas.setAttribute('height', h * window.devicePixelRatio);

            // use css to bring it back to regular size
            canvas.setAttribute('style', 'width:' + w + 'px; height:' + h + 'px;')

            // set the scale of the context
            canvas.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        this.canvas = canvas
        ctx.scale(this.scale, this.scale)
        this.ctx = ctx
        this.ctx.lineWidth = 1 / this.scale
        this.agent = agent

        this.obstacles = []
        this.validCells = [];

        this.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 1) {
                    this.obstacles.push({ x, y });
                }
            });
        });

        this.createGridAtResolution();
        // this.createTraversableGrid()

    }

    reScale(amount, translateX, translateY) {
        this.scale += amount
        this.ctx.setTransform(this.scale, 0, 0, this.scale, -translateX + 20, -translateY + 20);
        // this.ctx.scale(this.scale, this.scale)
    }

    offset(offsetX, offsetY) {
        this.ctx.setTransform(this.scale, 0, 0, this.scale, offsetX, offsetY);
    }


    setMotionModel(is8) {
        this.#activeMotionModel = is8 ? Agent.motionModel8n() : Agent.motionModel4n()
    }

    getNeighbours(pos) {
        return this.#activeMotionModel.map(m => {
            return [
                Number((pos.x + m[0] * this.agent.resolution).toFixed(2)),
                Number((pos.y + m[1] * this.agent.resolution).toFixed(2)),
                m[2]
            ];
        })
    }

    validate(cell) {
        return this.checkTraversable(cell[0], cell[1])
    }

    checkTraversable(agentX, agentY) {
        for (const obstacle of this.obstacles) {
            const { x: obstacleX, y: obstacleY } = obstacle;

            const nX = Math.max(obstacleX, Math.min(obstacleX + 1, agentX))
            const nY = Math.max(obstacleY, Math.min(obstacleY + 1, agentY))
            const distanceToObstacle = Math.sqrt((nX - agentX) ** 2 + (nY - agentY) ** 2);
            if (distanceToObstacle < this.agent.radius)
                return false
        }
        return true
    }

    getIndex(pos) {
        return Number((pos.y * (this.cells.length / this.agent.resolution) + pos.x).toFixed(2))
    }

    getGridPosition(x, y) {
        return {
            x: x * this.agent.resolution,
            y: y * this.agent.resolution
        }
    }

    createGridAtResolution() {
        //make the search space the same size as the agent movement size
        const rows = Math.floor(this.cells[0].length / this.agent.resolution)
        const cols = Math.floor(this.cells.length / this.agent.resolution)
        this.agentGrid = {}

        this.resolutionGrid = Array(cols).fill(0)
            .map(() => {
                return Array(rows).fill(0)
            })

        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++) {
                const cell = this.getGridPosition(x, y)
                const agentgridPosition = { x: cell.x + this.agent.xOffset, y: cell.y + this.agent.yOffset }
                this.ctx.fillRect(agentgridPosition.x, agentgridPosition.y, 0.1, 0.1)
                this.getIndex(agentgridPosition)
                this.agentGrid[this.getIndex(agentgridPosition)] = agentgridPosition
                this.resolutionGrid[y][x] = this.cells[Math.floor(cell.y)][Math.floor(cell.x)]
            }
        }
    }

}
