class Grid {
    #activeMotionModel
    constructor(config, agent, target) {
        this.scale = config.fig_dim
        this.cells = config.grid
        const canvas = document.getElementById('canvas')
        this.agent = agent
        this.#activeMotionModel = this.agent.motionModel4n()
        this.motionModelName = '4n'
        this.activeHeuristic = euclidian
        this.target = target
        this.minTargetDistance = target.radius * 2
        this.miniImage = document.createElement('img')
        this.miniImage.id = "miniImageImg"
        this.miniImage.width = '200'
        document.getElementById('miniImage').append(this.miniImage)
        this.hw = 1;
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.configureCanvas()

        this.listeners = new Listeners(this)
        this.testsRunning = false;
    }

    static getNewCells(rows, cols) {
        return new Array(cols).fill(0)
            .map((_, y, arrY) => {
                return new Array(rows).fill(0)
                    .map((_, x, arrX) => {
                        let val = 0;
                        if (x === 0 || x === arrX.length - 1) val = 1;
                        if (y === 0 || y === arrY.length - 1) val = 1;

                        return val
                    });
            });
    }

    newGrid(rows, cols) {
        this.cells = Grid.getNewCells(rows, cols);
        this.agent.setXY(2, 2);
        this.target.setXY(this.cells.length - 3, this.cells.length - 3);
        this.configureCanvas();
    }

    configureCanvas() {
        this.canvas.width = this.cells[0].length * this.scale
        this.canvas.height = this.cells.length * this.scale
        this.cleanScale()
        this.ctx.scale(this.scale, this.scale)
        this.ctx.lineWidth = 1 / this.scale
        this.validCells = [];
        this.setObstacles()
        this.createGridAtResolution();
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
            const w = this.canvas.width, h = this.canvas.height;
            this.canvas.setAttribute('width', w * window.devicePixelRatio);
            this.canvas.setAttribute('height', h * window.devicePixelRatio);
            this.canvas.setAttribute('style', 'width:' + w + 'px; height:' + h + 'px;')
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
        this.motionModelName = is8 ? '8n' : '4n'
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

    getIdealPosition(_x, _y) {
        let x = _x;
        let y = _y;

        for (const obstacle of this.obstacles) {
            const { x: oX, y: oY } = obstacle;
            const nX = Math.max(oX, Math.min(oX + 1, x));
            const nY = Math.max(oY, Math.min(oY + 1, y));
            const distanceToObstacle = Math.sqrt((nX - x) ** 2 + (nY - y) ** 2);
            if (distanceToObstacle < this.agent.radius) {
                const nvX = (nX - x) / distanceToObstacle;
                const nvY = (nY - y) / distanceToObstacle;
                const overlap = this.agent.radius - distanceToObstacle;
                x -= nvX * overlap;
                y -= nvY * overlap;
            }
        }
        // if the agent goes inside the boundary, it must be intentional. Let it happen.
        if (isNaN(x))
            x = _x
        if (isNaN(y)) {
            y = _y
        }
        return { x, y };
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
                this.resolutionGrid[y][x] = this.checkTraversable(Math.round(cell.x), Math.round(cell.y)) === true ? 0 : 1
            }
        }
    }

}
