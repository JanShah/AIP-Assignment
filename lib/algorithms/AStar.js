class AStar {
    constructor(grid) {
        this.grid = grid
        this.isTree = document.getElementById('treeSearch').checked
    }

    solve(start, target) {
        const animationOrder = [];
        this.hw = this.grid.hw
        const start_node = new Node(start.x, start.y, 0, null)
        const end_node = new Node(target.x, target.y)
        const startIndex = this.grid.getIndex(start)
        const objStack = {
            [startIndex]: start_node
        }
        const queue = [startIndex];
        const visitedNodes = [startIndex]
        const isVisited = (cellIndex => {
            return visitedNodes.includes(cellIndex)
        })

        while (queue.length) {
            const currentIndex = queue.pop()
            const animationObjects = {}
            const currentObj = objStack[currentIndex]
            animationObjects.node = currentObj

            if (currentObj.equals(end_node, this.grid.minTargetDistance)) {
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
            const neighbours = this.grid.getNeighbours(currentObj)
            animationObjects.neighbours = []
            neighbours.forEach(neighbour => {
                if (!this.grid.validate(neighbour)) return
                const neighbourIndex = this.grid.getIndex({ x: neighbour[0], y: neighbour[1] })
                if (!isVisited(neighbourIndex)) {

                    const cell = new Node(
                        neighbour[0],
                        neighbour[1],
                        currentObj.cost + neighbour[2],
                        currentIndex
                    )

                    cell.GCost = cell.cost // distance from start to this vertex
                    cell.HCost = this.grid.activeHeuristic(cell, end_node) //distance from this to target
                    cell.FCost = cell.GCost + this.hw * cell.HCost
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
