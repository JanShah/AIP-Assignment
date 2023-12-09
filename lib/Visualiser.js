class Visualiser {
    constructor(ctx, grid) {
        this.ctx = ctx
        this.grid = grid
        this.visitedPath = []
        this.drawnVisitedPath = [];
        this.solutionPath = []
        this.drawnSolution = []
        this.draw();
        this.showBigGrid = showBigGrid.checked
        this.showBarrierOverlay = showBarrierOverlay.checked
        this.showRobotScan = showRobotScan.checked
        this.quickSolve = false
    }

    draw() {
        setInterval(() => {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
            if (this.showBigGrid)
                this.drawGrid()
            if (this.showBarrierOverlay)
                this.drawScaledOverlay()
            if (this.showRobotScan)
                this.drawAgentScan()
            this.grid.agent.draw(this.ctx)
            this.drawSolutionPath()
            this.grid.target.draw(this.ctx)
        }, 10)
    }

    drawAgentScan() {
        Object.keys(this.grid.agentGrid).forEach(key => {
            const cell = this.grid.agentGrid[key]
            if (!this.grid.checkTraversable(cell.x, cell.y))
                this.ctx.fillStyle = colours.agentBarrierDetect.fill
            else
                this.ctx.fillStyle = colours.agentFreeDetect.fill
            this.ctx.fillRect(cell.x - .05, cell.y - .05, .1, .1);

        })
    }

    drawScaledOverlay() {
        this.grid.resolutionGrid.forEach((row, _y) => {
            row.forEach((cell, _x) => {
                if (cell === 1)
                    this.ctx.fillStyle = colours.barrier.fill;
                else
                    this.ctx.fillStyle = colours.open.fill;

                const { x, y } = this.grid.getGridPosition(_x, _y)
                this.ctx.fillRect(
                    x,
                    y,
                    this.grid.agent.resolution,
                    this.grid.agent.resolution
                );
            });
        });
    }


    drawSolutionPath() {
        this.drawnVisitedPath.forEach(group => {
            this.ctx.fillStyle = colours.visited.fill

            this.ctx.fillRect(group.node.x - .1, group.node.y - .1, .2, .2);
            group.neighbours.forEach(xy => {
                this.ctx.fillStyle = colours.neighbours.fill
                this.ctx.strokeStyle = colours.neighbours.stroke

                this.ctx.fillRect(xy[0] - 0.05, xy[1] - 0.05, 0.1, 0.1)
                this.ctx.beginPath()
                this.ctx.moveTo(group.node.x, group.node.y)
                this.ctx.lineTo(...xy)
                this.ctx.stroke()
            })

        });

        this.drawnSolution
            .forEach((cell, index, arr) => {
                this.drawSolutionCell(cell)
                if (index) {
                    this.drawSolutionLine(arr[index - 1], cell)
                }
            });

        this.stepThroughPath()
    }

    drawSolutionLine(start, end) {
        this.drawLine(
            start, end, colours.solution.stroke, 4
        )
    }
    drawLine(start, end, colour = "red", lineWidth = 4) {
        this.ctx.save()
        this.ctx.lineWidth = lineWidth / this.grid.scale
        this.ctx.strokeStyle = colour
        this.ctx.beginPath()
        this.ctx.moveTo(start[0], start[1])
        this.ctx.lineTo(end[0], end[1])
        this.ctx.stroke()
        this.ctx.restore();
    }

    drawSolutionCell([x, y]) {
        const cellSize = this.grid.agent.resolution - .2
        this.ctx.fillRect(x - cellSize / 2, y - cellSize / 2, cellSize, cellSize);
    }

    stepThroughPath() {
        if (this.visitedPath.length) {
            if (this.quickSolve) {
                this.drawnVisitedPath = [...this.drawnVisitedPath, ...this.visitedPath]
                this.visitedPath = []
            } else {
                this.drawnVisitedPath.push(this.visitedPath.shift())
            }
        } else if (this.solutionPath.length) {
            if (this.quickSolve) {
                this.drawnSolution = [...this.drawnSolution, ...this.solutionPath]
                this.solutionPath = []
            } else {
                this.drawnSolution.push(this.solutionPath.shift())
            }
        }
    }

    drawGrid() {
        this.grid.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 0)
                    this.ctx.fillStyle = colours.gridOpen.fill;
                else
                    this.ctx.fillStyle = colours.gridClosed.fill
                this.ctx.fillRect(x + .02, y + .02, .96, .96);
            });
        });
    }


    visualisePaths(solution) {
        if (solution) {
            this.visitedPath = []
            this.drawnVisitedPath = [];
            this.solutionPath = []
            this.drawnSolution = []
            this.visitedPath = solution[0]
            this.solutionPath = solution[1]

            console.log(solution)
        }
    }


}