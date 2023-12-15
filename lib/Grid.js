class Grid {
    #activeMotionModel
    constructor(config, agent, target) {
        this.scale = config.fig_dim
        this.cells = config.grid
        const canvas = document.getElementById('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = config.grid.length * config.fig_dim
        canvas.height = config.grid[0].length * config.fig_dim
        this.agent = agent
        this.#activeMotionModel = this.agent.motionModel4n()
        this.motionModelName = '4n'
        this.activeHeuristic = euclidian
        this.target = target
        this.minTargetDistance = target.radius
        this.miniImage = document.createElement('img')
        this.miniImage.id = "miniImage"
        this.miniImage.width = '200'
        document.getElementById('miniImage').append(this.miniImage)
        this.hw = 1;

        this.canvas = canvas
        this.cleanScale()
        ctx.scale(this.scale, this.scale)
        this.ctx = ctx
        this.ctx.lineWidth = 1 / this.scale

        this.validCells = [];
        this.setObstacles()
        

        this.createGridAtResolution();
        this.listeners = new Listeners(this)
        this.testsRunning = false;
    }


    setObstacles() {
        this.obstacles = []

        this.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 1) {
                    this.obstacles.push({ x, y });
                }
            });
        });
    }

    cleanScale() {
        // https://stackoverflow.com/questions/34309228/html-canvas-at-varying-pixel-densities
        if (window.devicePixelRatio !== 1) {
            var w = this.canvas.width, h = this.canvas.height;

            // scale the this.canvas by window.devicePixelRatio
            this.canvas.setAttribute('width', w * window.devicePixelRatio);
            this.canvas.setAttribute('height', h * window.devicePixelRatio);

            // use css to bring it back to regular size
            this.canvas.setAttribute('style', 'width:' + w + 'px; height:' + h + 'px;')

            // set the scale of the context
            this.canvas.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
        }
    }

    setMinTargetDistance(value) {
        this.minTargetDistance = value
    }

    reScale() { 
        this.canvas.width = this.cells.length * this.scale
        this.canvas.height = this.cells[0].length * this.scale
        this.ctx.setTransform(0, 0, 0, 0, 0, 0);

        this.cleanScale()

        this.ctx.scale(this.scale, this.scale)
        this.ctx.lineWidth = 1 / this.scale
    }

    offset(offsetX, offsetY) {
        this.ctx.setTransform(this.scale, 0, 0, this.scale, offsetX, offsetY);
    }


    gridScreenShot() {
        if (this.cells.length * this.scale > window.innerWidth || this.cells[0].length * this.scale > window.innerHeight)
            this.miniImage.setAttribute('src', this.canvas.toDataURL())
        else
            this.miniImage.setAttribute('src', '')

    }


    setMotionModel(is8) {
        this.#activeMotionModel = is8 ? this.agent.motionModel8n() : this.agent.motionModel4n();
        this.motionModelName = is8?'8n':'4n'
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
                this.agentGrid[this.getIndex(agentgridPosition)] = agentgridPosition
                this.resolutionGrid[y][x] = this.checkTraversable(Math.round(cell.x), Math.round(cell.y))===true?0:1
            }
        }
    }

}
