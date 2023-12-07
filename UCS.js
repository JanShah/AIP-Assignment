class Node {
    constructor(x, y, cost, parent) {
        this.x = x
        this.y = y
        this.cost = cost
        this.parent = parent
    }

    equals(node) {
        return this.x === node.x && this.y === node.y
    }
}


class UCS {
    constructor(grid) {
        this.grid = grid
        this.cells = grid.traversableGrid
        this.motion = Grid.motionModel4n()
    }

    solve(start, target) {
        
        const animationOrder = [];
        const getIndex = (x, y) => {
            return Number((y * this.cells.length + x).toFixed(2))
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

        while (queue.length) {
            const currentIndex = queue.pop()
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

            queue.sort((a, b) => { objStack[a].cost - objStack[b].cost })
        }

    }
}
