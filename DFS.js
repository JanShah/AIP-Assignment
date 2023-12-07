class DFS {
    constructor(grid) {
        this.grid = grid
        this.cells = grid.traversableGrid
        this.motion = Grid.motionModel4n()
    }
    //give it the collision grid
    solve(start, target) {
        debugger
        const animationOrder = [];
        const getIndex = (x, y) => {
            return y * this.cells.length + x
        }
        const start_node = new Node(start[0], start[1], 0, null)
        const end_node = new Node(target[0], target[1])
        const startIndex = getIndex(...start)
        const objStack = {
            [startIndex]: start_node
        }
        const stack = [startIndex];
        const visitedNodes = [startIndex]
        const isVisited = (cellIndex => {
            return visitedNodes.includes(cellIndex)
        })

        while (stack.length) {
            const currentIndex = stack.pop()
            const animationObjects = {}
            const currentObj = objStack[currentIndex]
            animationObjects.node = currentObj
            if (currentObj.equals(end_node)) {

                let parent = currentObj.parent
                const path = [[currentObj.x, currentObj.y]]
                const cost = currentObj.cost
                console.log("Cost", cost)
                while (parent) {
                    const obj = objStack[parent]
                    path.unshift([obj.x, obj.y])
                    parent = objStack[parent].parent
                }
                return [animationOrder, path, cost]
            }

            const neighbours = this.motion.map(m => {
                return [
                    Number((currentObj.x + m[0] * this.grid.agent.resolution).toFixed(2)),
                    Number((currentObj.y + m[1] * this.grid.agent.resolution).toFixed(2)),
                    m[2]
                ]

            })
            animationObjects.neighbours = []
            neighbours.forEach(neighbour => {
                if (this.grid.validate(neighbour)) {
                    const neighbourIndex = getIndex(neighbour[0], neighbour[1])

                    if (!isVisited(neighbourIndex)) {
                        const neighbourNode = new Node(
                            neighbour[0],
                            neighbour[1],
                            currentObj.cost + neighbour[2],
                            currentIndex
                        )
                        objStack[neighbourIndex] = neighbourNode
                        animationObjects.neighbours.push([neighbour[0], neighbour[1]])
                        stack.push(neighbourIndex);

                        visitedNodes.push(neighbourIndex)

                    }
                }
            })
            animationOrder.push(animationObjects);
        }

    }
}