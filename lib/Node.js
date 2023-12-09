class Node {
    constructor(x, y, cost, parent) {
        this.x = x
        this.y = y
        this.cost = cost
        this.parent = parent
    }

    equals(node, radius = -1) {
        const dist = Math.sqrt((node.x - this.x) ** 2 + (node.y - this.y) ** 2)
        if (radius > -1) {
            if (dist < radius/2) {
                return true

            }
        }
        return this.x === node.x && this.y === node.y
    }
}

