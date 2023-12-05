class Agent {
    constructor(config) {
        this.radius = config.robot_radius
        this.x = config.sx
        this.y = config.sy
        this.resolution = config.grid_size
        this.scale = config.fig_dim
    }

    getGridPosition(x, y) {
        return {
            x: x * this.resolution,
            y: y * this.resolution
        }
    }


    draw(ctx) {
        ctx.fillStyle = 'rgba(100,100,0,0.3)'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
    }

}

class Target {
    constructor({ gx, gy, grid_size: radius }) {
        this.x = gx
        this.y = gy
        this.radius = radius
    }
    draw(ctx) {
        ctx.fillStyle = 'blue'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
    }
}


class Grid {
    constructor(config, agent) {
        this.scale = config.fig_dim
        this.cells = config.grid
        const canvas = document.getElementById('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = config.grid.length * config.fig_dim
        canvas.height = config.grid[0].length * config.fig_dim
        this.canvas = canvas
        ctx.scale(this.scale, this.scale)
        this.ctx = ctx
        this.agent = agent
        this.target = new Target(config)
        this.target.draw(ctx)
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
        this.createTraversableGrid()

        //testing DFS code
        //some changes were needed, most I think could be solved easily. 
        const dfs = new BFS(this)
        const solution = dfs.solve([this.agent.x, this.agent.y], [this.target.x, this.target.y])
        console.log(solution)
        if (solution) {
            this.ctx.fillStyle = 'green'
            const pathToSolution = solution[1].map(cell => {
                const position = [cell[0] / this.agent.resolution, cell[1] / this.agent.resolution]
                this.ctx.fillRect(cell[0] - .1, cell[1] - .1, .2, .2);
                return position
            });
            console.log(pathToSolution)
        }

    }

    static motionModel4n() {
        return [
            [1, 0, 1],
            [0, 1, 1],
            [-1, 0, 1],
            [0, -1, 1]
        ]
    }

    getGridIndex(x, y) {
        return (node.y - self.min_y) * self.xwidth + (node.x - self.min_x)

    }

    validate(cell) {
        let [x, y] = cell;
        y /= this.agent.resolution
        x /= this.agent.resolution
        return this.traversableGrid[y] &&
            this.traversableGrid[y][x] &&
            this.traversableGrid[y][x] === true
    }

    createTraversableGrid() {
        this.traversableGrid = []

        this.resolutionGrid.forEach((row, _y) => {
            this.traversableGrid.push([]);
            row.forEach((cell, _x) => {
                if (cell === true) return
                const { x, y } = this.agent.getGridPosition(_x, _y);
                const isTraversable = this.checkTraversable(x, y);
                this.traversableGrid[_y].push(isTraversable); // Push the result of checkTraversable
                if (isTraversable) {
                    this.validCells.push({ x, y }); // Also push to validCells array
                }
            });
        });
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
        this.resolutionGrid = Array(cols).fill(0)
            .map(() => {
                return Array(rows).fill(0)
            })
        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++) {
                const cell = this.getGridPosition(x, y)
                this.resolutionGrid[y][x] = this.cells[Math.floor(cell.y)][Math.floor(cell.x)]
            }
        }
    }

    draw() {
        this.ctx.fillStyle = 'rgba(50,100,150,0.8)';
        this.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 1)
                    this.ctx.fillRect(x, y, .96, .96);
            });
        });
        this.drawMovableAreas()
        this.agent.draw(this.ctx)
        this.drawScaledOverlay()
    }
    drawMovableAreas() {
        if (!this.traversableGrid) return
        this.ctx.fillStyle = 'rgba(20,20,150,0.9)';
        this.traversableGrid.forEach((row, _y) => {
            row.forEach((cell, _x) => {
                const { x, y } = this.getGridPosition(_x, _y)
                if (cell === true)
                    this.ctx.fillRect(x - .05, y - .05, .1, .1);
            });
        });
    }
    drawScaledOverlay() {

        this.resolutionGrid.forEach((row, _y) => {
            row.forEach((cell, _x) => {
                if (cell === 1)
                    this.ctx.fillStyle = 'rgba(150,100,50,0.4)';
                else
                    this.ctx.fillStyle = 'rgba(50,100,150,0.25)';

                const { x, y } = this.getGridPosition(_x, _y)
                this.ctx.fillRect(
                    x,
                    y, this.agent.resolution - .01, this.agent.resolution - .01
                );
            });
        });
    }
}

async function getConfig() {
    const configFile = window.location.origin + '/MapConfig/config9x9.json';
    const config = await getData(configFile);
    config.grid = await getMapFile(config.map_xlsx);
    return config;
}

async function getMapFile(filename) {
    const file = await (await fetch(window.location.origin + filename)).arrayBuffer();
    return await XLSX.utils.sheet_to_json(XLSX.read(file)
        .Sheets['Sheet1'], { header: 1 }).map(obj =>
            Object.keys(obj).map(key => obj[key]).reverse()
        ).reverse();
}

async function getData(url) {
    return await fetch(url)
        .then(async res => await res.json())
        .then(data => data);
}


window.addEventListener('DOMContentLoaded', start)

async function start() {
    const config = await getConfig()
    const agent = new Agent(config);
    const grid = new Grid(config, agent)
    grid.draw()
    console.log(grid.resolutionGrid)



}

