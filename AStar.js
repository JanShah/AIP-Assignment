class AStar {
    constructor(grid) {
        this.grid = grid
        this.cells = grid.traversableGrid
        this.heuristic = euclidian
        this.motion = Grid.motionModel4n()
    }

    setCostFn(whichFn) {
        switch (whichFn) {
            case 'Euclidian':
                this.heuristic = euclidian
                break;
            case 'Chebyshev':
                this.heuristic = chebyshev
                break;
            case 'Manhattan':
                this.heuristic = manhattan
                break;
            default:
                this.heuristic = euclidian

                break;
        }
    }
    solve(start, target) {
        const animationOrder = [];
        this.hw = 1
        const getIndex = (x, y) => {
            return y * this.cells.length + x
        }
        const start_node = new Node(start[0], start[1], 0, null)
        const end_node = new Node(target[0], target[1])
        const startIndex = getIndex(...start)
        const objStack = {
            [startIndex]: start_node
        }
        const queue = [startIndex];
        const visitedNodes = [startIndex]
        const isVisited = (cellIndex => {
            return visitedNodes.includes(cellIndex)
        })

        // const queue = [[start, [start], 0]]; //open set
        while (queue.length) {
            const currentIndex = queue.pop()
            const animationObjects = {}
            const currentObj = objStack[currentIndex]
            animationObjects.node = currentObj

            // const [current, path, cost] = queue.shift()
            if (currentObj.equals(end_node)) {
                let parent = currentObj.parent
                const path = [[currentObj.x, currentObj.y]]
                const cost = currentObj.cost
                while (parent) {
                    const obj = objStack[parent];
                    path.unshift([obj.x, obj.y]);
                    parent = obj.parent;
                }
                return [animationOrder, path, cost]
            }
            const neighbours = this.motion.map(m => {
                return [
                    Number((currentObj.x + m[0] * this.grid.agent.resolution).toFixed(2)),
                    Number((currentObj.y + m[1] * this.grid.agent.resolution).toFixed(2)),
                    m[2]
                ];
            });
            animationObjects.neighbours = []
            neighbours.forEach(neighbour => {
                if (!this.grid.validate(neighbour)) return
                const neighbourIndex = getIndex(neighbour[0], neighbour[1])
                if (!isVisited(neighbourIndex)) {

                    const cell = new Node(
                        neighbour[0],
                        neighbour[1],
                        currentObj.cost + neighbour[2],
                        currentIndex
                    )

                    cell.GCost = cell.cost // distance from start to this vertex
                    cell.HCost = this.heuristic(cell, end_node) //distance from this to target
                    cell.FCost = cell.GCost + this.hw * neighbour[2]
                    cell.visited = true
                    animationObjects.neighbours.push([neighbour[0], neighbour[1]])

                    queue.push(neighbourIndex)
                    objStack[neighbourIndex] = cell
                    visitedNodes.push(neighbourIndex)
                }
            })

            queue.sort((a, b) => {
                const aNode = objStack[a]
                const bNode = objStack[b]
                if (aNode.FCost === bNode.FCost) {
                    return bNode.HCost - aNode.HCost
                }
                return bNode.FCost - aNode.FCost
            })

            animationOrder.push(animationObjects)
        }

    }
}
