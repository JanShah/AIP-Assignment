class BFS {
    constructor(grid) {
        this.grid = grid
        this.isTree = document.getElementById('treeSearch').checked
    }
    //give it the collision grid
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
            if(this.isTree) return false
            return visitedNodes.includes(cellIndex)
        })
        while (queue.length) {
            const animationObjects = {}
            const currentIndex = queue.pop()

            const currentObj = objStack[currentIndex]
            animationObjects.node = currentObj
            if (currentObj.equals(end_node,this.grid.agent.radius)) {

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
                        const neighbourNode = new Node(
                            neighbour[0],
                            neighbour[1],
                            currentObj.cost + neighbour[2],
                            currentIndex
                        )
                        animationObjects.neighbours.push([neighbour[0], neighbour[1]])
                        objStack[neighbourIndex] = neighbourNode
                        queue.unshift(neighbourIndex);
                        visitedNodes.push(neighbourIndex)

                    }
                }
            })
            animationOrder.push(animationObjects)
        }
        // return [animationOrder, [], 0]

    }
}