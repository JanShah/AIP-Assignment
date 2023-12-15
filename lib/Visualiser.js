class Visualiser {
    constructor(ctx, grid) {
        this.agentScanDotSize = 0.1
        this.agentNeighborDotSize = 0.1
        this.agentVisitedDotSize = 0.1
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
        this.showSolution = showSolution.checked
        this.showVisited = showVisited.checked
        this.showNeighbours = showNeighbours.checked
        this.showFinalPath = showFinalPath.checked
        this.showSolutionNodes = showSolutionNodes.checked
        this.showEdges = showEdges.checked
        this.quickSolve = quickSolve.checked
        this.finalSteps = 0
        this.maxStep = Infinity
    }

    draw() {
        setInterval(() => {
            if (this.grid.testsRunning) return
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
            if (this.showBigGrid)
                this.drawGrid()
            if (this.showBarrierOverlay)
                this.drawScaledOverlay()
            if (this.showRobotScan)
                this.drawAgentScan()
            
            if (this.showSolution)
                this.drawSolutionPath()
            this.grid.target.draw(this.ctx, this.grid.minTargetDistance)
            this.grid.agent.draw(this.ctx)
            this.grid.gridScreenShot()
        }, 30)
    }

    drawAgentScan() {
        Object.keys(this.grid.agentGrid).forEach(key => {
            const cell = this.grid.agentGrid[key]
            if (!this.grid.checkTraversable(cell.x, cell.y))
                this.ctx.fillStyle = colours.agentBarrierDetect.fill
            else
                this.ctx.fillStyle = colours.agentFreeDetect.fill
            this.ctx.fillRect(cell.x - this.agentScanDotSize / 2, cell.y - this.agentScanDotSize / 2, this.agentScanDotSize, this.agentScanDotSize);

        })
    }

    drawScaledOverlay() {
        this.grid.resolutionGrid.forEach((row, _y) => {
            row.forEach((cell, _x) => {

                if (cell === 1)
                    this.ctx.fillStyle = colours.boundaryBarrier.fill;
                else
                    this.ctx.fillStyle = colours.boundaryOpen.fill;

                const { x, y } = this.grid.getGridPosition(_x, _y)
                this.ctx.beginPath();
                this.ctx.roundRect(
                    x + .01,
                    y + .01,
                    this.grid.agent.resolution - .02,
                    this.grid.agent.resolution - .02,
                    0.05
                );
                this.ctx.fill()
            });
        });
    }


    drawSolutionPath() {
        let currentStep = 0
        this.drawnVisitedPath.forEach(group => {
            if (this.showVisited) {
                if (currentStep > this.maxStep) return
                this.ctx.fillStyle = colours.visited.fill
                this.ctx.fillRect(group.node.x - this.agentVisitedDotSize / 2,
                    group.node.y - this.agentVisitedDotSize / 2,
                    this.agentVisitedDotSize,
                    this.agentVisitedDotSize);
                currentStep++
            }
            group.neighbours.forEach(xy => {
                if (currentStep > this.maxStep) return
                currentStep++
                this.ctx.fillStyle = colours.neighbours.fill
                this.ctx.strokeStyle = colours.neighbours.stroke
                if (this.showNeighbours) {
                    this.ctx.fillRect(
                        xy[0] - this.agentNeighborDotSize / 2,
                        xy[1] - this.agentNeighborDotSize / 2,
                        this.agentNeighborDotSize,
                        this.agentNeighborDotSize)
                    if (colours.neighbours.stroke) {
                        this.ctx.strokeRect(
                            xy[0] - this.agentNeighborDotSize / 2,
                            xy[1] - this.agentNeighborDotSize / 2,
                            this.agentNeighborDotSize,
                            this.agentNeighborDotSize)
                    }
                }
                if (this.showEdges) {
                    this.ctx.beginPath()
                    this.ctx.moveTo(group.node.x, group.node.y)
                    this.ctx.lineTo(...xy)
                    this.ctx.stroke()
                }
            })

        });

        this.drawnSolution
            .forEach((cell, index, arr) => {
                if (currentStep > this.maxStep) return
                currentStep++
                if (this.showSolutionNodes)
                    this.drawSolutionCell(cell)
                if (index) {
                    if (this.showFinalPath)
                        this.drawSolutionLine(arr[index - 1], cell)
                }
            });


        if (!this.stepThroughPath() && this.totalStep > 0 && !this.finalSteps) {
            this.totalStep = currentStep
            this.finalSteps = this.totalStep
            this.onPathEnd()
            if (this.grid.agent.follow)
                this.grid.agent.moveOnPath(this.drawnSolution.slice(0))
        }
        
        this.totalStep = currentStep
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
        const cellSize = this.grid.agent.resolution - .3
        this.ctx.fillStyle = colours.solution.fill
        this.ctx.fillRect(x - cellSize / 2, y - cellSize / 2, cellSize, cellSize);
        if (colours.solution.stroke) {
            this.ctx.strokeStyle = colours.solution.stroke
            this.ctx.strokeRect(x - cellSize / 2, y - cellSize / 2, cellSize, cellSize);
        }
    }

    stepThroughPath() {

        if (this.visitedPath.length) {
            if (this.quickSolve) {
                this.drawnVisitedPath = [...this.drawnVisitedPath, ...this.visitedPath]
                this.visitedPath = []
            } else {
                this.drawnVisitedPath.push(this.visitedPath.shift())
            }
            return true
        } else if (this.solutionPath.length) {
            if (this.quickSolve) {
                this.drawnSolution = [...this.drawnSolution, ...this.solutionPath]
                this.solutionPath = []
            } else {
                this.drawnSolution.push(this.solutionPath.shift())
            }
            return true
        }
        return false
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
            this.maxStep = Infinity
            this.finalSteps = null
            this.visitedPath = []
            this.drawnVisitedPath = [];
            this.solutionPath = []
            this.drawnSolution = []
            this.visitedPath = solution[0]
            this.solutionPath = solution[1]

            // console.log(JSON.parse(JSON.stringify(solution)))
        }
    }


}