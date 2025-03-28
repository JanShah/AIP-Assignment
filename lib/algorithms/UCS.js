class UCS {
    constructor(grid) {
        this.grid = grid
        this.isTree = document.getElementById('treeSearch').checked
    }

    solve(start, target) {
        const animationOrder = [];
        const start_node = new Node(start.x, start.y, 0, null)
        const end_node = new Node(target.x, target.y)
        const startIndex = this.grid.getIndex(start)
        const objStack = {
            [startIndex]: start_node
        }
        const queue = [startIndex];
        const visitedNodes = [startIndex]
        const isVisited = (cellIndex => {
            if (this.isTree) return false
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
                    const obj = objStack[parent]
                    path.unshift([obj.x, obj.y])
                    parent = objStack[parent].parent
                }
                return [animationOrder, path, cost]
            }



            const neighbours = this.grid.getNeighbours(currentObj)
            animationObjects.neighbours = []
            neighbours.forEach(neighbour => {
                if (this.grid.validate(neighbour)) {

                    const neighbourIndex = this.grid.getIndex({ x: neighbour[0], y: neighbour[1] })
                    if (!isVisited(neighbourIndex)) {

                        animationObjects.neighbours.push([neighbour[0], neighbour[1]])
                        const neighbourNode = new Node(
                            neighbour[0],
                            neighbour[1],
                            currentObj.cost + neighbour[2],
                            currentIndex
                        )
                        objStack[neighbourIndex] = neighbourNode
                        queue.unshift(neighbourIndex);
                        visitedNodes.push(neighbourIndex)
                    }
                }
            })
            animationOrder.push(animationObjects);
            queue.sort((a, b) => { return objStack[b].cost - objStack[a].cost})
        }

    }
}
